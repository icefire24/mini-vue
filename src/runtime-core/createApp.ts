import { createVnode } from "./createVnode";

export function createAppApi(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        const vnode = createVnode(rootComponent);
        render(vnode, rootContainer);
      },
    };
  };
}
