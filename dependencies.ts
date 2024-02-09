export class DI {
  private beans = new Map<string, unknown>();

  register(identifier: string, bean: unknown) {
    if (this.beans.has(identifier)) {
      throw new Error(
        `Can not register two beans with the same name: ${identifier}`,
      );
    }
    this.beans.set(identifier, bean);
  }

  get<T>(identifier: string): T {
    if (this.beans.has(identifier)) {
      return <T> this.beans.get(identifier);
    } else throw new Error(`No bean of type ${identifier} registered`);
  }

  _listBeans() {
    return Array.from(this.beans.keys());
  }
}

export function defineUse<T>(prefix: string) {
  return function <K extends keyof T & string>(field: K): T[K] {
    return di.get<T[K]>(prefix !== undefined ? `${prefix}-${field}` : field);
  };
}

type RemainingKeysToSet<KEY extends keyof TARGET, TARGET, CURRENT> = KEY extends
  keyof CURRENT ? KEY : never;

function _defineDep<T, C>(prefix: string) {
  function set<K extends RemainingKeysToSet<keyof T, T, C> & string>(
    key: K,
  ) {
    function to<V extends T[K]>(value: V) {
      di.register(prefix !== undefined ? `${prefix}-${key}` : key, value);
      return _defineDep<T, Omit<C, K>>(prefix);
    }
    return {
      to,
    };
  }
  return {
    set,
    end: () => {},
  } as unknown as RemainingKeysToSet<keyof T, T, C> extends never
    ? { end(): void }
    : { set: typeof set };
}

export function defineDep<T>(prefix: string) {
  return _defineDep<T, T>(prefix);
}

export const di = new DI();