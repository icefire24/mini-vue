'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const extend = Object.assign;
const isObject = (val) => {
    if (val != null && typeof val == 'object') {
        return true;
    }
    return false;
};
function hasChanged(value, oldValue) {
    return !Object.is(value, oldValue);
}

let shouldTrack = false;
let activeEffect;
class ReactiveEffect {
    constructor(fn, scheduler) {
        this.active = true;
        this.deps = [];
        this._fn = fn;
    }
    stop() {
        if (this.active) {
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
    run() {
        if (!this.active) {
            activeEffect = this;
            return this._fn();
        }
        shouldTrack = true;
        activeEffect = this;
        const result = this._fn();
        // 执行fn后停止收集依赖
        shouldTrack = false;
        return result;
    }
}
const cleanupEffect = (effect) => {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
};
function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    extend(_effect, options);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}
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
    if (!activeEffect)
        return;
    if (shouldTrack) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
    }
};
const trackEffects = (dep) => {
    if (dep.has(activeEffect))
        return;
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
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
const isTrack = () => {
    return shouldTrack && activeEffect != undefined;
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

class revimlp {
    constructor(val) {
        this.__v_isRef = true;
        this.oldvalue = val;
        this._value = convet(val);
        this.dep = new Set();
    }
    get value() {
        if (isTrack()) {
            trackEffects(this.dep);
            return this._value;
        }
        else {
            return this._value;
        }
    }
    set value(val) {
        if (hasChanged(val, this.oldvalue)) {
            this.oldvalue = val;
            this._value = convet(val);
            triggerEffects(this.dep);
        }
    }
}
const convet = (val) => {
    return isObject(val) ? reactive(val) : val;
};
const ref = (val) => {
    return new revimlp(val);
};
const shallowUnwrapHandlers = {
    get(target, key, receiver) {
        // 如果里面是一个 ref 类型的话，那么就返回 .value
        // 如果不是的话，那么直接返回value 就可以了
        return unRef(Reflect.get(target, key, receiver));
    },
    set(target, key, value, receiver) {
        const oldValue = target[key];
        if (isRef(oldValue) && !isRef(value)) {
            return (target[key].value = value);
        }
        else {
            return Reflect.set(target, key, value, receiver);
        }
    },
};
// 这里没有处理 objectWithRefs 是 reactive 类型的时候
// BUG reactive 里面如果有 ref 类型的 key 的话， 那么也是不需要调用 ref.value 的
// （but 这个逻辑在 reactive 里面没有实现）
function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
// 把 ref 里面的值拿到
function unRef(ref) {
    return isRef(ref) ? ref.value : ref;
}
function isRef(value) {
    return !!value.__v_isRef;
}

function emit(instance, str, ...args) {
    let name = "on" + str.charAt(0).toUpperCase() + str.slice(1);
    const { props } = instance;
    props[name](...args);
}

function initProps(instance, rawProps) {
    instance.props = rawProps;
}

let currenInstance = null;
const createComponentInstance = (vnode, parent) => {
    //生成组件实例
    const instance = {
        vnode,
        type: vnode.type,
        setupState: {},
        emit: () => { },
        parent,
        provides: parent ? parent.provides : {},
        isMount: true,
        subTree: null
    };
    instance.emit = emit.bind(null, instance);
    return instance;
};
const setupComponent = (instance) => {
    initProps(instance, instance.vnode.props);
    //todoinitSlots()
    console.log(instance);
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
            if (key == "$props") {
                return instance.vnode.props;
            }
            if (key == "$slot") {
                return instance.vnode.slot;
            }
        },
    });
    const { setup } = Component;
    const { emit } = instance;
    if (setup) {
        let setupResult;
        //props为只读对象
        setCurrenInstance(instance);
        if (instance.props) {
            console.log(instance.props);
            console.log(instance);
            setupResult = setup(/**BUG*/ readonly(instance.props), { emit });
        }
        else {
            setupResult = setup({}, { emit });
        }
        setCurrenInstance(null);
        handleSetupResult(instance, setupResult);
    }
};
const handleSetupResult = (instance, setupResult) => {
    if (typeof setupResult == "object") {
        instance.setupState = proxyRefs(setupResult);
    }
    finishComponentSetup(instance);
};
const finishComponentSetup = (instance) => {
    const Component = instance.type;
    instance.render = Component.render;
};
function setCurrenInstance(instance) {
    currenInstance = instance;
}
const getCurrenInstance = () => {
    return currenInstance;
};

const createVnode = (type, props, children) => {
    const vnode = {
        type,
        props,
        children,
        el: null
    };
    return vnode;
};

function createAppApi(render) {
    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                const vnode = createVnode(rootComponent);
                render(vnode, rootContainer);
            }
        };
    };
}

