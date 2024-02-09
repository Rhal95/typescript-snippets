# TypeScript Snippets

A small collection of utilities written in TypeScript.

## Builder

Helper function to build a given generic type `T`.

### Usage

Create the builder bby calling the builder function with the generic type. Then
assemble the object by calling `.set(/*name of the property*/)` followed by
`.to(/*insert value*/)`. Do this until you used all properties. The TypeScript
compiler will guide you. After you used up all properties of the passed type, a
new property `.get` will be available in the builder. Use it to extract the
final object.

```typescript
import { builder } from "./builder.ts";

interface MyInterface {
  foo: string;
  bar: number;
}

const result: MyInterface = builder<MyInterface>()
  .set("foo").to("abc")
  .set("bar").to(132)
  .get;
```
