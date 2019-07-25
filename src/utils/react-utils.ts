export const classList = (classes: { [key: string]: boolean }) =>
  Object.entries(classes)
    .filter(entry => entry[1])
    .map(entry => entry[0])
    .join(' ');
