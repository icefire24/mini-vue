import { effect } from '../reactivity/effect'
import { createComponentInstance, setupComponent } from './component'
import { createAppApi } from './createApp'
import { queueJobs } from './queueJob'
export function createRenderer(options) {
  const { createElement, insert, patchProp } = options
  const render = (vnode, container) => {
    patch(null, vnode, container)
  }

  const patch = (n1, n2, container, parentInstance?) => {
    if (n2.type == 'Text') {
      processText(n2, container, parentInstance)
    } else {
      if (typeof n2.type == 'string') {
        processElement(n1, n2, container, parentInstance)
      } else {
        processComponent(n2, container, parentInstance)
        // !n1 ? processComponent(n2, container, parentInstance) :
        //   updateComponent(n1,n2,container,parentInstance)
      }
    }
  }
  function updateComponent(n1, n2, container, parentInstance) {
    //TODO更新组件
  }
  function processText(vnode, container, parentInstance) {
    // const text: Text = document.createTextNode(vnode.children);
    vnode.el = container
    container.textContent = vnode.children
  }
  function processElement(n1, n2, container, parentInstance) {
    mountEelment(n1, n2, container, parentInstance)
  }
  function mountEelment(n1, n2, container, parentInstance) {
    if (!n1) {
      console.log('init')
      const el: any = createElement(n2.type)
      n2.el = el
      const { children, props } = n2
      //子节点是文本直接插入
      if (typeof children == 'string' || typeof children == 'number') {
        el.textContent = children
      } else {
        //子节点有组件循环处理
        children.forEach((v) => {
          patch(n1, v, el, parentInstance)
        })
      }
      for (const key in props) {
        const val = props[key]
        patchProp(el, key, null, val)
      }
      insert(el, container)
    } else {
      console.log('update')
      const { children, props } = n2
      n2.el = n1.el
      //props更新
      for (const key in props) {
        const nextProps = props[key]
        const preProps = n1.props[key]
        patchProp(n1.el, key, preProps, nextProps)
      }
      // children更新
      patchChildren(n1, n2, parentInstance)
    }
  }
  function patchChildren(pre, next, parentInstance) {
    const preChildren = pre.children
    const nextChildren = next.children
    if (typeof nextChildren == 'string') {
      if (Array.isArray(preChildren)) {
        //把老的children清空
        pre.el.innerHtml = ''
      }
      //赋值新的
      preChildren != nextChildren ? (pre.el.textContent = nextChildren) : ''
    } else {
      if (typeof preChildren == 'string') {
        pre.el.innerHtml = ''
        nextChildren.forEach((v) => {
          patch(null, v, pre.el, parentInstance)
        })
      } else {
        //todo diff算法对比更新子节点
        pre.el.innerHTML = ''
        nextChildren.forEach((v) => {
          patch(null, v, pre.el, parentInstance)
        })
      }
    }
  }
  function processComponent(vnode, container, parentInstance) {
    mountComponent(vnode, container, parentInstance)
  }
  const mountComponent = (vnode, container, parentInstance) => {
    const instance = createComponentInstance(vnode, parentInstance)
    //初始化组件setup
    setupComponent(instance)
    setupRenderEffect(instance, vnode, container)
  }
  const setupRenderEffect = (instance, vnode, container) => {
    //响应式变量更新后重新触发页面渲染
    console.log('kk')

    instance.update=effect(
      () => {
        //初始化节点
        if (instance.isMount) {
          const { proxy } = instance
          const subTree = (instance.subTree = instance.render.call(proxy))
          patch(null, subTree, container, instance)
          vnode.el = subTree.el
          instance.isMount = false
        } else {
          //更新节点对比subTree
          const { proxy } = instance
          const preSubTree = instance.subTree
          const subTree = (instance.subTree = instance.render.call(proxy))
          vnode.el = subTree.el
          patch(preSubTree, subTree, container, instance)
        }
      },
      {
        scheduler() {
          queueJobs(instance.update)
        }
      }
    )
  }
  return {
    createApp: createAppApi(render)
  }
}
