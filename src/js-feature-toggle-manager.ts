import { QueryStringReader } from './github/gtmsportswear/js-utilities@1.0.0/js-utilities';

export interface SavedToggleListStatus {
  LastModifiedISO: string;
  Toggles: ToggleStatus[];
}

export interface ToggleStatus {
  Name: string;
  Status: boolean;
}

export class FeatureToggleManager {
  /**
   * Check to see if a feature is currently active.
   * @param feature The feature to check for. Do not include the feature_toggle_ prefix.
   * @example For a feature_toggle_team_ordering feature, use hasFeature('product_page_team_ordering')
   */
  public static hasFeature(feature: string): boolean {
    const features = this.combineFeatureLists(
      this.getFeatureListFromLocalStorage(),
      this.getFeatureListFromWindow()
    );
    
    const featureMatch = features.find(toggle => toggle.Name === feature);
    return undefined !== featureMatch && featureMatch.Status;
  }

  private static getFeatureListFromLocalStorage(): ToggleStatus[] {
    try {
      const storedToggles = <SavedToggleListStatus>JSON.parse(window.localStorage.getItem('featureToggles'));
      return storedToggles.Toggles;
    }
    catch (e) {
      return [];
    }
  }
  
  private static getFeatureListFromWindow(): ToggleStatus[] {
    const windowFeatureToggles = window.featureToggleStatuses;
    let list: any;

    if (!Array.isArray(windowFeatureToggles)) {
      try {
        list = JSON.parse(windowFeatureToggles);
        if (!Array.isArray(list)) throw new Error('List not an array.');
      }
      catch (e) {
        list = [];
      }
    }
    else
      list = windowFeatureToggles;

    return list;
  }

  private static combineFeatureLists(lsList: ToggleStatus[], winList: ToggleStatus[]): ToggleStatus[] {
    return lsList.concat(
                  winList.filter(winToggle => {
                      return lsList.every(lsToggle => lsToggle.Name !== winToggle.Name);
                    })
                  );
  }
}
