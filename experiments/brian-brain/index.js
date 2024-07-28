import { CanvasComponent } from "/experiments/CanvasComponent.js";

/**
 * @readonly
 * @enum {number}
 */
const CellState = {
  Dead: 0,
  Dying: 1,
  Alive: 2,
};

class BrianBrainCore {
  /** @type {number} */
  #width;
  /** @type {number} */
  #height;
  /** @type {CellState[][]} */
  grid;

  /**
   * @param {number} width
   * @param {number} height
   * @param {number} initialFillRatio
   */
  constructor(width, height, initialFillRatio) {
    this.#width = width;
    this.#height = height;

    const isAlive = () => {
      return Math.random() > 1 - initialFillRatio;
    };
    this.grid = Array.from({ length: width }).map((_) =>
      Array.from({ length: height }).map((_) => (isAlive() ? CellState.Alive : CellState.Dead)),
    );
  }

  /**
   * @return {void}
   */
  tick() {
    const neighborsOffsets = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    this.grid = this.grid.map((row, rowIndex) => {
      return row.map((cell, cellIndex) => {
        const aliveNeighbors = neighborsOffsets
          .map(([offsetX, offsetY]) => {
            const x = this.modulo(rowIndex + offsetX, this.#width);
            const y = this.modulo(cellIndex + offsetY, this.#height);
            return this.grid[x][y];
          })
          .filter((x) => x === CellState.Alive).length;

        const shouldLive = cell === CellState.Dead && aliveNeighbors === 2;
        const shouldDieOff = cell === CellState.Alive;

        if (shouldLive) {
          return CellState.Alive;
        }

        if (shouldDieOff) {
          return CellState.Dying;
        }

        return CellState.Dead;
      });
    });
  }

  /**
   * @param {number} dividend
   * @param {number} divisor
   * @return {number}
   */
  modulo(dividend, divisor) {
    return (dividend + divisor) % divisor;
  }
}

class BrianBrain extends CanvasComponent {
  /** @type {string[]} */
  static observedAttributes = ["cell-size", "initial-fill-ratio"];

  /**
   * @return {void}
   */
  connectedCallback() {
    /** @type {BrianBrainCore | null} */
    let brianBrain = null;
    /** @type {(() => void) | null} */
    let draw = null;

    const init = () => {
      console.log("init");
      const resizeObserver = new ResizeObserver(([canvas]) => {
        resizeObserver.unobserve(this);

        const [boxSize] = canvas.devicePixelContentBoxSize;

        const width = boxSize.inlineSize;
        const height = boxSize.blockSize;

        this.width = width;
        this.height = height;

        const initState = this.initBrianBrain(width, height);
        brianBrain = initState.brianBrain;
        draw = initState.draw;
      });

      resizeObserver.observe(this, { box: "device-pixel-content-box" });
    };

    this.addValueListener("height", init);
    this.addValueListener("width", init);
    this.addValueListener("cell-size", init);
    this.addValueListener("initial-fill-ratio", init);
    init();

    /** @type {number} */
    let animationFrameRequest;
    const loop = () => {
      brianBrain?.tick();
      draw?.();
      animationFrameRequest = window.requestAnimationFrame(loop);
    };

    animationFrameRequest = window.requestAnimationFrame(loop);
    this.onDisconnect(() => cancelAnimationFrame(animationFrameRequest));
  }

  /**
   * @param {number} widthPx
   * @param {number} heightPx
   * @return {{brianBrain: BrianBrainCore, draw: () => void}}
   */
  initBrianBrain(widthPx, heightPx) {
    const rawCellSize = this.getAttribute("cell-size");
    const parsedCellSize = rawCellSize !== null ? Number(rawCellSize) : 10; // TODO: check user inputs

    const dpr = window.devicePixelRatio;
    const cellSize = Math.floor(parsedCellSize * dpr);

    const rawInitialFillRatio = this.getAttribute("initial-fill-ratio");
    const initialFillRatio = rawInitialFillRatio !== null ? Number(rawInitialFillRatio) : 0.3; // TODO: check user inputs

    const width = Math.floor(widthPx / cellSize);
    const height = Math.floor(heightPx / cellSize);

    const brianBrain = new BrianBrainCore(width, height, initialFillRatio);
    const draw = this.initDraw(brianBrain, widthPx, heightPx, cellSize);

    return { brianBrain, draw };
  }

  /**
   * @param {BrianBrainCore} brianBrain
   * @param {number} width
   * @param {number} height
   * @param {number} cellSize
   * @return {() => void}
   */
  initDraw(brianBrain, width, height, cellSize) {
    const context = this.getContext("2d");
    if (context === null) {
      throw new Error("cannot init context for rendering");
    }

    // context.scale(dpi, dpi);
    context.clearRect(0, 0, width, height);

    const draw = () => {
      brianBrain.grid.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          if (cell === CellState.Alive) {
            context.fillStyle = "#000000";
            context.fillRect(rowIndex * cellSize, cellIndex * cellSize, cellSize, cellSize);
          } else if (cell === CellState.Dying) {
            context.fillStyle = "#0000FF";
            context.fillRect(rowIndex * cellSize, cellIndex * cellSize, cellSize, cellSize);
          } else {
            context.clearRect(rowIndex * cellSize, cellIndex * cellSize, cellSize, cellSize);
          }
        });
      });
    };

    draw();
    return draw;
  }
}

customElements.define("brian-brain", BrianBrain, { extends: "canvas" });
