export interface ToggleStatus {
  Name: string;
  IsActive: boolean;
}

export class FeatureToggleManager {  
  private currentToggles: ToggleStatus[];
  
  /**
   * Check to see if a feature is currently active.
   * @param feature The feature to check for. Do not include the feature_toggle_ prefix.
   * @example For a feature_toggle_team_ordering feature, use hasFeature('product_page_team_ordering')
   */
  public static hasFeature(targetFeature: string): boolean {
    const features = this.getFeatureListFromWindow();
    
    const featureMatch = features.find(toggle => toggle.Name === targetFeature);
    return undefined !== featureMatch && featureMatch.IsActive;
  }
 
  private static getFeatureListFromWindow(): ToggleStatus[] {
    const toggleList = window.sessionFeatureToggles;
    let list: any;

    try {
      list = JSON.parse(toggleList);
      if (!Array.isArray(list)) throw new Error('Toggle list must be an array.');
    }
    catch (e) {
      list = [];
    }

    return list;
  }

  constructor() {
    this.currentToggles = FeatureToggleManager.getFeatureListFromWindow();
    window.showFeatures = this.showFeatureToggles.bind(this);
  }

  private showFeatureToggles(): string {
    return this.currentToggles.reduce((returnString, toggle) => {
      const activeIcon = toggle.IsActive ? '✓' : '';
      returnString += `${toggle.Name} (${activeIcon})\n`;
      return returnString;
    }, '\n');
  }
}
