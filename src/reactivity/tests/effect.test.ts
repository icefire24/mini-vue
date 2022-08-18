import {reactive} from '../reactive'
import {  effect } from '../effect'
describe('effect',() => {

    test("effect", () => {
        const user = reactive({
            age:10
        })
        let nextage
        effect(() => {
        nextage=user.age+1
        })
        expect(nextage).toBe(11)
        user.age = 20
        expect(nextage).toBe(21)
    })
    test("", () => {
        let foo = 10
        const runner=effect(() => {
            foo++
            return "foo"
        })
        expect(foo).toBe(11)
        const r = runner()
        expect(foo).toBe(12)
        expect(r).toBe("foo")
    })
})