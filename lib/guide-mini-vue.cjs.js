'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const createVnode = (type, props, children) => {
    const vnode = {
        type,
        props,
        children,
        el: null
    };
    return vnode;
};

const isObject = (val) => {
    if (val != null && typeof val == 'object') {
        return true;
    }
    return false;
};

const targetMap = new Map();
const track = (target, key) => {
    //target->key->dep
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    return;
};
const triggerEffects = (dep) => {
    dep.forEach((effect) => {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    });
};
const trigger = (target, key) => {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    triggerEffects(dep);
};

function reactive(val) {
    return new Proxy(val, {
        get: createGetter(),
        set: createSetter(),
    });
}
const readonly = (val) => {
    return new Proxy(val, {
        get: createGetter(true),
        set: createSetter(true),
    });
};
const createGetter = (isReadonly = false) => {
    return function get(target, key) {
        if (key == "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key == "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        isReadonly ? "" : track(target, key);
        return res;
    };
};
const createSetter = (isReadonly = false) => {
    return function set(target, key, newval) {
        if (isReadonly) {
            return true;
        }
        else {
            const res = Reflect.set(target, key, newval);
            trigger(target, key);
            return res;
        }
    };
};

function emit(instance, str, ...args) {
    console.log('instance, str: string, ...args: ', instance, str, ...args);
    let name = 'on' +
        str.charAt(0).toUpperCase() + str.slice(1);
    console.log(name);
    const { props } = instance;
    props[name](...args);
}

function initProps(instance, rawProps) {
    instance.props = rawProps;
}

const createComponentInstance = (vnode) => {
    //生成组件实例
    const instance = {
        vnode,
        type: vnode.type,
        setupState: {},
        emit: () => {
        }
    };
    instance.emit = emit.bind(null, instance);
    return instance;
};
const setupComponent = (instance) => {
    initProps(instance, instance.vnode.props);
    //todoinitSlots()
    setupStatefulComponent(instance);
};
const setupStatefulComponent = (instance) => {
    const Component = instance.type;
    instance.proxy = new Proxy({}, {
        get(target, key) {
            const { setupState, props } = instance;
            const hasOwn = (val, key) => {
                return Object.prototype.hasOwnProperty.call(val, key);
            };
            if (hasOwn(setupState, key)) {
                return setupState[key];
            }
            if (hasOwn(props, key)) {
                return props[key];
            }
            if (key == "$el") {
                return instance.vnode.el;
            }
        },
    });
    const { setup } = Component;
    const { emit } = instance;
    if (setup) {
        let setupResult;
        //props为只读对象
        if (instance.props) {
            setupResult = setup(/**BUG*/ readonly(instance.props), { emit });
        }
        else {
            setupResult = setup();
        }
        handleSetupResult(instance, setupResult);
    }
};
const handleSetupResult = (instance, setupResult) => {
    if (typeof setupResult == "object") {
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

exports.createApp = createApp;
exports.h = h;
