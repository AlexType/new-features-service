export class CompatibilityService {
  private _groups: number[];

  constructor(groups: number[]) {
    this._groups = groups;
  }

  public compatible(feature: number, visibleFeatures: number): number {
    if (!feature) return feature;

    for (let i = 0; i < this._groups.length; i++) {
      const gr = this._groups[i];
      if (!visibleFeatures || gr & visibleFeatures) {
        const compatibleFeatures = feature & gr;
        if (compatibleFeatures) return compatibleFeatures;
      }
    }

    return 0;
  }
}
