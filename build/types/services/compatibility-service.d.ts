export declare class CompatibilityService {
    private _groups;
    constructor(groups: number[]);
    compatible(feature: number, visibleFeatures: number): number;
}
