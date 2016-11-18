'use strict';
var debug = require('ghost-ignition').debug('plugin');
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
            getOne: function getOne(query) {
                debug('getOne', query);
                var options = query.options || {};
                // enforce require true for single resource fetches
                options.require = options.require || true;

                return this
                    // forge won't work here!
                    .where(query.data)
                    .fetchJsonApi(options, false);
            },
            getPage: function getPage(query) {
                debug('getPage');
                return this.fetchJsonApi(query.options);
            }
        });

    Bookshelf.Model = Model;
};

module.exports = jsonapi;