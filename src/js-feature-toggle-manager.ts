import { QueryStringReader } from './github/gtmsportswear/js-utilities@1.0.0/js-utilities';

export class FeatureToggleManager {
  private static queryStringFeatureTogglesKey = 'features';

  /**
   * Check to see if a feature is currently active.
   * @param feature The feature to check for. Do not include the feature_toggle_ prefix.
   * @example For a feature_toggle_team_ordering feature, use hasFeature('product_page_team_ordering')
   */
  public static hasFeature(feature: string): boolean {
    let found = false;

    this.getFeatureListFromWindow().forEach(f => {
      if (f === feature)
        found = true;
    });

    if (found)
      return true;

    this.getFeatureListFromQueryString().forEach(f => {
      if (f === feature)
        found = true;
    });

    return found;
  }
  
  private static getFeatureListFromWindow(): string[] {
    const windowFeatureToggles = window.featureToggles;
    let list = [];

    if (!Array.isArray(windowFeatureToggles)) {
      try {
        list = JSON.parse(windowFeatureToggles);
        if (!Array.isArray(list)) list = [];
      }
      catch (e) {
        // allowable control path, will default out to an empty array
      }
    }

    return this.removeFeatureTogglePrefixFromList(list);
  }

  private static removeFeatureTogglePrefixFromList(list: string[]): string[] {
    const newList = [];

    list.forEach(f => {
      const ix = f.indexOf('feature_toggle_');
      if (ix === 0)
        newList.push(f.substr(15));
      else
        newList.push(f);
    });

    return newList;
  }

  private static getFeatureListFromQueryString(): string[] {
    const qs = QueryStringReader.findQueryString(this.queryStringFeatureTogglesKey);
    if (qs === null) return [];

    return qs.value.split(',');
  }
}
