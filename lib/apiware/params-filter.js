var debug = require('debug')('ebja:apiware:params-filter');
var _ = require('lodash');
var errors = require('ghost-ignition').errors;

module.exports = function paramsFilter(apiReq, apiRes, next) {
    debug('Filter is not yet supported');

    // @TODO, yep this is dumb, waiting for jsonapi-mapper & bookshelf-jsonapi-params to work together again!
    _.each(apiReq.params.queryData.filter, function (filter) {
        if (!_.isEmpty(filter)) {
            return next(new errors.BadRequestError('Filter is not yet supported'));
        }
    });

    apiReq.query.options.filter = {};
    return next();
};
