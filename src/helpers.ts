export function hexToNumber(arr: number[]): number {
  return parseInt(arr.map(i => i.toString(16)).join(''), 16);
}
