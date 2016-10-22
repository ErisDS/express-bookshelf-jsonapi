var debug = require('debug')('ebja:plugin');
var jsonapi = function jsonapi(Bookshelf) {
    var Model = Bookshelf.Model.extend(
        {
            jsonapi: true
        },
        {
            getById: function getById(id, options) {
                debug('getById', id);
                options = options || {};
                options.require = options.require || true;
                return this.forge({id: id}).fetch(options);
            },
            getPage: function () {

            }
        });

    Bookshelf.Model = Model;
};

module.exports = jsonapi;