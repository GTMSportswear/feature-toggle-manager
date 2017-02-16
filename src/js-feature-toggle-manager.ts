import { IDisplayPanelFactory } from './js-display-panel';

export interface ToggleStatus {
  Name: string;
  IsActive: boolean;
}

export class FeatureToggleManager {  
  private static _instance: FeatureToggleManager;
  private _toggles: ToggleStatus[];
  
  /**
   * Check to see if a feature is currently active.
   * @param feature The feature to check for. Do not include the feature_toggle_ prefix.
   * @example For a feature_toggle_team_ordering feature, use hasFeature('product_page_team_ordering')
   */
  public static hasFeature(targetFeature: string): boolean {
    const features = this.getFeatureListFromWindow(),
          featureMatch = features.find(toggle => toggle.Name === targetFeature);
          
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

  /**
   * Provides a getter method for Feature Toggle Manager singleton object.
   */
  static get instance(): FeatureToggleManager {
    if (undefined === this._instance) {
      this._instance = new FeatureToggleManager();
      return this._instance;
    }

    return this._instance;
  }

  /**
   * Getter for available feature toggles.
   */
  public get toggles(): ToggleStatus[] {
    return this._toggles;
  }

  /**
   * Creates a display panel that contains information and controls related to current feature toggles.
   */
  public createDisplayPanel(displayPanelFactory: IDisplayPanelFactory): Element {
    const panel = displayPanelFactory.createDisplayPanel();
    
    return panel.draw();
  }

  private constructor() {
    this._toggles = FeatureToggleManager.getFeatureListFromWindow();
    window.showFeatures = this.showFeatureToggles.bind(this);
  }

  private showFeatureToggles(): string {
    return this._toggles.reduce((returnString, toggle) => {
      const activeIcon = toggle.IsActive ? '✓' : '';
      returnString += `${toggle.Name} (${activeIcon})\n`;
      return returnString;
    }, '\n');
  }
}
