import { h } from "../../../lib/guide-mini-vue.esm"

export const App = {
    render() {
        return h('div','hi'+this.msg)
    },
    setup() {
        return {
            msg:"mini-vue"
        }
    }
}