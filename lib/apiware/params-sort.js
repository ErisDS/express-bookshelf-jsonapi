var debug = require('ghost-ignition').debug('apiware:paramsSort');
var errors = require('ghost-ignition').errors;
var _ = require('lodash');

module.exports = function paramsSort(apiReq, apiRes, next) {
    debug('Sort is not yet supported');

    if (!_.isEmpty(apiReq.params.queryData.sort)) {
        return next(new errors.BadRequestError({message: 'Sort is not yet supported'}));
    }

    apiReq.query.options.sort = [];
    return next();
};
