var _ = require('lodash'),
    debug = require('ghost-ignition').debug('apiware:paramsPage'),
    defaultPageOptions = {
        limit: 10,
        offset: 0
    };

module.exports = function paramsPage(apiReq, apiRes, next) {
    debug('Ensuring limit and offset');

    if (apiReq.options.queryMethod === 'getOne') {
        return next();
    }

    var pageOptions = apiReq.options.page || {};

    if (pageOptions.pageSize) {
        pageOptions.limit = pageOptions.pageSize;
        delete pageOptions.pageSize;
    }

    if (pageOptions.page) {
        pageOptions.offset = pageOptions.page;
        delete pageOptions.page;
    }

    pageOptions = _.defaults({}, apiReq.params.queryData.page, pageOptions, defaultPageOptions);

    if (pageOptions.limit === 'all') {
        pageOptions = false;
    }

    apiReq.query.options.page = pageOptions;

    return next();
};
