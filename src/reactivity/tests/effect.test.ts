import { isReactive, isReadonly, reactive, readonly } from "../reactive";
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
  it("stop", () => {
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
    it("events: onStop", () => {
      const onStop = jest.fn();
      const runner = effect(() => {}, {
        onStop,
      });

      stop(runner);
      expect(onStop).toHaveBeenCalled();
    });
    it("should make nested values readonly", () => {
      const original = { foo: 1, bar: { baz: 2 } };
      const origina2 = { foo: 1, bar: { baz: 2 } };
      const wrapped = readonly(original);
      expect(wrapped).not.toBe(original);
    //   expect(isProxy(wrapped)).toBe(true);
      expect(isReadonly(wrapped)).toBe(true);
      expect(isReactive(original)).toBe(false);
      expect(isReadonly(original)).toBe(false);
      expect(isReactive(wrapped.bar)).toBe(false);
    //   expect(isReadonly(wrapped.bar)).toBe(true);
    //   expect(isReactive(original.bar)).toBe(false);
    //   expect(isReadonly(original.bar)).toBe(false);
      // get
      expect(wrapped.foo).toBe(1);
    });
});
