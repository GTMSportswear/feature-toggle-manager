# Feature Toggle Manager

The feature toggle manager knows how to read statuses of current feature toggles from `localStorage.getItem('featureToggles')` as well as from `window.featureToggleStatuses`.

## Static Methods
### hasFeature()
Use this method whenever a feature toggle switch needs to happen in the code.
```
/**
  * Check if a particular feature toggle is turned on.
  * Returns a boolean.
  */
FeatureToggleManager.hasFeature('some_amazing_feature');
```

## Instantiated Methods
### new FeatureToggleManager(someCallbackFunctionToHandleToggleSetRequests)
For more complicated setups which allow feature toggles to be turned on via the query string, instantiate a feature toggle manager object, which will automatically collect available feature toggles from browser localStorage and window.

### activateTogglesBasedOnQueryStringCommands()
To activate a feature toggle based on query string commands, call this method.

The query string command is this:
`featureon=the_feature_you_want_turned_on`
```
/**
  * Checks the browser's query string and activates
  * any feature toggles based on those settings.
  * Returns void.
  */
const manager = new FeatureToggleManager();
manager.activateTogglesBasedOnQueryStringCommands();
```

### deactivateTogglesBasedOnQueryStringCommands()
To deactivate a feature toggle based on query string commands, call this method.

The query string command is this:
`featureoff=the_feature_you_want_turned_off`
```
/**
  * Checks the browser's query string and deactivates
  * any feature toggles based on those settings.
  * Returns void.
  */
const manager = new FeatureToggleManager();
manager.deactivateTogglesBasedOnQueryStringCommands();
```
