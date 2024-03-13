import { h, createTextVnode, provide, inject, ref, getCurrentInstance } from "../../../lib/esm.js";
import { Foo } from "./Foo.js";

export const App = {
  render() {
    return h(
      "div",
      {
        class: 'red',

      },
      this.root ?
        [
          h(Foo, { msg: this.num }, null),
          h(
            "div",
            {
              onClick: this.add
            },
            "点击"
          ),
        ] : 'niaho'
      // 'nihao'
    );
  },
  setup(props, { emit }) {
    let num = ref(123);
    let root = ref(true)
    window.root = root
    const add = () => {
      for (let index = 0; index < 100; index++) {
        num.value++;
      }
      let instance=getCurrentInstance()
      console.log(instance);
      
    };
    return {
      root,
      num,
      add,
    };
  },
};
