export class CanvasComponent extends HTMLElement {
  /** @type {(() => void)[]} */
  #disconnectCallbacks = [];
  /** @type {{[key: string]: ((oldValue: string, newValue: string) => void)[]}} */
  #valueCallbacks = {};
  /** @type {HTMLCanvasElement} */
  canvas;

  constructor() {
    super();

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(":host { display: block; }");

    this.canvas = document.createElement("canvas");

    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = [sheet];
    shadow.append(this.canvas);
  }

  /**
   * @return {void}
   */
  connectedCallback() {
    //   const shadow = this.attachShadow({ mode: "open" });
    //   shadow.append(this.canvas);
  }

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
    console.log("Attribute change");
    this.#valueCallbacks[name]?.forEach((callback) => {
      callback(oldValue, newValue);
    });
  }
}
