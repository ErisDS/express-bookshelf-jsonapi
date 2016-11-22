var Mapper = require('jsonapi-mapper');

module.exports = function mapper(url, options) {
    return new Mapper.Bookshelf(url, options);
};

module.exports.knownSerializerOptions = [
    'attributes', 'ref', 'included', 'id', 'topLevelLinks', 'dataLinks', 'relationshipLinks', 'relationshipMeta',
    'ignoreRelationshipData', 'keyForAttribute', 'nullIfMissing', 'pluralizeType', 'typeForAttribute', 'meta'
];
module.exports.knownMapperOptions = [
    'omitAttrs', 'idAttribute', 'keyForAttr', 'relations', 'typeForModel', 'enableLinks', 'query', 'pagination'
];

