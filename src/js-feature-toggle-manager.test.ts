import { FeatureToggleManager } from './js-feature-toggle-manager';

QUnit.module('FeatureToggleManager tests');

QUnit.test('can check feature enabled', assert => {
  window.featureToggles = JSON.stringify(['feature_toggle_a']);
  assert.ok(FeatureToggleManager.hasFeature('a'), 'feature toggle a should exist');
  assert.notOk(FeatureToggleManager.hasFeature('b'), 'feature toggle should not exist');
});

QUnit.test('should work with undefined', assert => {
  window.featureToggles = undefined;
  assert.notOk(FeatureToggleManager.hasFeature(undefined), 'Undefined feature toggle should not exist');
});

QUnit.test('should work with null', assert => {
  window.featureToggles = null;
  assert.notOk(FeatureToggleManager.hasFeature(null), 'NULL feature toggle should not exist');
});

QUnit.test('should allow empty array', assert => {
  window.featureToggles = '[]';
  assert.notOk(FeatureToggleManager.hasFeature('a'), 'a feature toggle should not exist');
});

QUnit.test('should stringify JSON empty object should work', assert => {
  window.featureToggles = JSON.stringify({});
  assert.notOk(FeatureToggleManager.hasFeature('a'), 'a feature toggle should not exist');
});

QUnit.test('should stringify JSON empty array should work', assert => {
  window.featureToggles = JSON.stringify([]);
  assert.notOk(FeatureToggleManager.hasFeature('a'), 'a feature toggle should not exist');
});

QUnit.test('should find feature toggle', assert => {
  window.featureToggles = `["catalog_notification"]`;
  assert.ok(FeatureToggleManager.hasFeature('catalog_notification'), 'catalog_notification exists');
});
