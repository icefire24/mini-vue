import { extend } from "../shared";

class ReactiveEffect {
  private _fn;
  active = true;
  deps = [];
  constructor(fn) {
    this._fn = fn;
  }
  public onStop?: () => void;

  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
}
const cleanupEffect = (effect) => {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
};
let activeEffect;
export function effect(fn,options={}) {
  const _effect = new ReactiveEffect(fn);
  extend(_effect,options)
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
const targetMap = new Map();
export const track = (target, key) => {
  //target->key->dep

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
 if(!activeEffect)return
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
};
export const trigger = (target, key) => {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  dep.forEach((dep) => {
    dep.run();
  });
};

export const stop = (runner) => {
  return runner.effect.stop();
};
