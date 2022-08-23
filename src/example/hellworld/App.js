import { h } from "../../../lib/esm.js"

export const App = {
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
          this.msg
        );
    },
    setup() {
        return {
            msg:"mini-vue"
        }
    }
}