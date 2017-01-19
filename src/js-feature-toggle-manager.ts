import { QueryStringReader } from './github/gtmsportswear/js-utilities@1.0.0/js-utilities';

export interface SavedToggleListStatus {
  LastModifiedISO: string;
  Toggles: ToggleStatus[];
}

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
    const features = this.getCombinedFeatureList();
    
    const featureMatch = features.find(toggle => toggle.Name === targetFeature);
    return undefined !== featureMatch && featureMatch.IsActive;
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
    const toggleList = window.featureToggleList;
    let list: any;

    if (!Array.isArray(toggleList)) {
      try {
        list = JSON.parse(toggleList);
        if (!Array.isArray(list)) throw new Error('Toggle list must be an array.');
      }
      catch (e) {
        list = [];
      }
    }
    else
      list = toggleList;

    return list;
  }

  private static getCombinedFeatureList(): ToggleStatus[] {
    const lsList = this.getFeatureListFromLocalStorage(),
          winList = this.getFeatureListFromWindow();

    return lsList.concat(
                    winList.filter(winToggle => {
                        return lsList.every(lsToggle => lsToggle.Name !== winToggle.Name);
                      })
                    );
  }

  constructor() {
    this.currentToggles = FeatureToggleManager.getCombinedFeatureList();
    window.showFeatures = this.showFeatureToggles.bind(this);
  }

  /**
   * Update feature toggles in local storage based on query string options.
   * @example for a querystring that contains the string 'featureoff=some_feature', the feature toggle some_feature will be deactivated.
   */
  public updateTogglesBasedOnQueryStringCommands(): void {
    const featureToToggleOn = QueryStringReader.findQueryString('featureon'),
          featureToToggleOff = QueryStringReader.findQueryString('featureoff'),
          updatedToggles = this.currentToggles.map(toggle => {
            if (null !== featureToToggleOff && featureToToggleOff.value.toLowerCase() === toggle.Name.toLowerCase()) {
              toggle.IsActive = false;
              return toggle;
            }
            else if (null !== featureToToggleOn && featureToToggleOn.value.toLowerCase() === toggle.Name.toLowerCase()) {
              toggle.IsActive = true;
              return toggle;
            }

            return toggle;
          });
    
    this.setLocalStorage(updatedToggles);
  }

  private setLocalStorage(toggles: ToggleStatus[]): void {
    const toggleStatus: SavedToggleListStatus = {
      LastModifiedISO: new Date().toISOString(),
      Toggles: toggles
    };

    window.localStorage.setItem('featureToggles', JSON.stringify(toggleStatus));
  }

  private showFeatureToggles(): string {
    return this.currentToggles.reduce((returnString, toggle) => {
      const activeIcon = toggle.IsActive ? '✓' : '';
      returnString += `${toggle.Name} (${activeIcon})\n`;
      return returnString;
    }, '\n');
  }
}
