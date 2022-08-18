import { reactive } from "./reactive";
import { effect,stop } from "./effect";
let dummy;
const obj = reactive({ prop: 1 });
const runner = effect(() => {
  dummy = obj.prop;
});
obj.prop = 2;
expect(dummy).toBe(2);
stop(runner);
// obj.prop = 3
obj.prop++;
// expect(dummy).toBe(2);
console.log(dummy);

// stopped effect should still be manually callable
// runner();
// expect(dummy).toBe(3);
