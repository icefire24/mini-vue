export const App = {
    render() {
        return history('div','hi'+this.msg)
    },
    setup() {
        return {
            msg:"mini-vue"
        }
    }
}