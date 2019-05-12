/**
 * Add effects that happen after a property is set: observer, computed, reflect.
 */
import Graph from '../etc/graph.js';

const COMPUTED_REGEX = /^function[^(]*\(([^)]*)\)[\s\S]*$/;

// TODO: can we be more naive and use `initialized` instead of these flags?
const COMPUTE_READY = Symbol.for('__computeReady__');
const OBSERVE_READY = Symbol.for('__observeReady__');
const REFLECT_READY = Symbol.for('__reflectReady__');

const computedMap = new Map();
const graphMap = new Map();

export default superclass =>
  class extends superclass {
    static parseComputed(computed) {
      // Note, we don't protect against deconstruction, defaults, and comments.
      if (computedMap.has(computed) === false) {
        try {
          let candidate;
          eval(`candidate = (() => function ${computed} {})()`);
          if (candidate instanceof Function) {
            const dependencies = `${candidate}`
              .match(COMPUTED_REGEX)[1]
              .split(',')
              .map(part => part.trim())
              .filter(part => part);
            const array = [candidate.name, ...dependencies];
            computedMap.set(computed, array);
          }
        } catch (err) {
          throw new Error(`Malformed computed "${computed}".`);
        }
      }
      return computedMap.get(computed);
    }

    static createGraph(properties) {
      const nodes = Array.from(Object.keys(properties));
      const edges = [];
      for (const [property, definition] of Object.entries(properties)) {
        if (definition.computed) {
          const { computed } = definition;
          const dependencies = this.parseComputed(computed).slice(1);
          for (const dependency of dependencies) {
            if (dependency in properties === false) {
              throw new Error(`Missing dependency "${dependency}".`);
            }
            edges.push([dependency, property]);
          }
        }
      }
      return new Graph(nodes, edges);
    }

    static get graph() {
      if (graphMap.has(this) === false) {
        graphMap.set(this, this.createGraph(this.properties));
      }
      return graphMap.get(this);
    }

    static performCompute(target, graph, property, properties) {
      graph
        .fromNode(property)
        .solution.slice(1)
        .forEach(dependant => {
          const { computed, type } = properties[dependant];
          const [method, ...dependencies] = this.parseComputed(computed);
          const args = dependencies.map(dependency => target[dependency]);
          const value = this.applyType(this[method](...args), type);
          this.changeProperty(target, dependant, properties[dependant], value);
        });
    }

    static performInitialCompute(target, graph, properties) {
      graph.solution
        .filter(property => properties[property].computed)
        .forEach(property => {
          // TODO: #27: skip initial compute if dependencies are undefined.
          const { computed, type } = properties[property];
          const [method, ...dependencies] = this.parseComputed(computed);
          const args = dependencies.map(dependency => target[dependency]);
          const value = this.applyType(this[method](...args), type);
          this.changeProperty(target, property, properties[property], value);
        });
    }

    static analyzeProperty(property, definition) {
      if (definition.computed) {
        const [method] = this.parseComputed(definition.computed);
        if (this[method] instanceof Function === false) {
          throw new Error(`Missing computed method "${method}".`);
        }
      }
      if (definition.observer) {
        if (this[definition.observer] instanceof Function === false) {
          throw new Error(`Missing observer method "${definition.observer}".`);
        }
      }
      return super.analyzeProperty(property, definition);
    }

    static analyzeProperties(properties) {
      // Synchronously ensure that our property graph is valid.
      const graph = this.graph;
      super.analyzeProperties(properties);
    }

    static serializeProperty(target, property, definition, value) {
      switch (definition.type.name) {
        case 'Boolean':
          return value ? '' : undefined;
        case 'String':
        case 'Number':
          return value != null ? value.toString() : undefined;
        default:
          const message =
            `Attempted to serialize "${property}" and reflect, but it is not ` +
            `a Boolean, String, or Number type (${definition.type.name}).`;
          target.dispatchError(new Error(message));
      }
    }

    static reflectPropertyToAttribute(target, property, definition, value) {
      const attribute = this.camelToDashCase(property);
      const serialization = this.serializeProperty(
        target,
        property,
        definition,
        value
      );
      if (serialization === undefined) {
        target.removeAttribute(attribute);
      } else {
        target.setAttribute(attribute, serialization);
      }
    }

    static beforeInitialRender(target) {
      super.beforeInitialRender(target);
      this.performInitialCompute(target, this.graph, this.cachedProperties);
      target[COMPUTE_READY] = true;
    }

    static afterInitialRender(target) {
      super.afterInitialRender(target);
      target[REFLECT_READY] = true;
      target[OBSERVE_READY] = true;
      const entries = Object.entries(this.cachedProperties);
      for (const [property, definition] of entries) {
        const value = target[property];
        if (definition.reflect && value !== undefined) {
          this.reflectPropertyToAttribute(target, property, definition, value);
        }
        if (definition.observer && value !== undefined) {
          // TODO: #26: switch order of arguments.
          this[definition.observer](target, undefined, value);
        }
      }
    }

    static getInitialValue(target, property, definition) {
      if (!definition.computed) {
        return super.getInitialValue(target, property, definition);
      }
    }

    static shouldPropertyChange(
      target,
      property,
      definition,
      rawValue,
      oldRawValue
    ) {
      return (
        !definition.computed &&
        super.shouldPropertyChange(
          target,
          property,
          definition,
          rawValue,
          oldRawValue
        )
      );
    }

    static propertyDidChange(target, property, definition, value, oldValue) {
      super.propertyDidChange(target, property, definition, value, oldValue);
      if (definition.reflect && target[REFLECT_READY]) {
        this.reflectPropertyToAttribute(target, property, definition, value);
      }
      if (definition.observer && target[OBSERVE_READY]) {
        // TODO: #26: switch order of arguments.
        this[definition.observer](target, oldValue, value);
      }
      const graph = this.graph;
      if (graph.roots.includes(property) && target[COMPUTE_READY]) {
        this.performCompute(target, graph, property, this.cachedProperties);
      }
    }
  };
