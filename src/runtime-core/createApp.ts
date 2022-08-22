import { createVnode } from "./createVnode";
import { render } from "./render";

export const createApp = (rootComponent) => {
  return {
      mount(rootContainer) {
          const vnode=createVnode(rootComponent)
          render(vnode,rootContainer)
    }
  };
};


