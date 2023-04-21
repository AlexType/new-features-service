export abstract class NewFeaturesProvider {
  public abstract get newFeatures(): Promise<number>;
  private _subscriptions: (() => any)[] = [];

  public abstract markNewFeatureAsUsed(feature: number): Promise<void>;
  protected abstract stopListenPushes(): void;
  protected abstract startListenPushes(refreshFn: () => any): void;

  public subscribeOnChangeState(func: () => any): void {
    if (this._subscriptions.find(f => f === func)) return;
    this._subscriptions.push(func);
    if (this._subscriptions.length === 1) this.startListenPushes(this.publish);
  }

  public unsubscribeFromChangeState(func: () => any): void {
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