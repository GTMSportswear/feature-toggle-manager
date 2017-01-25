import { QueryStringReader } from './github/gtmsportswear/js-utilities@1.0.0/js-utilities';

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

  constructor(private setFeatureToggle: (toggleName: string, toggleSetting: boolean) => Promise<boolean>) {
    this.currentToggles = FeatureToggleManager.getFeatureListFromWindow();
    window.showFeatures = this.showFeatureToggles.bind(this);
  }

  /**
   * Update window feature toggles with activated toggle as well as calling a callback with the updated toggle.
   * @example for a querystring that contains the string 'featureoff=some_feature', the feature toggle some_feature will be deactivated.
   */
  public activateTogglesBasedOnQueryStringCommands(): Promise<boolean> {
    const featureToToggleOn = QueryStringReader.findQueryString('featureon');
    
    return new Promise((success, error) => {
      if (null !== featureToToggleOn && featureToToggleOn.value !== '')
        this.activateFeatureToggle(featureToToggleOn.value)
          .then((updatedToggle) => {
            this.updateFeatureToggles(updatedToggle);
            success();
          });
      else
        success();
    });
}

  /**
   * Update window feature toggles with deactivated toggle as well as calling a callback with the updated toggle.
   * @example for a querystring that contains the string 'featureoff=some_feature', the feature toggle some_feature will be deactivated.
   */
  public deactivateTogglesBasedOnQueryStringCommands(): Promise<boolean> {
    const featureToToggleOff = QueryStringReader.findQueryString('featureoff');
    
    return new Promise((success, error) => {
      if (null !== featureToToggleOff && featureToToggleOff.value !== '')
        this.deactivateFeatureToggle(featureToToggleOff.value)
          .then((updatedToggle) => {
            this.updateFeatureToggles(updatedToggle);
            success();
          });
      else
        success();
    });
}

private activateFeatureToggle(toggleName: string): Promise<ToggleStatus> {
    return new Promise((success, error) => {
      this.setFeatureToggle(toggleName, true)
        .then(() => success({Name: toggleName, IsActive: true}));
    });
  }

  private deactivateFeatureToggle(toggleName: string): Promise<ToggleStatus> {
    return new Promise((success, error) => {
      this.setFeatureToggle(toggleName, false)
        .then(() => success({Name: toggleName, IsActive: false}));
    });
  }

  private updateFeatureToggles(newToggleStatus: ToggleStatus): void {
    this.currentToggles = this.currentToggles.map(toggle => {
      if (toggle.Name === newToggleStatus.Name)
        return newToggleStatus;
      return toggle;
    });

    this.updateWindowToggles(this.currentToggles);
  }

  private updateWindowToggles(toggles: ToggleStatus[]): void {
    window.sessionFeatureToggles = JSON.stringify(toggles);
  }

  private showFeatureToggles(): string {
    return this.currentToggles.reduce((returnString, toggle) => {
      const activeIcon = toggle.IsActive ? '✓' : '';
      returnString += `${toggle.Name} (${activeIcon})\n`;
      return returnString;
    }, '\n');
  }
}
