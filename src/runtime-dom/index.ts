import { createRenderer } from "../runtime-core/render";

function createElement(el:any) {
    return document.createElement(el);
}
function patchProp(el,key,value) {
  const isClick = (name: string) => {
    let reg = /^on[A-Z]/;
    return reg.test(name);
  };
  if (isClick(key)) {
    let eventtype = key.slice(2).toLowerCase();
    el.addEventListener(eventtype, value);
  } else {
    const val = value;
    el.setAttribute(key, val);
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
