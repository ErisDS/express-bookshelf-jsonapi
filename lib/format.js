var _ = require('lodash');
var debug = require('debug')('ebja:format');
var Mapper = require('./vendor/jsonapi-mapper');

module.exports = function format(apiReq, apiRes) {
    var mapper = Mapper(apiReq.baseUrl, apiRes.mapperOptions);
    var options, json;

    debug('Formatting');

    if (!apiRes || _.isEmpty(apiRes.model)) {
        debug('Nothing to format :(');
        return {};
    }

    options = _.extend({}, apiRes.options, {enableLinks: true});

    if (apiRes.model.pagination) {
        options.pagination = apiRes.model.pagination;
    }

    debug('mapping to JSONAPI');
    json = mapper.map(apiRes.model, apiRes.type, options);

    // debug('handling relations');
    // // @TODO find a better way to do this
    // if (options.relations && options.relations.fields && !json.data.relationships) {
    //     debug('Adding extra relations');
    //     json.data.relationships = {};
    //
    //     _.each(options.relations.fields, function (field) {
    //          json.data.relationships[field] = {
    //              links: {
    //                  self: json.data.links.self + '/relationships/' + field,
    //                  related: json.data.links.self + '/' + field
    //              }
    //          };
    //     });
    // }

    debug('returning');
    return json;
};
