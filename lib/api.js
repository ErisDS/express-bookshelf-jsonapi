'use strict';

var debug = require('ghost-ignition').debug('api');
var _ = require('lodash');
var Endpoint = require('./endpoint');
var Resource = require('./resource');

// Declare our API top-level object
var api = exports = module.exports = {};

// @TODO support 'use' for API
api.init = function init(options) {
    debug('initing api');

    if (!options) {
        throw new Error('EBJA requires configuration');
    }

    if (!options.baseUrl) {
        throw new Error('EBJA requires a baseUrl');
    }

    if (!options.models) {
        throw new Error('EBJA requires bookshelf models');
    }

    this.baseUrl = options.baseUrl;
    this.models = options.models;

    delete options.baseUrl;
    delete options.models;

    this.options = _.defaults({}, options, {request: {}, response: {}});
};

api.Resource = function registerResource(options) {
    return new Resource(this, options);
};

api.Endpoint = function registerEndpoint(options) {
    return new Endpoint(this, options);
};
