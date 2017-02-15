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

To provide a graphical user interface to users, you will need an instance of `FeatureToggleDisplayPanel`:
```
const myDisplayPanel = FeatureToggleDisplayPanel(featureToggles), // Pass in an array of toggles.
      myFeatureToggleManager = FeatureToggleManager.instance;
myFeatureToggleManager.createDisplayPanel(myDisplayPanel);
```

This is a barebones interface. The styling needs to be implemented by the consumer.
