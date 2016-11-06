var debug = require('ghost-ignition').debug('apiware:format');
module.exports = function format(apiReq, apiRes, next) {
    debug('compiling mapper options');

    // Build mapperOptions from other options
    apiRes.mapperOptions = {};
    var relations = apiReq.options.relations;

    function updateRelations(model, relation) {
        if (model.relations && !model.relations[relation]) {
            // Simulating an empty collection in json-mapper
            model.relations[relation] = {toJSON: function toJSON() { return []}};
        }
    }

    if (relations) {
        // Update mapper
        apiRes.mapperOptions.relations = {
            fields: relations
        };

        // Update model, this is a hack to work around https://github.com/scoutforpets/jsonapi-mapper/issues/69
        // That is, there's no other way to tell the mapper to include relations
        relations.forEach(function addRelationToModel(relation) {
            if (apiRes.model.length) {
                // This is a collection
                apiRes.model.each(function (model) {
                    updateRelations(model, relation)
                });
            } else {
                 updateRelations(apiRes.model, relation);
            }
        });
    }

    // @TODO fix this so we can whitelist rather than blacklist
    if (apiReq.options.omitAttrs) {
        // debug('attribute processing', apiRes.model);
        apiRes.mapperOptions.omitAttrs = apiReq.options.omitAttrs;
    }

    next();
};