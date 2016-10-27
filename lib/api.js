var debug = require('ghost-ignition').debug('api');
var Endpoint = require('./endpoint');
var Resource = require('./resource');

// Declare our API top-level object
var api = exports = module.exports = {};

// @TODO support 'use' for API
api.init = function init(options) {
    debug('initing api');

    if (!options.baseUrl) {
        throw new Error('EBJA requires a baseUrl');
    }

    if (!options.models) {
        throw new Error('EBJA requires bookshelf models');
    }

    this.baseUrl = options.baseUrl;
    this.models = options.models;
};

api.resource = function registerResource(options) {
    return new Resource(this, options);
};

api.endpoint = function registerEndpoint(options) {
    debug('Endpoint: ' + options.model);
    return new Endpoint(this, options);
};
