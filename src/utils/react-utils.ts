export const classList = (classes: any) =>
  Object.entries(classes)
    .filter(entry => entry[1])
    .map(entry => entry[0])
    .join(' ');
