import { isReactive, isReadonly, reactive, readonly,isProxy } from "../reactive";
import { effect, stop } from "../effect";
describe("effect", () => {
  test("effect", () => {
    const user = reactive({
      age: 10,
    });
    let nextage;
    effect(() => {
      nextage = user.age + 1;
    });
    expect(nextage).toBe(11);
    user.age = 20;
    expect(nextage).toBe(21);
  });
  test("", () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "foo";
    });
    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("foo");
  });

  test("stop", () => {
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
    expect(dummy).toBe(2);

    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);
  });
    test("events: onStop", () => {
      const onStop = jest.fn();
      const runner = effect(() => {}, {
        onStop,
      });

      stop(runner);
      expect(onStop).toHaveBeenCalled();
    });
  
    test("readonly", () => {
      const original = { foo: 1, bar: { baz: 2 } };
      const origina2 = { foo: 1, bar: { baz: 2 } };
      const wrapped = reactive(original);
      expect(wrapped).not.toBe(original);
    //   expect(isProxy(wrapped)).toBe(true);
      expect(isReadonly(wrapped)).toBe(false);
      expect(isReactive(original)).toBe(false);
      expect(isReadonly(original)).toBe(false);
      expect(isProxy(wrapped)).toBe(true);
      expect(isReactive(wrapped.bar)).toBe(true);
      // expect(isReadonly(wrapped.bar)).toBe(true);
      expect(isReactive(original.bar)).toBe(false);
      expect(isReadonly(original.bar)).toBe(false);
      // get
      expect(wrapped.foo).toBe(1);
    });
});
