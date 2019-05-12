/**
 * Add effects that happen after a property is set: observer, computed, reflect.
 */
import Graph from '../etc/graph.js';

const COMPUTED_REGEX = /^function[^(]*\(([^)]*)\)[\s\S]*$/;

const graphMap = new WeakMap();

export default superclass =>
  class extends superclass {
    static transformPropertyDefinition(definition) {
      if (definition.computed) {
        const readOnly = definition.computed ? true : false;
        const computed = this.parseComputed(definition.computed);
        return super.transformPropertyDefinition(
          Object.assign({}, definition, { computed, readOnly })
        );
      }
      return super.transformPropertyDefinition(definition);
    }

    static createGraph(properties) {
      const nodes = Array.from(Object.keys(properties));
      const edges = [];
      for (const [property, definition] of Object.entries(properties)) {
        if (definition.computed) {
          const dependencies = definition.computed.slice(1);
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
        graphMap.set(this, this.createGraph(this.cachedProperties));
      }
      return graphMap.get(this);
    }

    static performCompute(target, graph, property, properties) {
      graph
        .fromNode(property)
        .solution.slice(1)
        .forEach(dependant => {
          const definition = properties[dependant];
          const [method, ...dependencies] = definition.computed;
          const args = dependencies.map(dependency => target[dependency]);
          const value = this.applyType(this[method](...args), definition.type);
          this.changeProperty(target, dependant, properties[dependant], value);
        });
    }

    static performInitialCompute(target, graph, properties) {
      graph.solution
        .filter(property => properties[property].computed)
        .forEach(property => {
          // TODO: #27: skip initial compute if dependencies are undefined.
          const definition = properties[property];
          const [method, ...dependencies] = definition.computed;
          const args = dependencies.map(dependency => target[dependency]);
          const value = this.applyType(this[method](...args), definition.type);
          this.changeProperty(target, property, properties[property], value);
        });
    }

    static analyzeProperty(property, definition) {
      super.analyzeProperty(property, definition);
      if (definition.computed) {
        const [method] = definition.computed;
        if (this[method] instanceof Function === false) {
          throw new Error(`Missing computed method "${method}".`);
        }
      }
      if (definition.observer) {
        if (this[definition.observer] instanceof Function === false) {
          throw new Error(`Missing observer method "${definition.observer}".`);
        }
      }
    }

    static analyze() {
      super.analyze();
      this.graph; // Ensure that our graph is valid. See graph getter.
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
    }

    static afterInitialRender(target) {
      super.afterInitialRender(target);
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

    static propertyDidChange(target, property, definition, value, oldValue) {
      super.propertyDidChange(target, property, definition, value, oldValue);
      if (definition.reflect && this.isTargetInitialized(target)) {
        this.reflectPropertyToAttribute(target, property, definition, value);
      }
      if (definition.observer && this.isTargetInitialized(target)) {
        // TODO: #26: switch order of arguments.
        this[definition.observer](target, oldValue, value);
      }
      const graph = this.graph;
      if (graph.roots.includes(property) && this.isTargetInitialized(target)) {
        this.performCompute(target, graph, property, this.cachedProperties);
      }
    }

    static parseComputed(computed) {
      // Note, we don't protect against deconstruction, defaults, and comments.
      try {
        let candidate;
        eval(`candidate = (() => function ${computed} {})()`);
        if (candidate instanceof Function) {
          const dependencies = `${candidate}`
            .match(COMPUTED_REGEX)[1]
            .split(',')
            .map(part => part.trim())
            .filter(part => part);
          return [candidate.name, ...dependencies];
        }
      } catch (err) {
        throw new Error(`Malformed computed "${computed}".`);
      }
    }
  };
