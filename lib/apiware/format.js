var debug = require('ghost-ignition').debug('apiware:format');

function updateRelations(model, relation) {
    if (model.relations && !model.relations[relation]) {
        // Simulating an empty collection in json-mapper
        model.relations[relation] = {toJSON: function toJSON() { 
            return relation.match(/s$/) ? [] : {};
        }};
    }
}

function ensureRelationLinksArePresent(relations, apiRes) {
    if (relations) {
        // Update mapper options so that these are output
        apiRes.mapperOptions.relations = {
            fields: relations, included: true
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

        // If serializerOptions.attributes is set, we need to merge the relations into the list to ensure
        // That these are also output, else we have to duplicate the definition of them
        if (apiRes.serializerOptions.attributes) {
            apiRes.serializerOptions.attributes = apiRes.serializerOptions.attributes.concat(relations);
        }
    }
}

// @TODO think about how to restructure this
// So that there is default behaviour, which is overridable / extensible
// Rather than having to wholesale replace this function
module.exports = function format(apiReq, apiRes, next) {
    debug('compiling mapper options');

    var relations = apiReq.options.relations;
    ensureRelationLinksArePresent(relations, apiRes);

    // Ensure we get pagination from the model
    if (apiRes.model && apiRes.model.pagination) {
        apiRes.mapperOptions.pagination = apiRes.model.pagination;
    }

    next();
};