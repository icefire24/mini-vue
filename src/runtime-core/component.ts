import { readonly } from '../reactivity/reactive'
import { proxyRefs } from '../reactivity/ref'
import { emit } from './componentEmit'
import { initProps } from './componentProps'
let currentInstance = null
export const createComponentInstance = (vnode, parent) => {
  //生成组件实例
  const instance = {
    vnode,
    type: vnode.type,
    setupState: {},
    emit: () => {},
    parent,
    provides: parent ? parent.provides : {},
    isMount: true,
    subTree: null
  }
  instance.emit = emit.bind(null, instance) as any

  return instance
}

export const setupComponent = (instance) => {
  initProps(instance, instance.vnode.props)
  //todoinitSlots()
  console.log(instance)

  setupStatefulComponent(instance)
}

const setupStatefulComponent = (instance) => {
  const Component = instance.type
  instance.proxy = new Proxy(
    {},
    {
      get(target, key) {
        const { setupState, props } = instance
        const hasOwn = (val, key) => {
          return Object.prototype.hasOwnProperty.call(val, key)
        }
        if (hasOwn(setupState, key)) {
          return setupState[key]
        }
        if (hasOwn(props, key)) {
          return props[key]
        }

        if (key == '$el') {
          return instance.vnode.el
        }
        if (key == '$props') {
          return instance.vnode.props
        }
        if (key == '$slot') {
          return instance.vnode.slot
        }
      }
    }
  )
  const { setup } = Component
  const { emit } = instance

  if (setup) {
    let setupResult
    //props为只读对象
    setCurrentInstance(instance)
    if (instance.props) {
      console.log(instance.props)
      console.log(instance)

      setupResult = setup(/**BUG*/ readonly(instance.props), { emit })
    } else {
      setupResult = setup({}, { emit })
    }
    setCurrentInstance(null)
    handleSetupResult(instance, setupResult)
  }
}

const handleSetupResult = (instance, setupResult) => {
  if (typeof setupResult == 'object') {
    instance.setupState = proxyRefs(setupResult)
  }

  finishComponentSetup(instance)
}

const finishComponentSetup = (instance) => {
  const Component = instance.type
  instance.render = Component.render
}
function setCurrentInstance(instance) {
  currentInstance = instance
}
export const getCurrentInstance: any = () => {
  return currentInstance
}
