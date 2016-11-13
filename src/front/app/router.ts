import ko = require("knockout");
import crossroads = require("crossroads");
import hasher = require("hasher");
export = router;

module router {
    export interface RouteEntry {
        url: string;
        params: { [key: string]: string };
    }

    export var currentRoute = ko.observable(<RouteEntry>{});

    var allRoutes = [
        {
            url: '',
            params: {page: 'home-page'}
        }, {
            url: 'about',
            params: { page: 'about-page' }
        }
    ];

    ko.utils.arrayForEach(allRoutes, (route) => {
        crossroads.addRoute(route.url, (requestParams) => {
            currentRoute(<RouteEntry>ko.utils.extend(requestParams, route.params));
        });
    });

    function parseHash(newHash, oldHash) { crossroads.parse(newHash); }
    crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
    hasher.initialized.add(parseHash);
    hasher.changed.add(parseHash);
    hasher.init();
}
