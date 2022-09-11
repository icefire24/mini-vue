import { h, createTextVnode, provide, inject,ref } from "../../../lib/esm.js";
import { Foo } from "./Foo.js";

export const App = {
    render() {
        return h(
          "div",
          {
            id: "root",
            class: ["red", "hard"],
            onClick() {},
          },
          [h('div', {
            
          },'niaho'),h('div',{onClick(){this.num++}},'点击')]
        );
    },
  setup() {
       let num=ref(1)
        return {
            num
        }
    }
}