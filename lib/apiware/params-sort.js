var debug = require('ghost-ignition').debug('apiware:paramsSort');
var _ = require('lodash');

module.exports = function paramsSort(apiReq, apiRes, next) {
    debug('Sorting');

    // Apply the default
    apiReq.query.options.sort = apiReq.options.defaultSort || [];

    if (!_.isEmpty(apiReq.params.queryData.sort)) {
        // If a sort was set for this request, apply that instead
        apiReq.query.options.sort = apiReq.params.queryData.sort;
    }

    return next();
};
