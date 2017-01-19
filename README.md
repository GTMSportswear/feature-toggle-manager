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
### new FeatureToggleManager()
For more complicated setups which allow feature toggles to be turned on via the query string, instantiate a feature toggle manager object, which will automatically collect available feature toggles from browser localStorage and window.

### updateTogglesBasedOnQueryStringCommands()
To update the feature toggle in localStorage based on query string commands, call this method.

The query string commands to toggle on and off features are these:
`featureon=the_feature_you_want_turned_on`
`featureoff=the_feature_you_want_turned_off`
```
/**
  * Checks the browser's query string and turns on or off 
  * any feature toggles based on those settings.
  * Returns void.
  */
const manager = new FeatureToggleManager();
manager.updateTogglesBasedOnQueryStringCommands();
```

