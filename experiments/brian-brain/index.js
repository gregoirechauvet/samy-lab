import { CanvasComponent } from "/experiments/CanvasComponent.js";

class BrianBrain extends CanvasComponent {
  /** @type {Worker} */
  #worker;

  /** @type {string[]} */
  static observedAttributes = ["cell-size", "initial-fill-ratio"];

  constructor() {
    super();
    this.#worker = new Worker("/experiments/brian-brain/worker.js");
  }

  /**
   * @return {number}
   */
  get initialFillRatio() {
    return this.getNumberAttribute("initial-fill-ratio", 0.3);
  }

  /**
   * @param {number} value
   * @return {void}
   */
  set initialFillRatio(value) {
    this.setAttribute("initial-fill-ratio", value.toString());
  }

  /**
   * @return {number}
   */
  get cellSize() {
    return this.getNumberAttribute("cell-size", 10);
  }

  /**
   * @param {number} value
   * @return {void}
   */
  set cellSize(value) {
    this.setAttribute("cell-size", value.toString());
  }

  /**
   * @return {Promise<void>}
   */
  connectedCallback() {
    const init = async () => {
      const cellSize = Math.floor(this.cellSize * devicePixelRatio);
      const initialFillRatio = this.initialFillRatio;

      const { width, height } = await this.getCanvasBox();
      this.width = width;
      this.height = height;

      const offscreen = this.transferControlToOffscreen();
      this.#worker.postMessage({ canvas: offscreen, cellSize, initialFillRatio }, [offscreen]);
    };

    this.addValueListener("initial-fill-ratio", init);
    this.addValueListener("cell-size", init);
    init();
  }
}

customElements.define("brian-brain", BrianBrain, { extends: "canvas" });
