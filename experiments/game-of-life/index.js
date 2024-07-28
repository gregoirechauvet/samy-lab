import { CanvasComponent } from "/experiments/CanvasComponent.js";

/**
 * @readonly
 * @enum {number}
 */
const CellState = {
  Dead: 0,
  Alive: 1,
};

class GameOfLifeCore {
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
        const neighborsCount = neighborsOffsets
          .map(([offsetX, offsetY]) => {
            const x = this.modulo(rowIndex + offsetX, this.#width);
            const y = this.modulo(cellIndex + offsetY, this.#height);
            return this.grid[x][y];
          })
          .filter((x) => x === CellState.Alive).length;

        const shouldLive = neighborsCount === 3;
        const shouldRemainAlive = cell === CellState.Alive && neighborsCount === 2;

        if (shouldLive || shouldRemainAlive) {
          return CellState.Alive;
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

class GameOfLife extends CanvasComponent {
  /** @type {string[]} */
  static observedAttributes = ["height", "width", "cell-size", "initial-fill-ratio"];

  constructor() {
    super();
  }

  /**
   * @return {void}
   */
  connectedCallback() {
    super.connectedCallback();
    this.style.display = "block";

    /** @type {GameOfLifeCore | null} */
    let gameOfLife = null;
    /** @type {() => void | null} */
    let draw = null;

    const init = () => {
      console.log("init");
      const resizeObserver = new ResizeObserver(([canvas]) => {
        resizeObserver.unobserve(this);

        const [boxSize] = canvas.devicePixelContentBoxSize;

        const width = boxSize.inlineSize;
        const height = boxSize.blockSize;

        this.canvas.width = width;
        this.canvas.height = height;

        const initState = this.initGameOfLife(width, height);
        gameOfLife = initState.gameOfLife;
        draw = initState.draw;
      });

      resizeObserver.observe(this.canvas, { box: "device-pixel-content-box" });
    };

    this.addValueListener("height", init);
    this.addValueListener("width", init);
    this.addValueListener("cell-size", init);
    this.addValueListener("initial-fill-ratio", init);
    init();

    let animationFrameRequest;
    const loop = () => {
      gameOfLife?.tick();
      draw?.();
      animationFrameRequest = window.requestAnimationFrame(loop);
    };

    animationFrameRequest = window.requestAnimationFrame(loop);
    this.onDisconnect(() => cancelAnimationFrame(animationFrameRequest));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  /**
   * @param {number} widthPx
   * @param {number} heightPx
   * @return {{gameOfLife: GameOfLifeCore, draw: () => void}}
   */
  initGameOfLife(widthPx, heightPx) {
    const rawCellSize = this.getAttribute("cell-size");
    const cellSize = rawCellSize !== null ? Number(rawCellSize) : 10; // TODO: check user inputs

    const rawInitialFillRatio = this.getAttribute("initial-fill-ratio");
    const initialFillRatio = rawInitialFillRatio !== null ? Number(rawInitialFillRatio) : 0.3; // TODO: check user inputs

    const width = Math.floor(widthPx / cellSize);
    const height = Math.floor(heightPx / cellSize);

    const gameOfLife = new GameOfLifeCore(width, height, initialFillRatio);
    const draw = this.initDraw(gameOfLife, widthPx, heightPx, cellSize);

    return { gameOfLife, draw };
  }

  /**
   * @param {GameOfLifeCore} gameOfLife
   * @param {number} width
   * @param {number} height
   * @param {number} cellSize
   * @return {() => void}
   */
  initDraw(gameOfLife, width, height, cellSize) {
    const context = this.canvas.getContext("2d");
    if (context === null) {
      throw new Error("cannot init context for rendering");
    }

    // context.scale(dpi, dpi);
    context.clearRect(0, 0, width, height);

    const draw = () => {
      gameOfLife.grid.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          if (cell === CellState.Alive) {
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

customElements.define("game-of-life", GameOfLife);
