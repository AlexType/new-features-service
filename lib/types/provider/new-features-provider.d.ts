export declare abstract class NewFeaturesProvider {
    private readonly _pushSubscriptions;
    abstract getNewFeatures(): Promise<number>;
    abstract markNewFeatureAsUsed(feature: number): Promise<void>;
    abstract startListenPushes(refreshFn: () => void): void;
    abstract stopListenPushes(): void;
    subscribeListener(fn: () => void): void;
    unsubscribeListener(fn: () => void): void;
    private update;
}
