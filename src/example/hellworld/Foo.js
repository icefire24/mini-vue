import { getCurrenInstance, h } from "../../../lib/esm.js";

export const Foo = {
    render() {
        return h(
          "div",
          {
            id: "root",
            class: ["red", "hard"],
            onClick() {
              console.log('111');
            }
          },
          'niaho'
        );
    },
  setup(props, { emit }) {
    let instance=getCurrenInstance()
    console.log(instance);
    emit('add',1,2)
      console.log(props);
        return {
            msg:"子组件"
        }
    }
}