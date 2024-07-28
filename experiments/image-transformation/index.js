import { CanvasComponent } from "/experiments/CanvasComponent.js";

/** @typedef {(width: number, height: number, x: number, y: number) => {x: number, y: number}} Transformation */

/** @type {{[key: string]: {forward: Transformation, backward: Transformation}}} */
const transformations = {
  photoBooth: {
    forward: (width, height, x, y) => {
      return {
        x: x / 2 + ((width + (width % 2) - 1) / 2) * (x % 2),
        y: y / 2 + ((height + (height % 2) - 1) / 2) * (y % 2),
      };
    },
    backward: (width, height, x, y) => {
      const a = x < width / 2 ? 0 : 1;
      const b = y < height / 2 ? 0 : 1;

      return {
        x: 2 * x - (width + (width % 2) - 1) * a,
        y: 2 * y - (height + (height % 2) - 1) * b,
      };
    },
  },
  baker: {
    forward: (width, height, x, y) => {
      const a = x * 2 + (y % 2);
      const b = (y - (y % 2)) / 2;

      if (a > width - 1) {
        return { x: 2 * width - 1 - a, y: height - 1 - b };
      }

      return { x: a, y: b };
    },
    backward: (width, height, x, y) => {
      let a = x;
      let b = y;
      if (y >= height / 2) {
        a = 2 * width - 1 - x;
        b = height - 1 - y;
      }

      return {
        x: (a - (a % 2)) / 2,
        y: 2 * b + (a % 2),
      };
    },
  },
  hilbert: {
    forward: (width, height, x, y) => {
      return { x, y: (y - x + height) % height };
    },
    backward: (width, height, x, y) => {
      return { x, y: (y + x) % height };
    },
  },
};

class ImageTransformationCore {
  /** @type {CanvasRenderingContext2D} */
  #context;
  /** @type {ImageData} */
  imageData;
  /** @type {string} */
  #transformation;

  /**
   * @param {CanvasRenderingContext2D} context
   * @param {ImageData} imageData
   * @param {string} transformation
   */
  constructor(context, imageData, transformation) {
    this.#context = context;
    this.#transformation = transformation;
    this.imageData = imageData;
  }

  tick() {
    const width = this.imageData.width;
    const height = this.imageData.height;
    const newImageData = this.#context.createImageData(width, height);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const { x: newX, y: newY } = transformations[this.#transformation].forward(width, height, x, y);

        const oldIndex = (x + y * width) * 4;
        const newIndex = (newX + newY * width) * 4;
        newImageData.data[newIndex] = this.imageData.data[oldIndex];
        newImageData.data[newIndex + 1] = this.imageData.data[oldIndex + 1];
        newImageData.data[newIndex + 2] = this.imageData.data[oldIndex + 2];
        newImageData.data[newIndex + 3] = this.imageData.data[oldIndex + 3];
      }
    }

    this.imageData = newImageData;
  }
}

class ImageTransformation extends CanvasComponent {
  /**
   * @return {string}
   */
  get src() {
    return this.getAttribute("src") ?? "/web/images/lena.png";
  }

  /**
   * @param {string} value
   * @return {void}
   */
  set src(value) {
    this.setAttribute("src", value);
  }

  async connectedCallback() {
    const image = await this.loadImage(this.src);

    this.width = image.width;
    this.height = image.height;

    const { draw } = this.initDraw(image);

    let previousTime = 0;
    /** @type {(time: number) => void} */
    const render = (time) => {
      if (time - previousTime < 200) {
        requestAnimationFrame(render);
        return;
      }

      draw();
      previousTime = time;
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  /**
   * @param {string} src
   * @return {Promise<HTMLImageElement>}
   */
  loadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();

      img.addEventListener("load", () => {
        resolve(img);
      });

      img.src = src;
    });
  }

  /**
   * @param {HTMLImageElement} image
   * @returns {{draw: () => void}}
   */
  initDraw(image) {
    const context = this.getContext("2d");
    if (context === null) {
      throw new Error("cannot init context for rendering");
    }

    const width = image.width;
    const height = image.height;

    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, width, height);
    const core = new ImageTransformationCore(context, imageData, "photoBooth");

    const draw = () => {
      core.tick();
      context.putImageData(core.imageData, 0, 0);
    };

    draw();
    return { draw };
  }
}

customElements.define("image-transformation", ImageTransformation, { extends: "canvas" });
