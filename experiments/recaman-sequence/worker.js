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
 * @return {void}
 */
function draw(canvas, scale, values) {
  const context = canvas.getContext("2d");
  if (context === null) {
    throw new Error("cannot init context for rendering");
  }

  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);

  let currentX = 0;
  const currentY = height / 2;

  values.forEach((value, count) => {
    const startAngle = count % 2 === 0 ? Math.PI : 0;
    const endAngle = count % 2 === 0 ? 2 * Math.PI : Math.PI;

    const radius = (value - currentX) / 2;
    const center = currentX + radius;

    context.beginPath();
    context.arc(center * scale, currentY, scale * Math.abs(radius), startAngle, endAngle);
    context.stroke();

    currentX = value;
  });
}

/**
 * @param event {MessageEvent<{canvas: OffscreenCanvas; scale: number}>}
 * @return {void}
 */
onmessage = (event) => {
  const { canvas, scale } = event.data;
  const values = computeRecamanValues(canvas.width, canvas.height, scale);
  draw(canvas, scale, values);
};
