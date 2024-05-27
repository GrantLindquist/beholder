export const getDefaultFowMatrix = (width: number, height: number) => {
  let defaultFow = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      defaultFow.push(x + ',' + y);
    }
  }
  return defaultFow;
};
