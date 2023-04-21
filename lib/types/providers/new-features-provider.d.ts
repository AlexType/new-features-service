export declare abstract class NewFeaturesProvider {
    private _subscriptions;
    abstract markNewFeatureAsUsed(feature: number): Promise<void>;
    protected abstract stopListenPushes(): void;
    protected abstract startListenPushes(refreshFn: () => void): void;
    abstract getNewFeatures(): Promise<number>;
    subscribeOnChangeState(func: () => void): void;
    unsubscribeFromChangeState(func: () => void): void;
    private publish;
}
