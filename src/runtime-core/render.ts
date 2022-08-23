import { createComponentInstance, setupComponent } from "./component";

export const render = (vnode, container) => {
  patch(vnode, container);
};

const patch = (vnode, container) => {
  if (typeof vnode.type=='string') {
    
    processElement(vnode,container)
  } else {
    processComponent(vnode, container);
  }
};
function processElement(vnode,container) {
  mountEelment(vnode,container)
}
function mountEelment(vnode, container) {
  const el: HTMLElement = document.createElement(vnode.type)
  vnode.el=el
  const { children, props } = vnode
  if (typeof children == 'string') {
    
    el.textContent = children
  } else {
    children.forEach(v => {
      patch(v,el)
    });
  }
  const isClick = (name: string) => {
    let reg = /^on[A-Z]/
    
    return reg.test(name)
  }
  for (const key in props) {
    if (isClick(key)) {
      
      let eventtype = key.slice(2).toLowerCase()

      el.addEventListener(eventtype, props[key])
    } else {
      
      const val = props[key]
      el.setAttribute(key,val)
    }
  }
 container.append(el)
}
function processComponent(vnode, container) {
     mountComponent(vnode,container)
}
const mountComponent=(vnode,container) => {
    const instance = createComponentInstance(vnode)
    //初始化组件setup
    setupComponent(instance)
    setupRenderEffect(instance,vnode,container)
}
const setupRenderEffect = (instance,vnode, container) => {
    const {proxy} =instance
    const subTree = instance.render.call(proxy)
  patch(subTree, container)
  vnode.el=subTree.el
};


