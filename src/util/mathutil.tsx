const clamp = function (x: number, min = 0.0, max = 1.0) {
  return Math.max(min, Math.min(x, max));
};

export { clamp };
