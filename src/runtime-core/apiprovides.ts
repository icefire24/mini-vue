import { getCurrentInstance } from './component'
export function provide(key: any, val: any) {
  let instance = getCurrentInstance()

  if (instance.provides === instance.parent?.provides) {
    instance.provides = Object.create(instance.parent.provides)
  }

  instance.provides[key] = val
}
export function inject(key: any, defaultval?: any) {
  let { provides, parent } = getCurrentInstance()
  if (key in parent.provides) {
    return parent.provides[key]
  } else if (defaultval) {
    if (typeof defaultval === 'function') {
      return defaultval()
    }
    return defaultval
  }
}
