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
    var includes = apiReq.query.options.include;

    // Omit data attribute from related models that have not been included
    // This is a workaround for jsonapi-mapper bug - https://github.com/scoutforpets/jsonapi-mapper/issues/69
    _.each(json.data.relationships, function (v, k) {
        json.data.relationships[k] = !_.includes(includes, k) ? _.omit(v, 'data') : v;
    });

    debug('returning');
    return json;
};
