import { createComponentInstance, setupComponent } from "./component";

export const render = (vnode, container) => {
  patch(vnode, container);
};

const patch = (vnode, container) => {
  processComponent(vnode, container);
};

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


