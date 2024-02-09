import { builder } from "./builder.ts";
import { expect } from "https://deno.land/std/expect/mod.ts";

Deno.test("build empty object", () => {
  const result = builder().get;
  expect(result).toBeDefined();
});

Deno.test("build type", () => {
  interface MyInterface {
    foo: string;
    bar: number;
  }

  const result = builder<MyInterface>()
    .set("foo").to("abc")
    .set("bar").to(123)
    .get;
  expect(result).toBeDefined();
  expect(result.foo).toStrictEqual("abc");
  expect(result.bar).toStrictEqual(123);
});

Deno.test("build partial type", () => {
  interface MyInterface {
    foo: string;
    bar: number;
  }

  const partialBuilder = builder<MyInterface>()
    .set("foo").to("abc");
  expect(partialBuilder).toBeDefined();
  expect(partialBuilder).toHaveProperty("get", { foo: "abc" });
});
