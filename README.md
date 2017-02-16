# Feature Toggle Manager

The feature toggle manager reads statuses from a variable called `window.sessionFeatureToggles`.

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
### Console Toggle View
In order to activate a method which will allow users to issue a console command to see which feature toggles are activated, you will need to get an instance of the feature toggle manager.

You can do this by calling this method:
```
const myFeatureToggleManager = FeatureToggleManager.instance;
```

Then, users can simply enter a command in the console to get output similar to the following:
```
> window.showFeatures()

feature_toggle_x ()
feature_toggle_y (✓)
feature_toggle_z ()
```

### GUI Toggle View
To provide a graphical user interface to users, you will need an instance of `FeatureToggleDisplayPanel`:
```
const myFeatureToggleManager = FeatureToggleManager.instance,
      availableToggles = myFeatureToggleManager.toggles,
      displayPanel = myFeatureToggleManager.createDisplayPanel(new FeatureToggleDisplayPanel(availableToggles));

// displayPanel will be a div element containing the user interface.
```

This is a barebones user interface. The consumer will need to make the styling decisions.
