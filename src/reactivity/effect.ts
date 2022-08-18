class ReactiveEffect {
    private _fn
  constructor(fn) {
    this._fn = fn;
  }
    run() {
      activeEffect=this
    this._fn();
  }
}
let activeEffect
export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
const targetMap = new Map();
export const track = (target, key) => {
  //target->key->dep
  
  let depsMap = targetMap.get(target);
    if (!depsMap) {
      depsMap=new Map()
      targetMap.set(target,depsMap)
  }
  let dep = depsMap.get(key);
      if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
      }
  dep.add(activeEffect)
};
export const trigger=(target,key) => {
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
    dep.forEach(dep => {
        dep.run()
    });
}
