'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const createVnode = (type, props, children) => {
    const vnode = {
        type,
        props,
        children
    };
    return vnode;
};

const createComponentInstance = (vnode) => {
    //生成组件实例
    const component = {
        vnode,
        type: vnode.type
    };
    return component;
};
const setupComponent = (instance) => {
    //initProps()    
    //initSlots()
    setupStatefulComponent(instance);
};
const setupStatefulComponent = (instance) => {
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
};
const handleSetupResult = (instance, setupResult) => {
    if (typeof setupResult == 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
};
const finishComponentSetup = (instance) => {
    const Component = instance.type;
    if (!Component.render) {
        instance.render = Component.render;
    }
};

const render = (vnode, container) => {
    patch(vnode);
};
const patch = (vnode, container) => {
    processComponent(vnode);
};
function processComponent(vnode, container) {
    mountComponent(vnode);
}
const mountComponent = (vnode, container) => {
    const instance = createComponentInstance(vnode);
    //初始化组件setup
    setupComponent(instance);
    setupRenderEffect(instance);
};
const setupRenderEffect = (instance, container) => {
    const subTree = instance.render();
    patch(subTree);
};

const createApp = (rootComponent) => {
    return {
        mount(rootContainer) {
            const vnode = createVnode(rootComponent);
            render(vnode);
        }
    };
};

function h(type, props, children) {
    return createVnode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
