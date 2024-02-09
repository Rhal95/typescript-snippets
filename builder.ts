type RemainingKeysToSet<KEY extends keyof TARGET, TARGET, CURRENT> = KEY extends
  keyof CURRENT ? KEY : never;

function _builder<TARGET, CURRENT>(
  obj: Partial<TARGET>,
): RemainingKeysToSet<keyof TARGET, TARGET, CURRENT> extends never
  ? { get: TARGET }
  : { set: typeof set } {
  const set = <KEY extends RemainingKeysToSet<keyof TARGET, TARGET, CURRENT>>(
    key: KEY,
  ) => {
    const to = <VALUE extends TARGET[KEY]>(value: VALUE) => {
      return _builder<TARGET, Omit<CURRENT, KEY>>({ ...obj, [key]: value });
    };
    return { to };
  };
  return {
    set,
    get: obj,
  } as unknown as RemainingKeysToSet<keyof TARGET, TARGET, CURRENT> extends
    never ? { get: TARGET } : { set: typeof set };
}

export function builder<T>() {
  return {
    ...(_builder<T, T>({})),
    from: <C extends Partial<T>>(initial: C) =>
      _builder<T, Omit<T, keyof C>>(initial),
  };
}
