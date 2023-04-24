export declare abstract class NewFeaturesProvider {
    private _subscriptions;
    abstract getNewFeatures(): Promise<number>;
    abstract markNewFeatureAsUsed(feature: number): Promise<void>;
    protected abstract startListenPushes(refreshFn: () => void): void;
    protected abstract stopListenPushes(): void;
    subscribeOnChangeState(func: () => void): void;
    unsubscribeFromChangeState(func: () => void): void;
    private publish;
}
