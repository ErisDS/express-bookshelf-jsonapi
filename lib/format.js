var _ = require('lodash');
var debug = require('ghost-ignition').debug('format');
var Mapper = require('./vendor/jsonapi-mapper');

module.exports = function format(api, apiReq, apiRes) {
    debug('Formatting');
    var mapper = Mapper(api.baseUrl, apiRes.mapperOptions);
    var options, json;

    if (!apiRes || _.isEmpty(apiRes.model)) {
        debug('Nothing to format :(');
        // @TODO maybe throw an error here?
        return;
    }

    options = _.extend({}, apiRes.options, {enableLinks: true});

    if (apiRes.model.pagination) {
        options.pagination = apiRes.model.pagination;
    }

    debug('mapping to JSONAPI');
    json = mapper.map(apiRes.model, apiRes.type, options);

    debug('returning');
    return json;
};
