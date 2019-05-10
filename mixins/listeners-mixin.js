/**
 * Provides declarative 'listeners' block.
 */

export default superclass =>
  class extends superclass {
    static get listeners() {
      // Mapping of event type to method name. E.g., `{ click: 'onClick' }`.
      return {};
    }

    static setupListeners(target) {
      // Loops over mapping declared in this.listeners and calls listen.
      for (const [type, methodName] of Object.entries(this.listeners)) {
        const ok = target.listen(target.shadowRoot, type, target[methodName]);
        if (ok === false) {
          target.dispatchError(
            new Error(
              `"${type}" listener error: "${methodName}" does not exist`
            )
          );
        }
      }
    }

    static teardownListeners(target) {
      // Loops over mapping declared in this.listeners and calls unlisten.
      for (const [type, methodName] of Object.entries(this.listeners)) {
        const ok = target.unlisten(target.shadowRoot, type, target[methodName]);
        if (ok === false) {
          target.dispatchError(
            new Error(
              `Failed to unbind "${type}" listener: "${methodName}" does not exist`
            )
          );
        }
      }
    }

    connectedCallback() {
      super.connectedCallback();
      this.constructor.setupListeners(this);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.constructor.teardownListeners(this);
    }
  };
