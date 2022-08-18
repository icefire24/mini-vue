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
})