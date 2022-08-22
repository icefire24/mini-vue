import { hasChanged, isObject } from "../shared";
import { isTrack, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class rempl {
  private _value: unknown;
  public oldvalue: any;
  public __v_isRef = true;
  public dep;
  constructor(val) {
    this.oldvalue = val;
    this._value = convet(val);
    this.dep = new Set();
  }
  get value() {
    if (isTrack()) {
      trackEffects(this.dep);
      return this._value;
    } else {
      return this._value;
    }
  }
  set value(val) {
    if (hasChanged(val, this.oldvalue)) {
      this.oldvalue = val;
      this._value = convet(val);
      triggerEffects(this.dep);
    }
  }
}
const convet = (val) => {
  return isObject(val) ? reactive(val) : val;
};
const ref = (val) => {
  return new rempl(val);
};
const shallowUnwrapHandlers = {
  get(target, key, receiver) {
    // 如果里面是一个 ref 类型的话，那么就返回 .value
    // 如果不是的话，那么直接返回value 就可以了
    return unRef(Reflect.get(target, key, receiver));
  },
  set(target, key, value, receiver) {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      return (target[key].value = value);
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  },
};

// 这里没有处理 objectWithRefs 是 reactive 类型的时候
// TODO reactive 里面如果有 ref 类型的 key 的话， 那么也是不需要调用 ref.value 的
// （but 这个逻辑在 reactive 里面没有实现）
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
// 把 ref 里面的值拿到
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function isRef(value) {
  return !!value.__v_isRef;
}
export { ref };
