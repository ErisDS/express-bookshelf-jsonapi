var debug = require('ghost-ignition').debug('resource');
var _ = require('lodash');
var Endpoint = require('./endpoint');

// @TODO fixup the way this is created vs api and endpoint
var Resource = function Resource (api, resourceOpts) {
    debug('Registering resource: ' + resourceOpts.model);

    this.endpoint = function (options) {
        debug('Registering resource endpoint: ' + options.modelMethod);
        return new Endpoint(api, _.merge({}, resourceOpts, options))
    };

    // TODO support handler/use in here
};

module.exports = Resource;