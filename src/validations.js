export function isValid(obj, params) {
  if (typeof obj !== "object") return false;
  const keys = Object.keys(obj);

  if (keys.length !== params.length) return false;
  for (const key of keys) {
    if (typeof keys[key] !== "string") return false;
    if (!params.includes(key)) return false;
  }

  return true;
}
