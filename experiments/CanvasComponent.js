export class CanvasComponent extends HTMLCanvasElement {
  /** @type {(() => void)[]} */
  #disconnectCallbacks = [];
  /** @type {{[key: string]: ((oldValue: string, newValue: string) => void)[]}} */
  #valueCallbacks = {};

  /**
   * @param {() => void} callback
   * @return {void}
   */
  onDisconnect(callback) {
    this.#disconnectCallbacks.push(callback);
  }

  /**
   * @return {void}
   */
  disconnectedCallback() {
    this.#disconnectCallbacks.forEach((callback) => callback());
  }

  /**
   * @param {string} value
   * @param {() => void} callback
   * @return {(oldValue: string, newValue: string) => void}
   */
  addValueListener(value, callback) {
    this.#valueCallbacks[value] ||= [];
    this.#valueCallbacks[value].push(callback);

    return () => {
      this.#valueCallbacks[value] = this.#valueCallbacks[value].filter((fn) => fn !== callback);
    };
  }

  /**
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} change to ${newValue}`);
    this.#valueCallbacks[name]?.forEach((callback) => {
      callback(oldValue, newValue);
    });
  }
}
