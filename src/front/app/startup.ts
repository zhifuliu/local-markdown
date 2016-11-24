/// <amd-dependency path="bootstrap" />

import $ = require("jquery");
import ko = require("knockout");
import bootstrap = require("bootstrap");
import router = require("./router");
import services = require('../services/services');

ko.components.register('home-page', { require: 'components/home-page/home' });
ko.components.register('about-page', {
    template: { require: 'text!components/about-page/about.html' }
});
class App {
    public route = router.currentRoute;
}

// services.login({
//     user: 1203228,
//     pass: 000000
// })
//     .then(function(data) {
//         console.log(data);
//     })
//     .catch(function(error) {
//         console.log(error);
//     });

var app = new App();
ko.applyBindings(app);
export = app;
