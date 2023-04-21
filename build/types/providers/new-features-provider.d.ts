export declare abstract class NewFeaturesProvider {
    abstract get newFeatures(): Promise<number>;
    private _subscriptions;
    abstract markNewFeatureAsUsed(feature: number): Promise<void>;
    protected abstract stopListenPushes(): void;
    protected abstract startListenPushes(refreshFn: () => void): void;
    subscribeOnChangeState(func: () => void): void;
    unsubscribeFromChangeState(func: () => void): void;
    private publish;
}
