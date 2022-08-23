import { readonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";

export const createComponentInstance = (vnode) => {
  //生成组件实例
  const instance = {
    vnode,
    type: vnode.type,
      setupState: {},
    emit:() => {
    
    }
    };
    instance.emit=emit.bind(null,instance) as any
  return instance;
};

export const setupComponent = (instance) => {
  initProps(instance, instance.vnode.props);
  //todoinitSlots()
  setupStatefulComponent(instance);
};

const setupStatefulComponent = (instance) => {
  const Component = instance.type;
  instance.proxy = new Proxy(
    {},
    {
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
    }
  );
  const { setup } = Component;
  const { emit } = instance;

  if (setup) {
      let setupResult;
      //props为只读对象
    if (instance.props) {
      setupResult = setup(/**BUG*/ readonly(instance.props),{emit});
    } else {
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
