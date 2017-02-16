import { IDisplayPanelFactory, DisplayPanel } from './js-display-panel';
import { ToggleStatus, FeatureToggleManager } from './js-feature-toggle-manager';

QUnit.module('FeatureToggleManager tests', {
  beforeEach: () => {
    window.localStorage.clear();
    window.sessionFeatureToggles = '';
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
  assert.ok(FeatureToggleManager.HasFeature('feature_that_does_exist'));
  assert.notOk(FeatureToggleManager.HasFeature('feature_that_is_toggled_off'));
  assert.notOk(FeatureToggleManager.HasFeature('feature_that_does_not_exist'));
});

QUnit.test('Should work with undefined', assert => {
  window.sessionFeatureToggles = undefined;
  assert.notOk(FeatureToggleManager.HasFeature(undefined), 'Undefined feature toggle should not exist');
});

QUnit.test('Should work with null', assert => {
  window.sessionFeatureToggles = null;
  assert.notOk(FeatureToggleManager.HasFeature(null), 'NULL feature toggle should not exist');
});

QUnit.test('Should not error out on an empty set of feature toggles.', assert => {
  const toggleSetter = new WindowToggleSetter();
  toggleSetter.writeToWindowToggles();
  assert.notOk(FeatureToggleManager.HasFeature('a'), 'a feature toggle should not exist');
});

QUnit.test('Should find feature toggle', assert => {
  const toggleSetter = new WindowToggleSetter();
  toggleSetter.setToggle('catalog_notification', true);
  toggleSetter.writeToWindowToggles();
  assert.ok(FeatureToggleManager.HasFeature('catalog_notification'), 'catalog_notification exists');
});

QUnit.test('Should return a string with current feature toggles and checkmark demarkation for those which are active.', assert => {
  const windowSetter = new WindowToggleSetter();
  windowSetter.setToggle('feature_toggle_x', false);
  windowSetter.setToggle('feature_toggle_y', true);
  windowSetter.setToggle('feature_toggle_z', false);
  windowSetter.writeToWindowToggles();

  const manager = FeatureToggleManager.Instance;
  assert.ok(manager);

  const featureStrings = window.showFeatures().split('\n');
  assert.equal(featureStrings[1], 'feature_toggle_x ()');
  assert.equal(featureStrings[2], 'feature_toggle_y (✓)');
  assert.equal(featureStrings[3], 'feature_toggle_z ()');
});

QUnit.test('Feature toggles are available as a public property of the instantiated FeatureToggleManager.', assert => {
  const manager = FeatureToggleManager.Instance;

  assert.equal(manager.Toggles[0].Name, 'feature_toggle_x');
  assert.equal(manager.Toggles[0].IsActive, false);
  assert.equal(manager.Toggles[1].Name, 'feature_toggle_y');
  assert.equal(manager.Toggles[1].IsActive, true);
  assert.equal(manager.Toggles[2].Name, 'feature_toggle_z');
  assert.equal(manager.Toggles[2].IsActive, false);
});

QUnit.test('Can create a UI interface for interacting with feature toggles.', assert => {
  const manager = FeatureToggleManager.Instance,
        panel = manager.CreateDisplayPanel(new StubDisplayPanelFactory());
  
  assert.ok(panel instanceof Element);
});

class WindowToggleSetter {
  private toggles: ToggleStatus[] = [];

  public setToggle(toggleName: string, toggleStatus: boolean): void {
    this.toggles.push({
      Name: toggleName,
      IsActive: toggleStatus
    });
  }
  
  public writeToWindowToggles(): void {
    window.sessionFeatureToggles = JSON.stringify(this.toggles);
  }
}

class StubDisplayPanelFactory implements IDisplayPanelFactory {
  public createDisplayPanel(): StubFeatureToggleDisplayPanel {
    const toggles: ToggleStatus[] = [{
      Name: 'ToggleA',
      IsActive: false
    }];
    return new StubFeatureToggleDisplayPanel(toggles);
  }
}

class StubFeatureToggleDisplayPanel extends DisplayPanel {
  constructor(private toggles: ToggleStatus[]) {
    super();
  }
}
