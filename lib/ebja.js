/**
 * Heavily borrowed from express
 */

var debug = require('ghost-ignition').debug('main');
var API = require('./api');
var mixin = require('merge-descriptors');

function createAPI(options) {
    var api = function () {};

    debug('createAPI', options);

    mixin(api, API, false);

    api.init(options);

    return api;
}

exports = module.exports = createAPI;

exports.plugin = require('./plugin');
