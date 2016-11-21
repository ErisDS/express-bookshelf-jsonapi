'use strict';
var debug = require('ghost-ignition').debug('resource');
var _ = require('lodash');
var Endpoint = require('./endpoint');

// @TODO fixup the way this is created vs api and endpoint
var Resource = function Resource(api, resourceOpts) {
    debug('Registering resource: ' + resourceOpts.model);

    this.Endpoint = function registerEndpoint(options) {
        debug('Registering resource endpoint: ' + options.queryMethod);
        return new Endpoint(api, _.merge({}, resourceOpts, options))
    };
};

module.exports = Resource;