import { MemCache } from "./memCache.ts";
import { assertSpyCalls, stub } from "https://deno.land/std/testing/mock.ts";
import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { FakeDate } from "./fakeDate.ts";
import { assertRejects } from "https://deno.land/std/assert/assert_rejects.ts";

Deno.test("Memory Cache", async () => {
  using fakeDate = new FakeDate();
  const self = { cb: () => Promise.reject<string>() };
  const cb = stub(self, "cb", () => Promise.resolve("auto value"));
  const sut = new MemCache(1000, self.cb);
  assertSpyCalls(cb, 0);
  sut.put("initial value");
  assertEquals(await sut.get(), "initial value");
  assertSpyCalls(cb, 0);
  fakeDate.tick(500);
  assertEquals(await sut.get(), "initial value");
  assertSpyCalls(cb, 0);
  fakeDate.tick(500);
  assertEquals(await sut.get(), "auto value");
  assertSpyCalls(cb, 1);
  fakeDate.tick(500);
  sut.put("custom load");
  assertEquals(await sut.get(), "custom load");
  assertSpyCalls(cb, 1);
  fakeDate.tick(500);
  assertEquals(await sut.get(), "custom load");
  assertSpyCalls(cb, 1);
  fakeDate.tick(500);
  assertEquals(await sut.get(), "auto value");
  assertSpyCalls(cb, 2);
});

Deno.test("no load function", async () => {
  const sut = new MemCache(1000, undefined);
  await assertRejects(async () => await sut.get());
});
