import { SavedToggleListStatus, ToggleStatus, FeatureToggleManager } from './js-feature-toggle-manager';

QUnit.module('FeatureToggleManager tests', {
  beforeEach: () => {
    window.localStorage.clear();
    window.featureToggleStatuses = '';
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
  window.featureToggleStatuses = undefined;
  assert.notOk(FeatureToggleManager.hasFeature(undefined), 'Undefined feature toggle should not exist');
});

QUnit.test('should work with null', assert => {
  window.featureToggleStatuses = null;
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

abstract class ToggleSetter {
  protected toggles: ToggleStatus[] = [];

  public setToggle(toggleName: string, toggleStatus: boolean): void {
    this.toggles.push({
      Name: toggleName,
      Status: toggleStatus
    });
  }
}

class WindowToggleSetter extends ToggleSetter {
  public writeToWindowToggles(): void {
    window.featureToggleStatuses = JSON.stringify(this.toggles);
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
