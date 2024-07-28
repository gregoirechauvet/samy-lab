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
    console.debug(`Attribute ${name} change to ${newValue}`);
    this.#valueCallbacks[name]?.forEach((callback) => {
      callback(oldValue, newValue);
    });
  }

  /**
   * @param {string} name
   * @param {number} defaultValue
   * @return {number}
   */
  getNumberAttribute(name, defaultValue) {
    const value = this.getAttribute(name);
    if (value === null) {
      return defaultValue;
    }

    const parsedValue = Number(value);
    return !isNaN(parsedValue) ? parsedValue : defaultValue;
  }

  /**
   * @return {Promise<{width: number, height: number}>}
   */
  getCanvasBox() {
    return new Promise((resolve) => {
      const resizeObserver = new ResizeObserver(([canvas]) => {
        resizeObserver.unobserve(this);

        const [boxSize] = canvas.devicePixelContentBoxSize;
        const { inlineSize: width, blockSize: height } = boxSize;
        resolve({ width, height });
      });
      resizeObserver.observe(this, { box: "device-pixel-content-box" });
    });
  }
}
