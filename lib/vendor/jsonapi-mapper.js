var Mapper = require('jsonapi-mapper');

module.exports = function mapper(url, options) {
    return new Mapper.Bookshelf(url, options);
};
