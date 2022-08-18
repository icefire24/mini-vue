import { track,trigger } from "./effect"

function reactive(val) {
    return new Proxy(val, {
        get(target, key) {
          const res=Reflect.get(target,key)  
          //依赖收集
            track(target,key)
          return res
        },
        set(target, key, newval) {
            const res=Reflect.set(target,key,newval)
            //触发依赖
            trigger(target, key);
            return res
        }
    })
}
export {reactive}