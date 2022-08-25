export function emit(instance, str: string, ...args) {
  let name = "on" + str.charAt(0).toUpperCase() + str.slice(1);
  const { props } = instance;
  props[name](...args);
}
