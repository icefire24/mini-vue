import { h, createTextVnode, provide, inject } from "../../../lib/esm.js";
import { Foo } from "./Foo.js";
const Head = {
  render() {
    return h(
      'div',
        {},
      [h(Foo)]
    )
  },
  setup() {
    provide("test2", 'no')
    let res=inject('test2')
    console.log(res);
   return {num:2}
 }
}
export const App = {
    render() {
        return h(
          "div",
          {
            id: "root",
            class: ["red", "hard"],
            onClick() {},
          },
          [h(Head, {
            onAdd(a, b) {},
          })]
        );
    },
  setup() {
       provide('test','nihao')
       provide("test2", "hello");
        return {
            msg:"mini-vue"
        }
    }
}