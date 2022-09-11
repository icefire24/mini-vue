import { effect } from "../reactivity/effect";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
export function createRenderer(options) {
  const { createElement, insert, patchProp } = options;
  const render = (vnode, container) => {
    patch(null,vnode, container);
  };

  const patch = (n1,n2, container, parentInstance?) => {
    if (n2.type == "Text") {
      processText(n2, container, parentInstance);
    } else {
      if (typeof n2.type == "string") {
        processElement(n1,n2, container, parentInstance);
      } else {
        processComponent(n2, container, parentInstance);
      }
    }
  };
  function processText(vnode, container, parentInstance) {
    const text: Text = document.createTextNode(vnode.children);
    vnode.el = container;
    container.appendChild(text);
  }
  function processElement(n1,n2, container, parentInstance) {
    mountEelment(n1,n2, container, parentInstance);
  }
  function mountEelment(n1,n2, container, parentInstance) {
    if (!n1) {
      console.log('init');
      const el: any = createElement(n2.type);
      n2.el = el;
      const { children, props } = n2;
      console.log(children);

      //子节点是文本直接插入
      if (typeof children == "string" || typeof children == "number") {
        el.textContent = children;
      } else {
        //子节点有组件循环处理
        children.forEach((v) => {
          patch(n1,v, el, parentInstance);
        });
      }
      for (const key in props) {
        const val = props[key];
        patchProp(el, key, val);
      }
      // container.append(el);
      insert(el, container);
    } else {
      console.log('update');
      
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
    effect(() => {
      //初始化节点
      if (instance.isMount) {
        const { proxy } = instance;
        const subTree=instance.subTree = instance.render.call(proxy);
        
        patch(null,subTree, container, instance);
        vnode.el = subTree.el;
        instance.isMount=false
      } else {
        console.log('usb');
        
        //更新节点对比subTree
        const { proxy } = instance;
        const preSubTree=instance.subTree
        const subTree = (instance.subTree = instance.render.call(proxy));

        patch(preSubTree,subTree, container, instance);
        vnode.el = subTree.el;
      }
    });
  };
  return {
    createApp: createAppApi(render),
  };
}
