var debug = require('debug')('ebja:plugin');
var jsonapi = function jsonapi(Bookshelf) {
    // Load the pagination plugin if it doesn't already exist
    if (!Bookshelf.Model.hasOwnProperty('fetchPage')) {
        Bookshelf.plugin('pagination');
    }

    var Model = Bookshelf.Model.extend(
        {
            jsonapi: true
        },
        {
            // @TODO decide on method signatures here
            getOne: function getOne(query, options) {
                debug('getOne', query);
                options = options || {};
                options.require = options.require || true;
                return this.forge(query).fetch(options);
            },
            getPage: function (query, options) {
                debug('getPage');
                query = {limit: 10, offset: 0};
                return this.fetchPage(query);
            }
        });

    Bookshelf.Model = Model;
};

module.exports = jsonapi;