import { h, createTextVnode } from "../../../lib/esm.js";
import { Foo } from "./Foo.js";

export const App = {
    render() {
        return h(
          "div",
          {
            id: "root",
            class: ["red", "hard"],
            onClick() {
              console.log("111");
            },
          },
          [
            h(Foo, {
              onAdd(a, b) {
                console.log(a, b);
              },
            }),
            createTextVnode('text'),
          ]
        );
    },
  setup() {
      
        return {
            msg:"mini-vue"
        }
    }
}