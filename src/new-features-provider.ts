export interface NewFeaturesProvider {
  getNewFeatures(): Promise<number>;
  markNewFeatureAsUsed(feature: number): Promise<void>;
  startListenPushes(refreshFn: () => void): void;
  stopListenPushes(): void;
}
