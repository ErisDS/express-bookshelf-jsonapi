var debug = require('ghost-ignition').debug('apiware:format');
module.exports = function format(apiReq, apiRes, next) {
    debug('called');

    // Build mapperOptions from other options
    // USER: mapperOptions: {relations: { fields: ['blogs'], included: true }}
    // BLOG: mapperOptions: {omitAttrs: ['user_id', 'database_password'], relations: { fields: ['owner', 'user'], included: true }}
    apiRes.mapperOptions = {};
    var relations = apiReq.options.relations;

    if (relations) {
        // Update mapper
        apiRes.mapperOptions.relations = {
            fields: relations
        };

        // Update model, this is a hack to work around https://github.com/scoutforpets/jsonapi-mapper/issues/69
        // That is, there's no other way to tell the mapper to include relations
        relations.forEach(function addRelationToModel(relation) {
            if (apiRes.model.relations && !apiRes.model.relations[relation]) {
                // Simulating an empty collection in json-mapper
                apiRes.model.relations[relation] = {toJSON: function toJSON() { return []}};
            }
        });
    }

    if (apiReq.options.omitAttrs) {
        apiRes.mapperOptions.omitAttrs = apiReq.options.omitAttrs;
    }

    next();
};