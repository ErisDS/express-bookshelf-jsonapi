var debug = require('debug')('ebja:apiware:params-fields');
var _ = require('lodash');
var errors = require('ghost-ignition').errors;

module.exports = function paramsFields(apiReq, apiRes, next) {
    debug('Fields is not yet supported');

    if (!_.isEmpty(apiReq.params.queryData.fields)) {
        return next(new errors.BadRequestError({message: 'Fields is not yet supported'}));
    }

    apiReq.query.options.fields = {};
    return next();
};
