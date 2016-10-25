var debug = require('ghost-ignition').debug('apiware:paramsFields');
var errors = require('ghost-ignition').errors;
var _ = require('lodash');

module.exports = function paramsFields(apiReq, apiRes, next) {
    debug('Fields is not yet supported');

    if (!_.isEmpty(apiReq.params.queryData.fields)) {
        return next(new errors.BadRequestError({message: 'Fields is not yet supported'}));
    }

    apiReq.query.options.fields = {};
    return next();
};
