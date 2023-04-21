export abstract class NewFeaturesProvider {
  private _subscriptions: (() => void)[] = [];

  public abstract markNewFeatureAsUsed(feature: number): Promise<void>;
  protected abstract stopListenPushes(): void;
  protected abstract startListenPushes(refreshFn: () => void): void;

  public abstract getNewFeatures(): Promise<number>;

  public subscribeOnChangeState(func: () => void): void {
    if (this._subscriptions.find(f => f === func)) return;
    this._subscriptions.push(func);
    if (this._subscriptions.length === 1) this.startListenPushes(this.publish);
  }

  public unsubscribeFromChangeState(func: () => void): void {
    const index = this._subscriptions.indexOf(func);
    if (index !== -1) {
      this._subscriptions.splice(index, 1);
      if (!this._subscriptions.length) this.stopListenPushes();
    }
  }

  private publish(): void {
    this._subscriptions.forEach(fn => fn());
  }
}
