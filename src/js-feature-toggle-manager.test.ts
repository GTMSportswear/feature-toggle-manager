import { FeatureToggleManager } from './js-feature-toggle-manager';

QUnit.module('FeatureToggleManager tests');

test('Can check feature enabled', assert => {
  window.featureToggles = JSON.stringify(['feature_toggle_a']);
  ok(FeatureToggleManager.hasFeature('a'), 'feature toggle a should exist');
  notOk(FeatureToggleManager.hasFeature('b'), 'feature toggle should not exist');
});

test('Null checks', assert => {
  window.featureToggles = undefined;
  notOk(FeatureToggleManager.hasFeature(null), 'NULL feature toggle should not exist');
});

test('Empty checks', assert => {
  window.featureToggles = '[]';
  notOk(FeatureToggleManager.hasFeature('a'), 'a feature toggle should not exist');
});

test('JSON stringify empty object should work', assert => {
  window.featureToggles = JSON.stringify({});
  notOk(FeatureToggleManager.hasFeature('a'), 'a feature toggle should not exist');
});

test('JSON stringify empty array should work', assert => {
  window.featureToggles = JSON.stringify([]);
  notOk(FeatureToggleManager.hasFeature('a'), 'a feature toggle should not exist');
});
