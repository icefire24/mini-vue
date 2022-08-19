export const extend = Object.assign
export const isObject=(val) => {
    if (val != null && typeof val == 'object') {
     return true
    }
    return false
}
export function hasChanged(value, oldValue) {
  return !Object.is(value, oldValue);
}
