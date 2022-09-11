import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
export function createRenderer(options) {
  const { createElement, insert, patchProp } = options;
  const render = (vnode, container) => {
    patch(vnode, container);
  };

  const patch = (vnode, container, parentInstance?) => {
    if (vnode.type == 'Text') {
      processText(vnode,container,parentInstance)
    }
    else {
      
      if (typeof vnode.type == "string") {
        processElement(vnode, container, parentInstance);
      } else {
        processComponent(vnode, container, parentInstance);
      }
    }
  };
  function processText(vnode, container, parentInstance) {
    const text: Text = document.createTextNode(vnode.children);
    vnode.el = container;
    container.appendChild(text);
  }
  function processElement(vnode, container, parentInstance) {
    mountEelment(vnode, container, parentInstance);
  }
  function mountEelment(vnode, container, parentInstance) {
    
        const el: any = createElement(vnode.type);
        vnode.el = el;
    const { children, props } = vnode;
    //子节点是文本直接插入
        if (typeof children == "string") {
          el.textContent = children;
        } else {
        //子节点有组件循环处理
          children.forEach((v) => {
            patch(v, el, parentInstance);
          });
        }
        for (const key in props) {
          const val=props[key]
          patchProp(el,key,val)
        }
        // container.append(el);
        insert(el,container)
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
  return {
    createApp: createAppApi(render),
  };
}
