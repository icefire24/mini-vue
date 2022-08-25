import { createComponentInstance, setupComponent } from "./component";

export const render = (vnode, container) => {
  patch(vnode, container);
};

const patch = (vnode, container, parentInstance?) => {
  if (typeof vnode.type == "string") {
    processElement(vnode, container, parentInstance);
  } else {
    processComponent(vnode, container, parentInstance);
  }
};
function processElement(vnode, container, parentInstance) {
  mountEelment(vnode, container, parentInstance);
}
function mountEelment(vnode, container, parentInstance) {
  switch (vnode.type) {
    case "Text":
      const text: Text = document.createTextNode(vnode.children);
      vnode.el = text;
      container.appendChild(text);
      break;

    default:
      const el: HTMLElement = document.createElement(vnode.type);
      vnode.el = el;
      const { children, props } = vnode;
      if (typeof children == "string") {
        el.textContent = children;
      } else {
        children.forEach((v) => {
          patch(v, el, parentInstance);
        });
      }
      const isClick = (name: string) => {
        let reg = /^on[A-Z]/;

        return reg.test(name);
      };
      for (const key in props) {
        if (isClick(key)) {
          let eventtype = key.slice(2).toLowerCase();

          el.addEventListener(eventtype, props[key]);
        } else {
          const val = props[key];
          el.setAttribute(key, val);
        }
      }
      container.append(el);
      break;
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
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);

  patch(subTree, container, instance);
  vnode.el = subTree.el;
};
