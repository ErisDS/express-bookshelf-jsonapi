var debug = require('debug')('ebja:apiware:params-page');

module.exports = function paramsPage(apiReq, apiRes, next) {
    debug('Ensuring limit and offset');
    // @TODO: proper page implementation, with configurable defaults & handling of pageSize and page
    // @TODO: don't do this for single requests!
    apiReq.query.options.page = apiReq.params.queryData.page;
    if (!apiReq.query.options.page.limit) {
        apiReq.query.options.page.limit = 10;
    }

    if (!apiReq.query.options.page.offset) {
        apiReq.query.options.page.offset = 0;
    }

    return next();
};
