import { h, createTextVnode, provide, inject, ref } from "../../../lib/esm.js";
import { Foo } from "./Foo.js";

export const App = {
  render() {
    return h(
      "div",
      {
        class: 'red',
       
      },
      this.root?
      [
        h('Text',{},'libaier'),
        h(
          "div",
          {
            onClick:this.add
          },
          "点击"
        ),
      ]:'niaho'
      // 'nihao'
    );
  },
  setup(props, { emit }) {
    window.flag=true
    let num = ref(1);
    let root = ref(true)
    window.root=root
    const add = () => {
      root.value=!root.value
    };
    return {
      root,
      num,
      add,
    };
  },
};
