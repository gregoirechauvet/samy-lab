/**
 * @readonly
 * @enum {number}
 */
const CellState = {
  Dead: 0,
  Dying: 1,
  Alive: 2,
};

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

class BrianBrainCore {
  /** @type {number} */
  #width;
  /** @type {number} */
  #height;
  /** @type {CellState[][]} */
  #grid;
  /** @type {CellState[][]} */
  #gridCopy;

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
    this.#grid = Array.from({ length: width }).map((_) =>
      Array.from({ length: height }).map((_) => (isAlive() ? CellState.Alive : CellState.Dead)),
    );
    this.#gridCopy = Array.from({ length: width }).map((_) =>
      Array.from({ length: height }).map((_) => CellState.Dead),
    );
  }

  /**
   * @return {CellState[][]}
   */
  tick() {
    this.#grid.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        this.#gridCopy[rowIndex][cellIndex] = this.#computeState(rowIndex, cellIndex, cell);
      });
    });

    const tmp = this.#grid;
    this.#grid = this.#gridCopy;
    this.#gridCopy = tmp;
    return this.#grid;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {CellState} value
   * @return {CellState}
   */
  #computeState(x, y, value) {
    const aliveNeighbors = neighborsOffsets
      .map(([offsetX, offsetY]) => {
        const neighborX = this.modulo(x + offsetX, this.#width);
        const neighborY = this.modulo(y + offsetY, this.#height);
        return this.#grid[neighborX][neighborY];
      })
      .filter((x) => x === CellState.Alive).length;

    const shouldLive = value === CellState.Dead && aliveNeighbors === 2;
    const shouldDieOff = value === CellState.Alive;

    if (shouldLive) {
      return CellState.Alive;
    }

    if (shouldDieOff) {
      return CellState.Dying;
    }

    return CellState.Dead;
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

/**
 * @param {OffscreenCanvas} canvas
 * @param {number} cellSize
 * @return {(state: CellState[][]) => void}
 */
function initDraw(canvas, cellSize) {
  const context = canvas.getContext("2d");
  if (context === null) {
    throw new Error("cannot init context for rendering");
  }

  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);

  /**
   * @param {CellState[][]} state
   * @return {void}
   */
  return (state) => {
    state.forEach((row, rowIndex) => {
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
}

/** @type {number | null} */
let requestId = null;

/**
 * @param event {MessageEvent<{canvas: OffscreenCanvas; cellSize:number; initialFillRatio: number}>}
 */
onmessage = (event) => {
  if (requestId !== null) {
    cancelAnimationFrame(requestId);
  }

  const { canvas, cellSize, initialFillRatio } = event.data;

  const core = new BrianBrainCore(canvas.width, canvas.height, initialFillRatio);
  const draw = initDraw(canvas, cellSize);

  let previousTime = 0;

  /**
   * @param {number} time
   */
  const render = (time) => {
    if (time - previousTime < 20) {
      requestId = requestAnimationFrame(render);
      return;
    }

    const state = core.tick();
    draw(state);
    previousTime = time;
    requestId = requestAnimationFrame(render);
  };

  requestId = requestAnimationFrame(render);
};
