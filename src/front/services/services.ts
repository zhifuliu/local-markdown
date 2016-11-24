import Q = require('q');
import models = require('../app/models');
import $ = require('jquery');
import _ = require('underscore');

var prefix = '/api';

class Service {
    login(qd: any): Q.Promise<models.returnMsg> {
        return Q($.ajax({
            url: prefix + '/login',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(qd)
        }));
    }
}

export = new Service();
