/// <amd-dependency path="bootstrap" />

import $ = require("jquery");
import ko = require("knockout");
import bootstrap = require("bootstrap");
import router = require("./router");

ko.components.register('home-page', { require: 'components/home-page/home' });
ko.components.register('about-page', {
    template: { require: 'text!components/about-page/about.html' }
});
class App {
    public route = router.currentRoute;
}

var app = new App();
ko.applyBindings(app);
export = app;
