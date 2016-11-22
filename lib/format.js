'use strict';
var _ = require('lodash');
var debug = require('ghost-ignition').debug('format');
var Mapper = require('./vendor/jsonapi-mapper');

var defaultSerializerOptions = {};
var defaultMapperOptions = {enableLinks: true};

module.exports = function format(api, apiReq, apiRes) {
    if (!apiRes || _.isEmpty(apiRes.model)) {
        debug('Nothing to format :(');
        // We don't throw an error, but return empty
        // This allows us to support, empty delete responses etc
        return;
    }

    debug('mapping to JSONAPI');
    // Apply any defaults that weren't overridden
    _.defaults(apiRes.serializerOptions, defaultSerializerOptions);
    _.defaults(apiRes.mapperOptions, defaultMapperOptions);
    var mapper = Mapper(api.baseUrl, apiRes.serializerOptions);
    var json = mapper.map(apiRes.model, apiRes.type, apiRes.mapperOptions);

    debug('returning');
    return json;
};
