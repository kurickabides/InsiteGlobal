import { camelCase } from "lodash"; // or write your own

export function normalizeKeys<T = any>(obj: Record<string, any>): T {
  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = key.charAt(0).toLowerCase() + key.slice(1);
      result[newKey] = obj[key];
    }
  }
  return result;
}
