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
        h(Foo,{msg:this.num},null),
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
    let num = ref(123);
    let root = ref(true)
    window.root=root
    const add = () => {
      num.value=456
    };
    return {
      root,
      num,
      add,
    };
  },
};
