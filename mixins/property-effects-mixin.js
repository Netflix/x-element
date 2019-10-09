/**
 * Add effects that happen after a property is set: observer, computed, reflect.
 */
import Graph from '../etc/graph.js';

const COMPUTED_REGEX = /^function[^(]*\(([^)]*)\)[\s\S]*$/;
const COMPUTED_INFO = Symbol.for('__computedInfo__');
const COMPUTE_READY = Symbol.for('__computeReady__');
const OBSERVE_READY = Symbol.for('__observeReady__');
const REFLECT_READY = Symbol.for('__reflectReady__');

export default superclass =>
  class extends superclass {
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
          return { methodName: candidate.name, dependencies };
        }
      } catch (err) {
        // Bad input. Ignore.
      }
    }

    static resolveMethodName(target, methodName) {
      // Look for method on instance and then on constructor.
      if (target[methodName] instanceof Function) {
        return target[methodName].bind(target);
      } else if (target.constructor[methodName] instanceof Function) {
        return target.constructor[methodName].bind(target.constructor);
      } else {
        const err = new Error(`Cannot resolve methodName "${methodName}".`);
        target.dispatchError(err);
      }
    }

    static createComputedCallback(target, property, methodName, dependencies) {
      const method = this.resolveMethodName(target, methodName);
      if (method) {
        return skipIfUndefined => {
          // Get definition at runtime in case things changed during analysis.
          const definition = target.propertyDefinitions[property];
          const args = dependencies.map(dependency => target[dependency]);
          if (!skipIfUndefined || args.some(arg => arg !== undefined)) {
            const rawValue = method(...args);
            if (this.rawValueChanged(target, property, rawValue)) {
              this.changeProperty(target, property, definition, rawValue);
            }
          }
        };
      }
    }

    static analyzeObserverProperty(target, property, definition) {
      if (definition.observer) {
        const methodName = definition.observer;
        const method = this.resolveMethodName(target, methodName);
        if (method) {
          return Object.assign({}, definition, { observe: method });
        }
      }
      return definition;
    }

    static analyzeComputedProperty(target, property, definition) {
      const computedInfo = target[COMPUTED_INFO];
      if (computedInfo) {
        const { dependencyToDependents, dependentToCallback } = computedInfo;
        if (property in dependencyToDependents && !definition.computed) {
          const sorted = Graph.sort(
            Graph.createFromNodeMapping(property, dependencyToDependents)
          );
          if (sorted) {
            const callbacks = sorted
              .map(dependent => dependentToCallback[dependent])
              .filter(callback => callback);
            if (callbacks.length > 0) {
              const compute = () => callbacks.forEach(callback => callback());
              return Object.assign({}, definition, { compute });
            }
          }
        } else if (definition.computed) {
          return Object.assign({}, definition, { readOnly: true });
        }
      }
      return definition;
    }

    static analyzeComputedProperties(target, properties) {
      const dependencyToDependents = {};
      const dependentToCallback = {};

      let hasComputedProperties = false;
      for (const [property, definition] of Object.entries(properties)) {
        if (definition.computed) {
          hasComputedProperties = true;
          const { computed } = definition;
          const parsedComputed = this.parseComputed(computed);
          if (parsedComputed) {
            const { methodName, dependencies } = parsedComputed;
            for (const dependency of dependencies) {
              if (dependency in properties === false) {
                const err = new Error(`Missing dependency "${dependency}".`);
                target.dispatchError(err);
              }
            }
            const callback = this.createComputedCallback(
              target,
              property,
              methodName,
              dependencies
            );
            if (callback) {
              dependentToCallback[property] = callback;
            }
            for (const dependency of dependencies) {
              if (dependency in dependencyToDependents === false) {
                dependencyToDependents[dependency] = [];
              }
              if (property in dependencyToDependents[dependency] === false) {
                dependencyToDependents[dependency].push(property);
              }
            }
          } else {
            const err = new Error(`Malformed computed "${computed}".`);
            target.dispatchError(err);
          }
        }
      }

      if (hasComputedProperties) {
        target[COMPUTED_INFO] = {
          dependencyToDependents,
          dependentToCallback,
        };

        // We also need to initialize our computed props. We set that up here.
        const nodes = Array.from(Object.keys(properties));
        const edges = [];
        const entries = Object.entries(dependencyToDependents);
        for (const [dependency, dependents] of entries) {
          edges.push(...dependents.map(dependent => [dependency, dependent]));
        }
        const sorted = Graph.sort(new Graph(nodes, edges));
        if (sorted) {
          const callbacks = sorted
            .map(dependent => dependentToCallback[dependent])
            .filter(callback => callback);
          if (callbacks.length > 0) {
            // The "true" arg skips callback if dependencies are all undefined.
            // TODO: #27: skip initial compute if dependencies are all undefined
            //  pass "true" arg to each callback to accomplish this.
            target[COMPUTED_INFO].initialCompute = () =>
              callbacks.forEach(callback => callback());
          }
        } else {
          target.dispatchError(new Error('Computed properties are cyclic.'));
        }
      }
    }

    static analyzeProperties(target, properties) {
      // Computed properties need to be analyzed altogether since it's a graph.
      this.analyzeComputedProperties(target, properties);
      super.analyzeProperties(target, properties);
    }

    static analyzeProperty(target, property, definition) {
      let next = super.analyzeProperty(target, property, definition);
      next = this.analyzeObserverProperty(target, property, next);
      return this.analyzeComputedProperty(target, property, next);
    }

    static serializeProperty(target, property, definition, value) {
      const typeName = definition.type && definition.type.name;
      switch (typeName) {
        case 'Boolean':
          return value ? '' : undefined;
        case 'String':
        case 'Number':
          return value === null || value === undefined
            ? undefined
            : value.toString();
        default: {
          const message =
            `Attempted to serialize "${property}" and reflect, but it is not ` +
            `a Boolean, String, or Number type (${typeName}).`;
          target.dispatchError(new Error(message));
        }
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
      target[COMPUTE_READY] = true;
      if (target[COMPUTED_INFO] && target[COMPUTED_INFO].initialCompute) {
        target[COMPUTED_INFO].initialCompute();
      }
    }

    static afterInitialRender(target) {
      super.afterInitialRender(target);
      target[REFLECT_READY] = true;
      target[OBSERVE_READY] = true;
      const entries = Object.entries(target.propertyDefinitions);
      for (const [property, definition] of entries) {
        const value = target[property];
        if (definition.reflect && value !== undefined) {
          this.reflectPropertyToAttribute(target, property, definition, value);
        }
        if (definition.observe && value !== undefined) {
          // TODO: #26: switch order of arguments.
          definition.observe(undefined, value);
        }
      }
      delete target[COMPUTED_INFO];
    }

    static propertyDidChange(target, property, definition, value, oldValue) {
      super.propertyDidChange(target, property, definition, value, oldValue);
      if (definition.reflect && target[REFLECT_READY]) {
        this.reflectPropertyToAttribute(target, property, definition, value);
      }
      if (definition.observe && target[OBSERVE_READY]) {
        // TODO: #26: switch order of arguments.
        definition.observe(oldValue, value);
      }
      if (definition.compute && target[COMPUTE_READY]) {
        definition.compute();
      }
    }
  };
