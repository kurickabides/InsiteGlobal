// ================================================
// ✅ Utility: objectTools
// Description: Deep clone and equality helpers using lodash
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: services/utils/objectTools.ts
// ================================================

import _cloneDeep from "lodash/cloneDeep";
import _isEqual from "lodash/isEqual";

/**
 * Returns a deep copy of any object, array, or primitive.
 */
export const deepClone = <T>(input: T): T => {
  return _cloneDeep(input);
};

/**
 * Returns true if two values are deeply equal.
 */
export const deepEqual = <T>(a: T, b: T): boolean => {
  return _isEqual(a, b);
};
