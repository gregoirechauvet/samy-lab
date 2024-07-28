/**
 * @readonly
 * @enum {number}
 */
const Orientation = {
  North: 0,
  West: 1,
  East: 2,
  South: 3,
};

/**
 * @readonly
 * @enum {number}
 */
const Action = {
  TurnLeft: 0,
  TurnRight: 1,
};

/**
 * @typedef {{action: Action; color: string}} Rule
 */

/**
 * @readonly
 * @type {{[key: string]: Rule[]}}
 */
const presets = {
  classic: [
    { action: Action.TurnLeft, color: "#FFFFFF" },
    { action: Action.TurnRight, color: "#000000" },
  ],
  "3-colors-fast-highway": [
    { action: Action.TurnRight, color: "#FFFFFF" },
    { action: Action.TurnLeft, color: "#FF0000" },
    { action: Action.TurnLeft, color: "#00FF00" },
  ],
  "5-colors-filler": [
    { action: Action.TurnRight, color: "#FFFFFF" },
    { action: Action.TurnRight, color: "#FF0000" },
    { action: Action.TurnRight, color: "#00FF00" },
    { action: Action.TurnLeft, color: "#00FFFF" },
    { action: Action.TurnRight, color: "#FFFF00" },
  ],
  "7-colors-expanding": [
    { action: Action.TurnRight, color: "#FFFFFF" },
    { action: Action.TurnRight, color: "#FF0000" },
    { action: Action.TurnRight, color: "#00FF00" },
    { action: Action.TurnLeft, color: "#00FFFF" },
    { action: Action.TurnRight, color: "#FFFF00" },
    { action: Action.TurnLeft, color: "#FF00FF" },
    { action: Action.TurnRight, color: "#AAAAAA" },
  ],
  "9-colors-bouncing-ant": [
    { action: Action.TurnRight, color: "#FFFFFF" },
    { action: Action.TurnLeft, color: "#FF0000" },
    { action: Action.TurnRight, color: "#00FF00" },
    { action: Action.TurnRight, color: "#00FFFF" },
    { action: Action.TurnRight, color: "#FFFF00" },
    { action: Action.TurnRight, color: "#FF00FF" },
    { action: Action.TurnRight, color: "#AAAAAA" },
    { action: Action.TurnLeft, color: "#AA00FF" },
    { action: Action.TurnLeft, color: "#0000FF" },
  ],
  "10-colors-fast-highway": [
    { action: Action.TurnRight, color: "#FFFFFF" },
    { action: Action.TurnRight, color: "#FF0000" },
    { action: Action.TurnLeft, color: "#00FF00" },
    { action: Action.TurnRight, color: "#00FFFF" },
    { action: Action.TurnLeft, color: "#FFFF00" },
    { action: Action.TurnRight, color: "#FF00FF" },
    { action: Action.TurnLeft, color: "#AAAAAA" },
    { action: Action.TurnLeft, color: "#AA00FF" },
    { action: Action.TurnRight, color: "#0000FF" },
    { action: Action.TurnLeft, color: "#FFAAFF" },
  ],
  "10-colors-large-highway": [
    { action: Action.TurnRight, color: "#FFFFFF" },
    { action: Action.TurnRight, color: "#FF0000" },
    { action: Action.TurnRight, color: "#00FF00" },
    { action: Action.TurnLeft, color: "#00FFFF" },
    { action: Action.TurnRight, color: "#FFFF00" },
    { action: Action.TurnLeft, color: "#FF00FF" },
    { action: Action.TurnLeft, color: "#AAAAAA" },
    { action: Action.TurnRight, color: "#AA00FF" },
    { action: Action.TurnLeft, color: "#0000FF" },
    { action: Action.TurnRight, color: "#FFAAFF" },
  ],
  "11-colors-expanding-snail": [
    { action: Action.TurnRight, color: "#FFFFFF" },
    { action: Action.TurnLeft, color: "#FF0000" },
    { action: Action.TurnRight, color: "#00FF00" },
    { action: Action.TurnRight, color: "#00FFFF" },
    { action: Action.TurnRight, color: "#FFFF00" },
    { action: Action.TurnRight, color: "#FF00FF" },
    { action: Action.TurnLeft, color: "#AAAAAA" },
    { action: Action.TurnLeft, color: "#AA00FF" },
    { action: Action.TurnLeft, color: "#0000FF" },
    { action: Action.TurnRight, color: "#FFAAFF" },
    { action: Action.TurnRight, color: "#004802" },
  ],
  "12-colors-zigzag-highway": [
    { action: Action.TurnRight, color: "#FFFFFF" },
    { action: Action.TurnLeft, color: "#FF0000" },
    { action: Action.TurnLeft, color: "#00FF00" },
    { action: Action.TurnRight, color: "#00FFFF" },
    { action: Action.TurnRight, color: "#FFFF00" },
    { action: Action.TurnRight, color: "#FF00FF" },
    { action: Action.TurnLeft, color: "#AAAAAA" },
    { action: Action.TurnRight, color: "#AA00FF" },
    { action: Action.TurnLeft, color: "#0000FF" },
    { action: Action.TurnRight, color: "#FFAAFF" },
    { action: Action.TurnLeft, color: "#004802" },
    { action: Action.TurnLeft, color: "#590900" },
  ],
  "12-colors-expanding-pyramid": [
    { action: Action.TurnRight, color: "#FFFFFF" },
    { action: Action.TurnRight, color: "#FF0000" },
    { action: Action.TurnRight, color: "#00FF00" },
    { action: Action.TurnLeft, color: "#00FFFF" },
    { action: Action.TurnLeft, color: "#FFFF00" },
    { action: Action.TurnLeft, color: "#FF00FF" },
    { action: Action.TurnRight, color: "#AAAAAA" },
    { action: Action.TurnLeft, color: "#AA00FF" },
    { action: Action.TurnLeft, color: "#0000FF" },
    { action: Action.TurnLeft, color: "#FFAAFF" },
    { action: Action.TurnRight, color: "#004802" },
    { action: Action.TurnRight, color: "#590900" },
  ],
  "12-colors-expanding-ship": [
    { action: Action.TurnRight, color: "#FFFFFF" },
    { action: Action.TurnRight, color: "#FF0000" },
    { action: Action.TurnRight, color: "#00FF00" },
    { action: Action.TurnLeft, color: "#00FFFF" },
    { action: Action.TurnRight, color: "#FFFF00" },
    { action: Action.TurnLeft, color: "#FF00FF" },
    { action: Action.TurnLeft, color: "#AAAAAA" },
    { action: Action.TurnRight, color: "#AA00FF" },
    { action: Action.TurnRight, color: "#0000FF" },
    { action: Action.TurnRight, color: "#FFAAFF" },
    { action: Action.TurnRight, color: "#004802" },
    { action: Action.TurnRight, color: "#590900" },
  ],
};

