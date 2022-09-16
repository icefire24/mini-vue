import { createRenderer } from "../runtime-core/render";

function createElement(el:any) {
    return document.createElement(el);
}
function patchProp(el,key,pre,next) {
  const isClick = (name: string) => {
    let reg = /^on[A-Z]/;
    return reg.test(name);
  };
  if (isClick(key)) {
    let eventtype = key.slice(2).toLowerCase();
    el.addEventListener(eventtype, next);
  } else {
    if (pre != next) {
    el.setAttribute(key, next);
    }
    if (next == null || next == undefined) {
      el.removeAttribute(key)
      return
    }
  }
}
function insert(el:any,container:any) {
    container.append(el)
}
const renderer:any = createRenderer({
    createElement,
    patchProp,
    insert
})

export function createApp(...args) {
    return renderer.createApp(...args)
}

export * from "../runtime-core/index";
