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
  const el:HTMLElement=document.createElement(vnode.type)
  const { children, props } = vnode
  if (typeof children == 'string') {
    
    el.textContent = children
  } else {
    children.forEach(v => {
      patch(v,el)
    });
  }
  for (const key in props) {
    const val = props[key]
    el.setAttribute(key,val)
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
    setupRenderEffect(instance,container)
}
const setupRenderEffect = (instance,container) => {
    const subTree = instance.render()
    patch(subTree,container)
};