function createRenderer(options) {
    const { createElement, insert, patchProp } = options;
    const render = (vnode, container) => {
        patch(null, vnode, container);
    };
    const patch = (n1, n2, container, parentInstance) => {
        if (n2.type == "Text") {
            processText(n2, container);
        }
        else {
            if (typeof n2.type == "string") {
                processElement(n1, n2, container, parentInstance);
            }
            else {
                processComponent(n2, container, parentInstance);
            }
        }
    };
    function processText(vnode, container, parentInstance) {
        // const text: Text = document.createTextNode(vnode.children);
        vnode.el = container;
        container.textContent = vnode.children;
    }
    function processElement(n1, n2, container, parentInstance) {
        mountEelment(n1, n2, container, parentInstance);
    }
    function mountEelment(n1, n2, container, parentInstance) {
        if (!n1) {
            console.log('init');
            const el = createElement(n2.type);
            n2.el = el;
            const { children, props } = n2;
            //子节点是文本直接插入
            if (typeof children == "string" || typeof children == "number") {
                el.textContent = children;
            }
            else {
                //子节点有组件循环处理
                children.forEach((v) => {
                    patch(n1, v, el, parentInstance);
                });
            }
            for (const key in props) {
                const val = props[key];
                patchProp(el, key, null, val);
            }
            insert(el, container);
        }
        else {
            console.log('update');
            const { children, props } = n2;
            n2.el = n1.el;
            //props更新
            for (const key in props) {
                const nextProps = props[key];
                const preProps = n1.props[key];
                patchProp(n1.el, key, preProps, nextProps);
            }
            // children更新
            patchChildren(n1, n2, parentInstance);
        }
    }
    function patchChildren(pre, next, parentInstance) {
        const preChildren = pre.children;
        const nextChildren = next.children;
        if (typeof nextChildren == 'string') {
            if (Array.isArray(preChildren)) {
                //把老的children清空
                pre.el.innerHtml = '';
            }
            //赋值新的
            preChildren != nextChildren ? pre.el.textContent = nextChildren : '';
        }
        else {
            if (typeof preChildren == 'string') {
                pre.el.innerHtml = '';
                nextChildren.forEach((v) => {
                    patch(null, v, pre.el, parentInstance);
                });
            }
        }
    }
    function processComponent(vnode, container, parentInstance) {
        mountComponent(vnode, container, parentInstance);
    }
    const mountComponent = (vnode, container, parentInstance) => {
        const instance = createComponentInstance(vnode, parentInstance);
        //初始化组件setup
        setupComponent(instance);
        setupRenderEffect(instance, vnode, container);
    };
    const setupRenderEffect = (instance, vnode, container) => {
        //响应式变量更新后重新触发页面渲染
        console.log('kk');
        effect(() => {
            //初始化节点
            if (instance.isMount) {
                const { proxy } = instance;
                const subTree = instance.subTree = instance.render.call(proxy);
                patch(null, subTree, container, instance);
                vnode.el = subTree.el;
                instance.isMount = false;
            }
            else {
                //更新节点对比subTree
                console.log(222);
                const { proxy } = instance;
                const preSubTree = instance.subTree;
                const subTree = (instance.subTree = instance.render.call(proxy));
                vnode.el = subTree.el;
                patch(preSubTree, subTree, container, instance);
            }
        });
    };
    return {
        createApp: createAppApi(render),
    };
}

function h(type, props, children) {
    return createVnode(type, props, children);
}
const createTextVnode = (type, props, children) => {
    const vnode = {
        type: "Text",
        props,
        children,
        el: null,
    };
    vnode.children = type;
    return vnode;
};

function provide(key, val) {
    var _a;
    let instance = getCurrenInstance();
    if (instance.provides === ((_a = instance.parent) === null || _a === void 0 ? void 0 : _a.provides)) {
        console.log(1);
        instance.provides = Object.create(instance.parent.provides);
    }
    instance.provides[key] = val;
}
function inject(key, defaultval) {
    let { provides, parent } = getCurrenInstance();
    if (key in parent.provides) {
        return parent.provides[key];
    }
    else if (defaultval) {
        if (typeof defaultval === "function") {
            return defaultval();
        }
        return defaultval;
    }
}

function createElement(el) {
    return document.createElement(el);
}
function patchProp(el, key, pre, next) {
    const isClick = (name) => {
        let reg = /^on[A-Z]/;
        return reg.test(name);
    };
    if (isClick(key)) {
        let eventtype = key.slice(2).toLowerCase();
        el.addEventListener(eventtype, next);
    }
    else {
        if (pre != next) {
            el.setAttribute(key, next);
        }
        if (next == null || next == undefined) {
            el.removeAttribute(key);
            return;
        }
    }
}
function insert(el, container) {
    container.append(el);
}
const renderer = createRenderer({
    createElement,
    patchProp,
    insert
});
function createApp(...args) {
    return renderer.createApp(...args);
}

exports.createApp = createApp;
exports.createRenderer = createRenderer;
exports.createTextVnode = createTextVnode;
exports.getCurrenInstance = getCurrenInstance;
exports.h = h;
exports.inject = inject;
exports.provide = provide;
exports.ref = ref;
