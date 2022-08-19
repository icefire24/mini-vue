import { isObject } from "../shared";
import { track, trigger } from "./effect";

function reactive(val) {
  return new Proxy(val, {
    get: createGetter(),
    set: createSetter(),
  });
}
export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  RAW = "__v_raw",
}
const readonly = (val) => {
  return new Proxy(val, {
    get: createGetter(true),
    set: createSetter(true),
  });
};

const createGetter = (isReadonly = false) => {
  return function get(target, key) {
    if (key == ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key == ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    const res = Reflect.get(target, key);
    if (isObject(res)) {

      return isReadonly ? readonly(res) : reactive(res);
    }
    isReadonly ? "" : track(target, key);
    return res;
  };
};
const createSetter = (isReadonly = false) => {
  return function set(target, key, newval) {
    if (isReadonly) {
      return true;
    } else {
      const res = Reflect.set(target, key, newval);
      trigger(target, key);
      return res;
    }
  };
};
export const isReactive = (val) => {
  return !!val[ReactiveFlags.IS_REACTIVE];
};
export const isReadonly = (val) => {
  return !!val[ReactiveFlags.IS_READONLY];
};
export const isProxy = (val) => {
  return isReadonly(val) || isReactive(val);
};
export { reactive, readonly };
