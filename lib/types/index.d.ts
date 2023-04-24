import { NewFeaturesProvider } from './providers/new-features-provider';
export declare class NewFeaturesService {
    private readonly _provider;
    get shownNewFeatures(): number;
    private _shownNewFeatures;
    private _promise$;
    private _compatibilityService;
    private readonly _subscriptions;
    private get _newFeatures$();
    constructor(_provider: NewFeaturesProvider, compatibilityGroups: number[]);
    availableFeatures(feature: number): Promise<number>;
    showAvailableFeatures(feature: number): Promise<number>;
    isNewFeature(feature: number): Promise<boolean>;
    markNewFeatureAsUsed(feature: number): Promise<boolean>;
    hide(feature: number): void;
    subscribeOnChangeState(fn: () => void): void;
    unsubscribeFromChangeState(fn: () => void): void;
    private refreshNewFeatures;
}
