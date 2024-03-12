import { extend } from "../shared";
let shouldTrack = false;
let activeEffect;

export class ReactiveEffect {
  private _fn;
  private scheduler;
  active = true;
  deps = [];
  constructor(fn,scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
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
    if (!this.active) {
      activeEffect = this;
      return this._fn();
    }
    shouldTrack = true;
    activeEffect = this;
    const result = this._fn();

    // 执行fn后停止收集依赖
    shouldTrack = false;

    return result;
  }
}
const cleanupEffect = (effect) => {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
};
export function effect(fn, options:any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);
  console.log(_effect);
  
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
  if (!activeEffect) return;
  if (shouldTrack) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
};
export const trackEffects=(dep) => {
  if (dep.has(activeEffect)) return
  dep.add(activeEffect);
  activeEffect.deps.push(dep)
}
export const triggerEffects=(dep) => {
   dep.forEach((effect) => {
     if (effect.scheduler) {
      effect.scheduler()
     } else {
       
       effect.run();
    }
   });
}
export const isTrack=() => {
 return shouldTrack&&activeEffect!=undefined
}
export const trigger = (target, key) => {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  triggerEffects(dep)
};

export const stop = (runner) => {
  return runner.effect.stop();
};
