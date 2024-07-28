import { CanvasComponent } from "/experiments/CanvasComponent.js";

class RecamanSequence extends CanvasComponent {
  /** @type {Worker} */
  #worker;

  constructor() {
    super();
    this.#worker = new Worker("/experiments/recaman-sequence/worker.js");
  }

  /**
   * @return {number}
   */
  get scale() {
    return this.getNumberAttribute("scale", 7);
  }

  /**
   * @param {number} value
   * @return {void}
   */
  set scale(value) {
    this.setAttribute("scale", value.toString());
  }

  /**
   * @return {Promise<void>}
   */
  async connectedCallback() {
    const scale = this.scale;

    const { width, height } = await this.getCanvasBox();
    this.width = width;
    this.height = height;

    const offscreen = this.transferControlToOffscreen();
    this.#worker.postMessage({ canvas: offscreen, scale }, [offscreen]);
  }
}

customElements.define("recaman-sequence", RecamanSequence, { extends: "canvas" });
