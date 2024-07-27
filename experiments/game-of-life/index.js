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
   * @param width {number}
   * @param height {number}
   */
  constructor(width, height) {
    this.#width = width;
    this.#height = height;

    const isAlive = () => {
      return Math.random() > 0.7;
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

    const newGrid = this.grid.map((row, rowIndex) => {
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

    this.grid = newGrid;
  }

  /**
   * @param dividend {number}
   * @param divisor {number}
   * @return {number}
   */
  modulo(dividend, divisor) {
    return (dividend + divisor) % divisor;
  }
}

class GameOfLife extends HTMLCanvasElement {
  /** @type {number | null} */
  #animationRef = null;

  /**
   * @return {void}
   */
  connectedCallback() {
    const rawCellSize = this.getAttribute("cell-size");
    const cellSize = rawCellSize !== null ? Number(rawCellSize) : 10; // TODO: check user inputs

    const widthPx = this.clientWidth;
    const heightPx = this.clientHeight;

    const width = Math.floor(widthPx / cellSize);
    const height = Math.floor(heightPx / cellSize);
    const dpi = window.devicePixelRatio;

    this.width = widthPx;
    this.height = heightPx;

    console.debug("Parameters", { widthPx, heightPx, width, height, dpi, cellSize });

    const gameOfLife = new GameOfLifeCore(width, height);
    const draw = this.initDraw(gameOfLife, widthPx, heightPx, cellSize, dpi);

    const loop = () => {
      draw();
      gameOfLife.tick();
      this.#animationRef = window.requestAnimationFrame(loop);
    };

    this.#animationRef = window.requestAnimationFrame(loop);
  }

  /**
   * @return {void}
   */
  disconnectedCallback() {
    if (this.#animationRef !== null) {
      cancelAnimationFrame(this.#animationRef);
    }
    console.log("Custom element removed from page.");
  }

  /**
   * @param gameOfLife {GameOfLifeCore}
   * @param width {number}
   * @param height {number}
   * @param cellSize {number}
   * @param dpi {number}
   * @return {() => void}
   */
  initDraw(gameOfLife, width, height, cellSize, dpi) {
    const context = this.getContext("2d");
    if (context === null) {
      throw new Error("cannot init context for rendering");
    }

    context.clearRect(0, 0, width, height);

    return () => {
      console.log("Loooooop");
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
  }
}

customElements.define("game-of-life", GameOfLife, { extends: "canvas" });
