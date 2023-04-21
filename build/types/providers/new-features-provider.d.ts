export declare abstract class NewFeaturesProvider {
    abstract get newFeatures(): Promise<number>;
    private _subscriptions;
    abstract markNewFeatureAsUsed(feature: number): Promise<void>;
    protected abstract stopListenPushes(): void;
    protected abstract startListenPushes(refreshFn: () => any): void;
    subscribeOnChangeState(func: () => any): void;
    unsubscribeFromChangeState(func: () => any): void;
    private publish;
}
