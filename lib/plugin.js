var debug = require('debug')('ebja:plugin');
var jsonapiParams = require('bookshelf-jsonapi-params');

var jsonapi = function jsonapi(Bookshelf) {
    if (!Bookshelf.Model.hasOwnProperty('fetchJsonApi')) {
        Bookshelf.plugin(jsonapiParams);
    }

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
                return this.forge(query).fetchJsonApi(options, false);
            },
            getPage: function (options) {
                debug('getPage');
                query = {limit: 10, offset: 0};
                return this.fetchJsonApi(options);
            }
        });

    Bookshelf.Model = Model;
};

module.exports = jsonapi;