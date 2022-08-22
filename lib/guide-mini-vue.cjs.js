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
    instance.render = Component.render;
};

const render = (vnode, container) => {
    patch(vnode, container);
};
const patch = (vnode, container) => {
    if (typeof vnode.type == 'string') {
        processElement(vnode, container);
    }
    else {
        processComponent(vnode, container);
    }
};
function processElement(vnode, container) {
    mountEelment(vnode, container);
}
function mountEelment(vnode, container) {
    const el = document.createElement(vnode.type);
    const { children, props } = vnode;
    if (typeof children == 'string') {
        el.textContent = children;
    }
    else {
        children.forEach(v => {
            patch(v, el);
        });
    }
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
const mountComponent = (vnode, container) => {
    const instance = createComponentInstance(vnode);
    //初始化组件setup
    setupComponent(instance);
    setupRenderEffect(instance, container);
};
const setupRenderEffect = (instance, container) => {
    const subTree = instance.render();
    patch(subTree, container);
};

const createApp = (rootComponent) => {
    return {
        mount(rootContainer) {
            const vnode = createVnode(rootComponent);
            render(vnode, rootContainer);
        }
    };
};

function h(type, props, children) {
    return createVnode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
