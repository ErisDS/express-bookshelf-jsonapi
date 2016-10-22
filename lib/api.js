var debug = require('debug')('ebja:api');
var api = exports = module.exports = {};
var Endpoint = require('./endpoint');

api.init = function init(options) {
    debug('init', arguments);

    if (!options.baseUrl) {
        throw new Error('EBJA requires a baseUrl');
    }

    if (!options.models) {
        throw new Error('EBJA requires bookshelf models');
    }

    this.baseUrl = options.baseUrl;
    this.models = options.models;
};

api.endpoint = function (options) {
    debug('Endpoint', arguments);
    return new Endpoint(this, options);
};
