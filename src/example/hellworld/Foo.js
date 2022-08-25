import { getCurrenInstance, h, inject } from "../../../lib/esm.js";

export const Foo = {
    render() {
        return h(
          "div",
          {
            id: "root",
            class: ["red", "hard"],
            onClick() {
              
            }
          },
          'hello'
        );
    },
  setup(props, { emit }) {
    let instance = getCurrenInstance()
    console.log(instance);
    let res = inject('test')
    let res2=inject('test2')
    
    console.log(res, res2,"res");
    
      
        return {
            msg:"子组件"
        }
    }
}