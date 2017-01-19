import { SavedToggleListStatus, ToggleStatus, FeatureToggleManager } from './js-feature-toggle-manager';

QUnit.module('FeatureToggleManager tests', {
  beforeEach: () => {
    window.localStorage.clear();
    window.featureToggleList = '';
  },
  afterEach: () => {
    history.pushState('', 'Reset querystring', `${window.location.pathname}`);
  }
});

QUnit.test('can check for features enabled', assert => {
  const toggleSetter = new WindowToggleSetter();
  toggleSetter.setToggle('feature_that_does_exist', true);
  toggleSetter.setToggle('feature_that_is_toggled_off', false);
  toggleSetter.writeToWindowToggles();
  assert.ok(FeatureToggleManager.hasFeature('feature_that_does_exist'));
  assert.notOk(FeatureToggleManager.hasFeature('feature_that_is_toggled_off'));
  assert.notOk(FeatureToggleManager.hasFeature('feature_that_does_not_exist'));
});

QUnit.test('should work with undefined', assert => {
  window.featureToggleList = undefined;
  assert.notOk(FeatureToggleManager.hasFeature(undefined), 'Undefined feature toggle should not exist');
});

QUnit.test('should work with null', assert => {
  window.featureToggleList = null;
  assert.notOk(FeatureToggleManager.hasFeature(null), 'NULL feature toggle should not exist');
});

QUnit.test('should stringify JSON empty array should work', assert => {
  const toggleSetter = new WindowToggleSetter();
  toggleSetter.writeToWindowToggles();
  assert.notOk(FeatureToggleManager.hasFeature('a'), 'a feature toggle should not exist');
});

QUnit.test('should find feature toggle', assert => {
  const toggleSetter = new WindowToggleSetter();
  toggleSetter.setToggle('catalog_notification', true);
  toggleSetter.writeToWindowToggles();
  assert.ok(FeatureToggleManager.hasFeature('catalog_notification'), 'catalog_notification exists');
});

QUnit.test('Can get feature toggles from local storage.', assert => {
  const toggleSetter = new LocalStorageSetter();
  toggleSetter.setToggle('feature_toggle_A', true);
  toggleSetter.setLocalStorage();
  
  assert.ok(FeatureToggleManager.hasFeature('feature_toggle_A'));
});

QUnit.test('Local storage setting should take precedence over window feature toggles setting.', assert => {
  const windowSetter = new WindowToggleSetter();
  windowSetter.setToggle('feature_toggle_xyz', false);
  windowSetter.writeToWindowToggles();

  const localStorageSetter = new LocalStorageSetter();
  localStorageSetter.setToggle('feature_toggle_xyz', true);
  localStorageSetter.setLocalStorage();

  assert.ok(FeatureToggleManager.hasFeature('feature_toggle_xyz'));

  windowSetter.setToggle('feature_toggle_xyz', true);
  windowSetter.writeToWindowToggles();

  localStorageSetter.setToggle('feature_toggle_xyz', false);
  localStorageSetter.setLocalStorage();

  assert.notOk(FeatureToggleManager.hasFeature('feature_toggle_xyz'));
});

QUnit.test('Should deactivate feature if querystring contains the command featureoff=[featureName].', assert => {
  const localStorageSetter = new LocalStorageSetter();
  localStorageSetter.setToggle('feature_xyz', true);
  localStorageSetter.setLocalStorage();
  
  history.pushState('', 'Add feature command to query string', `${window.location.pathname}?featureoff=feature_xyz`);
  const ftm = new FeatureToggleManager();
  ftm.updateTogglesBasedOnQueryStringCommands();

  assert.notOk(FeatureToggleManager.hasFeature('feature_xyz'));
});

QUnit.test('Should activate feature if querystring contains the command featureon=[featureName].', assert => {
  const localStorageSetter = new LocalStorageSetter();
  localStorageSetter.setToggle('feature_xyz', false);
  localStorageSetter.setLocalStorage();
  
  history.pushState('', 'Add feature command to query string', `${window.location.pathname}?featureon=feature_xyz`);
  const ftm = new FeatureToggleManager();
  ftm.updateTogglesBasedOnQueryStringCommands();

  assert.ok(FeatureToggleManager.hasFeature('feature_xyz'));
});

QUnit.test('Should return a string with current feature toggles and checkmark demarkation for thos which are active.', assert => {
  const windowSetter = new WindowToggleSetter();
  windowSetter.setToggle('feature_toggle_x', false);
  windowSetter.writeToWindowToggles();

  const localStorageSetter = new LocalStorageSetter();
  localStorageSetter.setToggle('feature_toggle_y', true);
  localStorageSetter.setToggle('feature_toggle_z', false);
  localStorageSetter.setLocalStorage();

  new FeatureToggleManager();

  const featureStrings = window.showFeatures().split('\n');
  assert.equal(featureStrings[1], 'feature_toggle_y (✓)');
  assert.equal(featureStrings[2], 'feature_toggle_z ()');
  assert.equal(featureStrings[3], 'feature_toggle_x ()');
});

abstract class ToggleSetter {
  protected toggles: ToggleStatus[] = [];

  public setToggle(toggleName: string, toggleStatus: boolean): void {
    this.toggles.push({
      Name: toggleName,
      IsActive: toggleStatus
    });
  }
}

class WindowToggleSetter extends ToggleSetter {
  public writeToWindowToggles(): void {
    window.featureToggleList = JSON.stringify(this.toggles);
  }
}

class LocalStorageSetter extends ToggleSetter {
  private toggleStatus: SavedToggleListStatus;

  constructor() {
    super ();
    this.toggleStatus = {
      LastModifiedISO: new Date().toISOString(),
      Toggles: []
    };
  }

  public setLocalStorage(): void {
    this.toggleStatus.Toggles = this.toggles;
    window.localStorage.setItem('featureToggles', JSON.stringify(this.toggleStatus));
    this.toggles = [];
  }
}
