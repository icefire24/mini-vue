const createVnode = (type, props, children) => {
    const vnode = {
        type,
        props,
        children,
        el: null
    };
    return vnode;
};

const createComponentInstance = (vnode) => {
    //生成组件实例
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
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
    instance.proxy = new Proxy({}, {
        get(target, key) {
            const { setupState } = instance;
            if (key in setupState) {
                return setupState[key];
            }
            if (key == '$el') {
                return instance.vnode.el;
            }
        }
    });
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
        //TODO 未完成
        processComponent(vnode, container);
    }
};
function processElement(vnode, container) {
    mountEelment(vnode, container);
}
function mountEelment(vnode, container) {
    const el = document.createElement(vnode.type);
    vnode.el = el;
    const { children, props } = vnode;
    if (typeof children == 'string') {
        el.textContent = children;
    }
    else {
        children.forEach(v => {
            patch(v, el);
        });
    }
    const isClick = (name) => {
        let reg = /^on[A-Z]/;
        return reg.test(name);
    };
    for (const key in props) {
        if (isClick(key)) {
            let eventtype = key.slice(2).toLowerCase();
            el.addEventListener(eventtype, props[key]);
        }
        else {
            const val = props[key];
            el.setAttribute(key, val);
        }
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
    setupRenderEffect(instance, vnode, container);
};
const setupRenderEffect = (instance, vnode, container) => {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container);
    vnode.el = subTree.el;
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

export { createApp, h };
