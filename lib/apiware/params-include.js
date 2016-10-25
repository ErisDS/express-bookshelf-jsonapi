var debug = require('ghost-ignition').debug('apiware:paramsInclude');
var errors = require('ghost-ignition').errors;
var _ = require('lodash');

module.exports = function paramsInclude(apiReq, apiRes, next) {
    // Handle Includes
    var requestedIncludes = apiReq.params.queryData.include;
    var allowedIncludes = apiReq.options.relations;
    var diff = _.difference(requestedIncludes, allowedIncludes);
    debug('permitting includes', allowedIncludes);

    if (diff.length > 0) {
        return next(new errors.ValidationError({
            message: 'Unsupported include value',
            source: diff.join(', ')
        }));
    }

    apiReq.query.options.include = apiReq.params.queryData.include;

    return next();
};
