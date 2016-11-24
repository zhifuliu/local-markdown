import Q = require('q');
import models = require('../app/models');
import $ = require('jquery');
import _ = require('underscore');

var prefix = '/api';

class Service {
    getUserMsg(): Q.Promise<models.returnMsg> {
        return Q($.ajax({
            url: prefix + 'getUserMsg',
            type: 'post',
            contentType: 'application/json'
        }));
    }
}

export = new Service();
