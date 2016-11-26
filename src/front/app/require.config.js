// require.js looks for the following global when initializing
var require = {
  baseUrl: "./front/",
  paths: {
    "bootstrap":            "bower_modules/components-bootstrap/js/bootstrap.min",
    "crossroads":           "bower_modules/crossroads/dist/crossroads.min",
    "hasher":               "bower_modules/hasher/dist/js/hasher.min",
    "jquery":               "bower_modules/jquery/dist/jquery",
    "knockout":             "bower_modules/knockout/dist/knockout",
    "knockout-validation":  "bower_modules/knockout-validation/dist/knockout.validation",
    "knockout-projections": "bower_modules/knockout-projections/dist/knockout-projections",
    "signals":              "bower_modules/js-signals/dist/signals.min",
    "text":                 "bower_modules/requirejs-text/text",
    "knockstrap":           "bower_modules/knockstrap/build/knockstrap",
    "jasmine":              "bower_modules/jasmine/lib/jasmine-core/jasmine",
    "requirejs":            "bower_modules/requirejs/require",
    "q":                    "bower_modules/q/q",
    "knockout-postbox":     "bower_modules/knockout-postbox/build/knockout-postbox",
    "underscore":           "bower_modules/underscore/underscore"
  },
  shim: {
    "bootstrap": { deps: ["jquery"] }
  }
};
