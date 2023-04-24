import { NewFeaturesProvider } from './new-features-provider';
import { CompatibilityService } from './compatibility-service';

export class NewFeaturesService {
  public get shownNewFeatures(): number {
    return this._shownNewFeatures;
  }

  private _shownNewFeatures = 0;
  private _promise$: Promise<number> | undefined;
  private _compatibilityService: CompatibilityService;

  private readonly _subscriptions: (() => void)[] = [];
  private readonly _pushSubscriptions: (() => void)[] = [];

  private get _newFeatures$(): Promise<number> {
    if (!this._promise$) this._promise$ = this._provider.getNewFeatures();
    return this._promise$;
  }

  constructor(private readonly _provider: NewFeaturesProvider, compatibilityGroups: number[]) {
    this._compatibilityService = new CompatibilityService(compatibilityGroups);
  }

  public async availableFeatures(feature: number): Promise<number> {
    const curNewFeatures = (await this._newFeatures$) & feature;
    return curNewFeatures & this._compatibilityService.compatible(curNewFeatures, this._shownNewFeatures);
  }

  public async showAvailableFeatures(feature: number): Promise<number> {
    const newFeatures = await this.availableFeatures(feature);
    if (newFeatures) this._shownNewFeatures |= newFeatures;
    return newFeatures;
  }

  public async isNewFeature(feature: number): Promise<boolean> {
    const newFeatures = await this.availableFeatures(feature);
    return (newFeatures & feature) === feature;
  }

  public async markNewFeatureAsUsed(feature: number): Promise<boolean> {
    const isNew = await this.isNewFeature(feature);
    if (isNew) this._provider.markNewFeatureAsUsed(feature);
    return isNew;
  }

  public hide(feature: number): void {
    this._shownNewFeatures &= ~feature;
  }

  public subscribeOnChangeState(fn: () => void): void {
    if (this._subscriptions.find(f => f === fn)) return;
    this._subscriptions.push(fn);
    if (this._subscriptions.length === 1) this.subscribeListener(this.refreshNewFeatures);
  }

  public unsubscribeFromChangeState(fn: () => void): void {
    const index = this._subscriptions.indexOf(fn);
    if (index === -1) return;

    this._subscriptions.splice(index, 1);
    if (!this._subscriptions.length) this.unsubscribeListener(this.refreshNewFeatures);
  }

  private refreshNewFeatures = (): void => {
    this._promise$ = this._provider.getNewFeatures();
    this._newFeatures$.then(() => { this._subscriptions.forEach(fn => fn()); });
  };

  private subscribeListener(fn: () => void): void {
    if (this._pushSubscriptions.find(f => f === fn)) return;
    this._pushSubscriptions.push(fn);
    if (this._pushSubscriptions.length === 1) this._provider.startListenPushes(this.update.bind(this));
  }

  private unsubscribeListener(fn: () => void): void {
    const index = this._pushSubscriptions.indexOf(fn);
    if (index === -1) return;

    this._pushSubscriptions.splice(index, 1);
    if (!this._pushSubscriptions.length) this._provider.stopListenPushes();
  }

  private update(): void {
    this._pushSubscriptions.forEach(fn => fn());
  }
}
