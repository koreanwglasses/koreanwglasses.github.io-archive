export function range(stop: number): number[];
export function range(start: number, stop: number, skip?: number): number[];
export function range(
  startOrStop: number,
  stopOrNull: number | null = null,
  skip: number = 1
): number[] {
  const start = stopOrNull === null ? 0 : startOrStop;
  const stop = stopOrNull === null ? startOrStop : stopOrNull;

  const result = [];
  for (let i = start; i < stop; i += skip) {
    result.push(i);
  }

  return result;
}

export const scale = (factor: number, array: number[]) =>
  array.map(value => factor * value);
export const add = (...arrays: number[][]) => {
  const maxLength = Math.max(...arrays.map(array => array.length));
  const sum = [];
  for (let i = 0; i < maxLength; i++) {
    sum[i] = arrays
      .map(array => (i < array.length ? array[i] : 0))
      .reduce((prev, cur) => prev + cur);
  }
  return sum;
};
