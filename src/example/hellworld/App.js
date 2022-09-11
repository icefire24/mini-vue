import { h, createTextVnode, provide, inject, ref } from "../../../lib/esm.js";
import { Foo } from "./Foo.js";

export const App = {
  render() {
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
       
      },
      [
        h("div", {}, this.num),
        h(
          "div",
          {
            onClick:this.add
          },
          "点击"
        ),
      ]
    );
  },
  setup() {
    let num = ref(1);
    const add = () => {
      console.log(num.value);
      num.value++;
    };
    return {
      num,
      add,
    };
  },
};
