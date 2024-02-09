export class FakeDate implements Disposable {
  private readonly originalNowFunction: () => number;
  private currentNow: number;

  constructor() {
    this.currentNow = Date.now();
    this.originalNowFunction = Date.now;
    Date.now = this.fakeNow.bind(this);
  }

  [Symbol.dispose](): void {
    Date.now = this.originalNowFunction;
  }

  private fakeNow(): number {
    return this.currentNow;
  }

  public tick(ms: number) {
    this.currentNow += ms;
  }
}
