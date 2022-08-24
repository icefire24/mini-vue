import { createVnode } from './createVnode';

export function h(type,props?,children?) {
    return createVnode(type,props,children)
}

export const createTextVnode = (type, props?, children?) => {
  const vnode = {
    type: "Text",
    props,
    children,
    el: null,
  };
  vnode.children = type;
  return vnode;
};