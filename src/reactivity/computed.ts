import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
    private _getter: any;
    private _value: any;
    private _dirty: boolean = true
    private _effect
    constructor(getter) {
        this._getter = getter
        
        this._effect = new ReactiveEffect(getter);
        this._effect.scheduler = () => {
          if (!this._dirty) {
            this._dirty = true;
          }
        };
  }
    get value() {
        if (this._dirty) {
            this._dirty = false
            this._value=this._effect.run()
            return this._value
      }
    return this._value;
  }
}
export const computed=(getter) => {
   return new ComputedRefImpl(getter)
}