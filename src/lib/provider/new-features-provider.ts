export abstract class NewFeaturesProvider {
  private readonly _pushSubscriptions: (() => void)[] = [];

  abstract getNewFeatures(): Promise<number>;
  abstract markNewFeatureAsUsed(feature: number): Promise<void>;
  abstract startListenPushes(refreshFn: () => void): void;
  abstract stopListenPushes(): void;

  public subscribeListener(fn: () => void): void {
    if (this._pushSubscriptions.find(f => f === fn)) return;
    this._pushSubscriptions.push(fn);
    if (this._pushSubscriptions.length === 1) this.startListenPushes(this.update.bind(this));
  }

  public unsubscribeListener(fn: () => void): void {
    const index = this._pushSubscriptions.indexOf(fn);
    if (index === -1) return;

    this._pushSubscriptions.splice(index, 1);
    if (!this._pushSubscriptions.length) this.stopListenPushes();
  }

  private update(): void {
    this._pushSubscriptions.forEach(fn => fn());
  }
}