class LangtonAntCore {
  /** @type {number} */
  #width;
  /** @type {number} */
  #height;
  /** @type {number} */
  #ruleCount;
  /** @type {{[key: number]: Rule}} */
  rules;
  /** @type {number[][]} */
  grid;
  /** @type {{x: number, y: number, orientation: Orientation}} */
  ant = { x: 0, y: 0, orientation: Orientation.North };

  /**
   * @param {number} width
   * @param {number} height
   * @param {Rule[]} rules
   */
  constructor(width, height, rules) {
    this.#width = width;
    this.#height = height;
    this.#ruleCount = rules.length;
    this.rules = Object.fromEntries(rules.map((rule, index) => [index, rule]));

    this.grid = Array.from({ length: width }).map((_) => Array.from({ length: height }).map((_) => 0));
    this.ant = { x: Math.floor(width / 2), y: Math.floor(height / 2), orientation: Orientation.North };
  }

  /**
   * @return {void}
   */
  // TODO: emit a changeset to optimize drawing
  tick() {
    const cell = this.grid[this.ant.x][this.ant.y];
    const newCellState = (cell + 1) % this.#ruleCount;
    const rule = this.rules[newCellState];

    this.grid[this.ant.x][this.ant.y] = newCellState;

    const newOrientation = this.turn(this.ant.orientation, rule.action);
    const [offsetX, offsetY] = this.moveOffset(newOrientation);

    const newX = this.modulo(this.ant.x + offsetX, this.#width);
    const newY = this.modulo(this.ant.y + offsetY, this.#height);
    this.ant = { x: newX, y: newY, orientation: newOrientation };
  }

  /**
   * @param {Action} action
   * @param {Orientation} orientation
   * @return {Orientation}
   */
  turn(orientation, action) {
    const map = {
      [Orientation.North]: {
        [Action.TurnLeft]: Orientation.West,
        [Action.TurnRight]: Orientation.East,
      },
      [Orientation.West]: {
        [Action.TurnLeft]: Orientation.South,
        [Action.TurnRight]: Orientation.North,
      },
      [Orientation.South]: {
        [Action.TurnLeft]: Orientation.East,
        [Action.TurnRight]: Orientation.West,
      },
      [Orientation.East]: {
        [Action.TurnLeft]: Orientation.North,
        [Action.TurnRight]: Orientation.South,
      },
    };

    return map[orientation][action];
  }

  /**
   * @param {Orientation} orientation
   * @return {[number, number]}
   */
  moveOffset(orientation) {
    /** @type{{[key: Orientation]: [number, number]}} */
    const map = {
      [Orientation.North]: [1, 0],
      [Orientation.West]: [0, 1],
      [Orientation.South]: [-1, 0],
      [Orientation.East]: [0, -1],
    };

    return map[orientation];
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

class LangtonAnt extends HTMLCanvasElement {
  /** @type {number | null} */
  #animationRef = null;
  /** @type {ResizeObserver | null} */
  #resizeObserver = null;

  /**
   * @return {void}
   */
  connectedCallback() {
    const rawIterationPerTick = this.getAttribute("iteration-per-tick");
    const iterationPerTick = rawIterationPerTick !== null ? Number(rawIterationPerTick) : 20; // TODO: check user inputs

    this.#resizeObserver = new ResizeObserver(([canvas]) => {
      this.#resizeObserver?.unobserve(this);

      const [boxSize] = canvas.devicePixelContentBoxSize;

      const width = boxSize.inlineSize;
      const height = boxSize.blockSize;

      this.width = width;
      this.height = height;

      const { langtonAnt, draw } = this.initLangtonAnt(width, height);

      const loop = () => {
        for (let i = 0; i < iterationPerTick; i++) {
          langtonAnt.tick();
        }
        draw();
        this.#animationRef = window.requestAnimationFrame(loop);
      };

      this.#animationRef = window.requestAnimationFrame(loop);
    });

    this.#resizeObserver.observe(this, { box: "device-pixel-content-box" });
  }

  /**
   * @return {void}
   */
  disconnectedCallback() {
    this.#resizeObserver?.disconnect();
    if (this.#animationRef !== null) {
      cancelAnimationFrame(this.#animationRef);
    }
  }

  /**
   * @param {number} widthPx
   * @param {number} heightPx
   * @return {{langtonAnt: LangtonAntCore, draw: () => void}}
   */
  initLangtonAnt(widthPx, heightPx) {
    const rawCellSize = this.getAttribute("cell-size");
    const parsedCellSize = rawCellSize !== null ? Number(rawCellSize) : 10; // TODO: check user inputs

    const dpr = window.devicePixelRatio;
    const cellSize = Math.floor(parsedCellSize * dpr);

    const rulePreset = this.getAttribute("preset") ?? "classic";
    const rules = presets[rulePreset] ?? presets["classic"];

    const width = Math.floor(widthPx / cellSize);
    const height = Math.floor(heightPx / cellSize);

    const langtonAnt = new LangtonAntCore(width, height, rules);
    const draw = this.initDraw(langtonAnt, widthPx, heightPx, cellSize);

    return { langtonAnt, draw };
  }

  /**
   * @param {LangtonAntCore} langtonAnt
   * @param {number} width
   * @param {number} height
   * @param {number} cellSize
   * @return {() => void}
   */
  initDraw(langtonAnt, width, height, cellSize) {
    const context = this.getContext("2d");
    if (context === null) {
      throw new Error("cannot init context for rendering");
    }

    context.clearRect(0, 0, width, height);

    const draw = () => {
      langtonAnt.grid.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          const { color } = langtonAnt.rules[cell];

          context.fillStyle = color;
          context.fillRect(rowIndex * cellSize, cellIndex * cellSize, cellSize, cellSize);
        });
      });
    };

    draw();
    return draw;
  }
}

customElements.define("langton-ant", LangtonAnt, { extends: "canvas" });
