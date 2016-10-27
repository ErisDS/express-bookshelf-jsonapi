var debug = require('debug')('ebja:apiware:params-sort');
var _ = require('lodash');
var errors = require('ghost-ignition').errors;

module.exports = function paramsSort(apiReq, apiRes, next) {
    debug('Sort is not yet supported');

    if (!_.isEmpty(apiReq.params.queryData.sort)) {
        return next(new errors.BadRequestError({message: 'Sort is not yet supported'}));
    }

    apiReq.query.options.sort = [];
    return next();
};
