/**
 * Add effects that happen after a property is set: observer, computed, reflect.
 */
import Graph from '../etc/graph.js';

const COMPUTED_REGEX = /^function[^(]*\(([^)]*)\)[\s\S]*$/;
const COMPUTE_READY = Symbol.for('__computeReady__');
const OBSERVE_READY = Symbol.for('__observeReady__');
const REFLECT_READY = Symbol.for('__reflectReady__');
const PROPERTY_GRAPH = Symbol.for('__propertyGraph__');
const COMPUTE_FINALIZERS = Symbol.for('__computeFinalizers__');
const INITIAL_COMPUTE_FINALIZER = Symbol.for('__initialComputeFinalizer__');
const INITIAL_COMPUTE = Symbol.for('__initialCompute__');

const computedMap = new Map();

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

    static createPropertyGraph(properties) {
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

    static createComputeFinalizers(properties) {
      const finalizers = {};

      // Loop once to add all the computed property finalizers.
      for (const [property, definition] of Object.entries(properties)) {
        if (definition.computed) {
          const { method, dependencies, type } = definition;
          finalizers[property] = target => () => {
            const args = dependencies.map(dependency => target[dependency]);
            const value = this.applyType(method(...args), type);
            const finalDefinition = target.finalizedProperties[property];
            this.changeProperty(target, property, finalDefinition, value);
          };
        }
      }

      // Loop again to add all the root dependency property finalizers.
      for (const [property, definition] of Object.entries(properties)) {
        if (definition.dependants) {
          const { dependants } = definition;
          finalizers[property] = target => {
            const callbacks = dependants.map(dependant =>
              finalizers[dependant](target)
            );
            return () => callbacks.forEach(callback => callback());
          };
        }
      }

      return finalizers;
    }

    static createInitialComputeFinalizer(properties) {
      const propertyGraph = properties[PROPERTY_GRAPH];
      return target => {
        const callbacks = propertyGraph.solution
          .filter(property => properties[property].computed)
          .map(property => {
            const { method, dependencies, type } = properties[property];
            return () => {
              // TODO: #27: skip initial compute if dependencies are undefined.
              const args = dependencies.map(dependency => target[dependency]);
              const value = this.applyType(method(...args), type);
              const finalDefinition = target.finalizedProperties[property];
              this.changeProperty(target, property, finalDefinition, value);
            };
          });
        return () => callbacks.forEach(callback => callback());
      };
    }

    static analyzePropertyComputed(property, definition, propertyGraph) {
      let next = definition;
      const isDependency = propertyGraph.edges.some(
        edge => edge[0] === property
      );
      if (!definition.computed && isDependency) {
        const dependants = Graph.createFromNode(
          propertyGraph,
          property
        ).solution.slice(1);
        next = Object.assign({}, definition, { dependants });
      } else if (definition.computed) {
        const [methodName, ...dependencies] = this.parseComputed(
          definition.computed
        );
        if (this[methodName] instanceof Function === false) {
          throw new Error(`Cannot resolve methodName "${methodName}".`);
        }
        const method = this[methodName].bind(this);
        next = Object.assign({}, definition, {
          method,
          dependencies,
          readOnly: true,
        });
      }
      return next;
    }

    static analyzePropertyObserver(property, definition) {
      let next = definition;
      if (definition.observer) {
        const methodName = definition.observer;
        if (this[methodName] instanceof Function === false) {
          throw new Error(`Cannot resolve methodName "${methodName}".`);
        }
        const observe = this[methodName].bind(this);
        next = Object.assign({}, definition, { observe });
      }
      return next;
    }

    static analyzeProperty(property, definition, properties) {
      let next = definition;
      const propertyGraph = properties[PROPERTY_GRAPH];
      next = super.analyzeProperty(property, next, properties);
      next = this.analyzePropertyComputed(property, next, propertyGraph);
      next = this.analyzePropertyObserver(property, next);
      return next;
    }

    static analyzeProperties(properties) {
      const graph = this.createPropertyGraph(properties);
      let next = Object.assign({}, properties, { [PROPERTY_GRAPH]: graph });
      next = super.analyzeProperties(next);
      const computeFinalizers = this.createComputeFinalizers(next);
      const initialComputeFinalizers = this.createInitialComputeFinalizer(next);
      next = Object.assign({}, next, {
        [COMPUTE_FINALIZERS]: computeFinalizers,
        [INITIAL_COMPUTE_FINALIZER]: initialComputeFinalizers,
      });
      return next;
    }

    static finalizeProperty(target, property, definition, properties) {
      let next = super.finalizeProperty(
        target,
        property,
        definition,
        properties
      );
      const computeFinalizers = properties[COMPUTE_FINALIZERS];
      if (next.dependants) {
        const compute = computeFinalizers[property](target);
        next = Object.assign({}, next, { compute });
      }
      return next;
    }

    static finalizeProperties(target, properties) {
      let next = super.finalizeProperties(target, properties);
      next = Object.assign({}, next, {
        [INITIAL_COMPUTE]: next[INITIAL_COMPUTE_FINALIZER](target),
      });
      return next;
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
      target.finalizedProperties[INITIAL_COMPUTE]();
      target[COMPUTE_READY] = true;
    }

    static afterInitialRender(target) {
      super.afterInitialRender(target);
      target[REFLECT_READY] = true;
      target[OBSERVE_READY] = true;
      const entries = Object.entries(target.finalizedProperties);
      for (const [property, definition] of entries) {
        const value = target[property];
        if (definition.reflect && value !== undefined) {
          this.reflectPropertyToAttribute(target, property, definition, value);
        }
        if (definition.observe && value !== undefined) {
          // TODO: #26: switch order of arguments.
          definition.observe(target, undefined, value);
        }
      }
    }

    static propertyDidChange(target, property, definition, value, oldValue) {
      super.propertyDidChange(target, property, definition, value, oldValue);
      if (definition.reflect && target[REFLECT_READY]) {
        this.reflectPropertyToAttribute(target, property, definition, value);
      }
      if (definition.observe && target[OBSERVE_READY]) {
        // TODO: #26: switch order of arguments.
        definition.observe(target, oldValue, value);
      }
      if (definition.compute && target[COMPUTE_READY]) {
        definition.compute();
      }
    }
  };
