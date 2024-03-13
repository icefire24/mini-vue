import {  h, inject, ref } from "../../../lib/esm.js";

export const Foo = {
  render() {
    return h(
      "div",
      {

      },
      root2 ?
        [h('Text', {}, this.$props.msg)] : 'root2'
    );
  },
  setup(props, { emit }) {
    let root2 = ref(true);
    window.root2 = root2;
    const add = () => {
      root2.value = !root2.value;
    };
    return {
      root2,
    };
  }
}