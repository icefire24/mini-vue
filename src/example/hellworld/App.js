import { h } from "../../../lib/esm.js"

export const App = {
    render() {
        return h(
          "div",
          {
            id: "root",
            class: ["red", "hard"],
          },
          [
            h("div", { class: ["red"] }, "nihao"),
            h("div", { class: ["blue"] }, "hello"),
          ]
        );
    },
    setup() {
        return {
            msg:"mini-vue"
        }
    }
}