import { getCurrenInstance, h, inject } from "../../../lib/esm.js";

export const Foo = {
    render() {
        return h(
          "div",
          {
            
          },
          [h('Text',{},'libaiyi')]
        );
    },
  setup(props, { emit }) {
        return {
            msg:"子组件"
        }
    }
}