/**
 * @returns {Generator<number, void, *>}
 */
function* recamanSequence() {
  const visited = new Set();
  let current = 0;

  let step = 0;
  while (true) {
    let candidate = current - step;
    if (candidate <= 0 || visited.has(candidate)) {
      candidate = current + step;
    }

    yield candidate;

    current = candidate;
    visited.add(current);
    step++;
  }
}

/**
 * @param {number} width
 * @param {number} height
 * @param {number} scale
 * @return {number[]}
 */
function computeRecamanValues(width, height, scale) {
  const sequence = recamanSequence();

  const recamanValues = [];

  const firstItem = sequence.next();
  if (firstItem.done) {
    throw new Error("error generating recaman numbers");
  }
  let previous = firstItem.value;

  let maxWidth = 0;
  let maxRadius = 0;

  while (true) {
    const { value, done } = sequence.next();
    if (done) {
      throw new Error("error generating recaman numbers");
    }

    const radius = Math.abs((value - previous) / 2);

    if (maxRadius < radius) {
      maxRadius = radius;
    }

    if (maxWidth < value) {
      maxWidth = value;
    }

    const isWithinBounds = maxRadius * scale < height / 2 && maxWidth * scale < width;
    if (!isWithinBounds) {
      break;
    }

    recamanValues.push(value);
    previous = value;
  }

  return recamanValues;
}

/**
 * @param {OffscreenCanvas} canvas
 * @param {number} scale
 * @param {number[]} values
 * @return {() => void}
 */
function initDraw(canvas, scale, values) {
  const context = canvas.getContext("2d");
  if (context === null) {
    throw new Error("cannot init context for rendering");
  }

  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);

  let currentX = 0;
  const currentY = height / 2;

  const tickSize = 0.8;

  /**
   * @param {OffscreenCanvasRenderingContext2D} context
   * @returns {Generator<*, void, *>}
   */
  function* drawStep(context) {
    const hueSpeed = 0.1;
    let iterationCount = 0;

    for (let i = 0; i < values.length; i++) {
      const value = values[i];

      const isOdd = i % 2 === 0;
      let startAngle = isOdd ? Math.PI : 0;
      let endAngle = isOdd ? 2 * Math.PI : Math.PI;

      const isForward = value > currentX;
      const shouldBeReversed = (!isOdd && isForward) || (isOdd && !isForward);
      if (shouldBeReversed) {
        [startAngle, endAngle] = [endAngle, startAngle];
      }

      const radius = (value - currentX) / 2;
      const center = currentX + radius;

      const arcSize = Math.abs(radius) * Math.PI;
      const parts = arcSize / tickSize;

      const angleStep = (endAngle - startAngle) / parts;
      for (let j = 0; j < parts; j++) {
        // TODO: maybe do not account for j iterations in the hue shift, as it gets longer and longer the further it goes and might not be too aesthetic
        // and probably have constant hue shift per arc
        const hue = (iterationCount * hueSpeed) % 360;
        iterationCount++;

        context.strokeStyle = `hsl(${hue}, 75%, 50%)`;
        context.beginPath();
        context.arc(
          center * scale,
          currentY,
          scale * Math.abs(radius),
          j * angleStep + startAngle,
          (j + 1) * angleStep + startAngle,
          shouldBeReversed,
        );
        context.stroke();
        yield;
      }

      currentX = value;
    }
  }

  const seq = drawStep(context);
  return () => {
    seq.next();
  };
}

/**
 * @param event {MessageEvent<{canvas: OffscreenCanvas; scale: number}>}
 * @return {void}
 */
onmessage = (event) => {
  const { canvas, scale } = event.data;
  const values = computeRecamanValues(canvas.width, canvas.height, scale);
  const draw = initDraw(canvas, scale, values);

  /** @type {number} */
  let requestId;
  let previousTime = 0;

  /**
   * @param {number} time
   */
  const render = (time) => {
    if (time - previousTime < 20) {
      requestId = requestAnimationFrame(render);
      return;
    }

    draw();
    previousTime = time;
    requestId = requestAnimationFrame(render);
  };

  requestId = requestAnimationFrame(render);
};
