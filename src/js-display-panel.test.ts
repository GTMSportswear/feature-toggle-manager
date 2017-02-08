import { FeatureToggleDisplayPanel } from './js-display-panel';

QUnit.module('DisplayPanel', {
  afterEach: () => {
    history.pushState('', 'Resetting url', window.location.origin + window.location.pathname);
  }
});

QUnit.test('Should have a title.', assert => {
  const panel = PanelFactory.getPanel(),
        panelNode = panel.draw();
  
  assert.equal(panelNode.querySelector('h2').innerHTML, 'Feature Toggles');
});

QUnit.test('Should output a list of current feature toggles', assert => {
  const panel = PanelFactory.getPanel(),
        panelNode = panel.draw(),
        toggleNodeList = panelNode.querySelectorAll('li');
  assert.equal(toggleNodeList.length, 2);
  assert.equal(toggleNodeList[0].querySelector('.item-name').innerHTML, 'FeatureA');
  assert.ok(toggleNodeList[0].querySelector('.item-status input[type="checkbox"]').getAttribute('checked'));

  assert.equal(toggleNodeList[1].querySelector('.item-name').innerHTML, 'FeatureB');
  assert.notOk(toggleNodeList[1].querySelector('.item-status input[type="checkbox"]').getAttribute('checked'));
});

QUnit.test('Should create toggle links that contain the proper query string parameters when no query string previously existed.', assert => {
  const panel = PanelFactory.getPanel(),
        panelNode = panel.draw(),
        toggleNodeList = panelNode.querySelectorAll('li');
  assert.equal(toggleNodeList[0].querySelector('.item-status input[type="checkbox"]').getAttribute('data-reload-href'), window.location.origin + window.location.pathname + '?featureoff=FeatureA');
  assert.equal(toggleNodeList[1].querySelector('.item-status input[type="checkbox"]').getAttribute('data-reload-href'), window.location.origin + window.location.pathname + '?featureon=FeatureB');
});

QUnit.test('Should create toggle links that contain the proper query string parameters when a query string currently exists.', assert => {
  history.pushState('', 'Adding a query string to url', window.location.pathname + '?someAttribute=someValue');
  
  const panel = PanelFactory.getPanel(),
        panelNode = panel.draw(),
        toggleNodeList = panelNode.querySelectorAll('li');
  assert.equal(toggleNodeList[0].querySelector('.item-status input[type="checkbox"]').getAttribute('data-reload-href'), window.location.origin + window.location.pathname + '?someAttribute=someValue&featureoff=FeatureA');
  assert.equal(toggleNodeList[1].querySelector('.item-status input[type="checkbox"]').getAttribute('data-reload-href'), window.location.origin + window.location.pathname + '?someAttribute=someValue&featureon=FeatureB');
});

QUnit.test('Should create toggle links that contain the proper query string parameters when a query string currently exists and has an existing featureon command.', assert => {
  history.pushState('', 'Adding a query string to url', window.location.pathname + '?featureon=FeatureX&someAttribute=someValue');
  
  const panel = PanelFactory.getPanel(),
        panelNode = panel.draw(),
        toggleNodeList = panelNode.querySelectorAll('li');
  assert.equal(toggleNodeList[0].querySelector('.item-status input[type="checkbox"]').getAttribute('data-reload-href'), window.location.origin + window.location.pathname + '?someAttribute=someValue&featureoff=FeatureA');
  assert.equal(toggleNodeList[1].querySelector('.item-status input[type="checkbox"]').getAttribute('data-reload-href'), window.location.origin + window.location.pathname + '?someAttribute=someValue&featureon=FeatureB');
});

QUnit.test('Should create toggle links that contain the proper query string parameters when a query string currently exists and has an existing featureoff command.', assert => {
  history.pushState('', 'Adding a query string to url', window.location.pathname + '?featureoff=FeatureX&someAttribute=someValue');
  
  const panel = PanelFactory.getPanel(),
        panelNode = panel.draw(),
        toggleNodeList = panelNode.querySelectorAll('li');
  assert.equal(toggleNodeList[0].querySelector('.item-status input[type="checkbox"]').getAttribute('data-reload-href'), window.location.origin + window.location.pathname + '?someAttribute=someValue&featureoff=FeatureA');
  assert.equal(toggleNodeList[1].querySelector('.item-status input[type="checkbox"]').getAttribute('data-reload-href'), window.location.origin + window.location.pathname + '?someAttribute=someValue&featureon=FeatureB');
});

QUnit.test('Should create toggle links that contain the proper query string parameters without affecting any active hashes.', assert => {
  history.pushState('', 'Adding a query string to url', window.location.pathname + '?featureoff=FeatureX&someAttribute=someValue#moreDataWeDoNotWantToMessUp');
  
  const panel = PanelFactory.getPanel(),
        panelNode = panel.draw(),
        toggleNodeList = panelNode.querySelectorAll('li');
  assert.equal(toggleNodeList[0].querySelector('.item-status input[type="checkbox"]').getAttribute('data-reload-href'), window.location.origin + window.location.pathname + '?someAttribute=someValue&featureoff=FeatureA#moreDataWeDoNotWantToMessUp');
  assert.equal(toggleNodeList[1].querySelector('.item-status input[type="checkbox"]').getAttribute('data-reload-href'), window.location.origin + window.location.pathname + '?someAttribute=someValue&featureon=FeatureB#moreDataWeDoNotWantToMessUp');
});

QUnit.test('Should have a button to hide the panel.', assert => {
  const panel = PanelFactory.getPanel(),
        panelNode = panel.draw();
  
  assert.ok(panelNode.querySelector('button.display-panel__hide'));
});

/** Some requirements
 *  Hashes should not be affected. 
 */

class PanelFactory {
  public static getPanel(): FeatureToggleDisplayPanel {
    return new FeatureToggleDisplayPanel([{
      Name: 'FeatureA',
      IsActive: true
    }, {
      Name: 'FeatureB',
      IsActive: false
    }]);
  }
}
