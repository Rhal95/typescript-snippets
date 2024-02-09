import { defineDep, defineUse } from "./dependencies.ts";
import { expect } from "https://deno.land/std/expect/mod.ts";

type Dep = {
  foo: string;
  bar: number;
};
Deno.test("defineUse", () => {
  const use = defineUse<Dep>("test");
  expect(() => use("foo")).toThrow();
  expect(() => use("bar")).toThrow();
  const builderAfterSettingFoo = defineDep<Dep>("test")
    .set("foo").to("my answer");
  expect(use("foo")).toEqual("my answer");
  expect(() => use("bar")).toThrow();
  const builderFullySet = builderAfterSettingFoo.set("bar").to(42);
  expect(use("foo")).toEqual("my answer");
  expect(use("bar")).toEqual(42);
  builderFullySet.end();
});
