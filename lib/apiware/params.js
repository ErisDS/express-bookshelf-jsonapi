var debug = require('debug')('ebja:apiware:params');
var _ = require('lodash');
var _private = {};

_private.processFilter = function processFilter() {
    // @TODO do much smarter handling here because it doesn't work by default :(
    return {};
};

_private.processFields = function processFields() {
    // @TODO re-enable field support?
    return {};
};

_private.processInclude = function processInclude(values) {
    // @TODO validate these values
    return values;
};

_private.processSort = function processSort() {
    return [];
};

_private.processPage = function processPage(values) {
    if (!values.limit) {
        values.limit = 10;
    }

    if (!values.offset) {
        values.offset = 0;
    }

    return values;
};

module.exports = function params(apiReq, apiRes, next) {
    debug('called', apiReq.params);

    if (apiReq.params.identifier) {
        apiReq.query.data.id = apiReq.params.identifier;
    }

    apiReq.query.options.fields = _private.processFields(apiReq.params.queryData.fields);
    apiReq.query.options.filter = _private.processFilter(apiReq.params.queryData.filter);
    apiReq.query.options.include = _private.processInclude(apiReq.params.queryData.include);
    apiReq.query.options.sort = _private.processSort(apiReq.params.queryData.sort);
    apiReq.query.options.page = _private.processPage(apiReq.params.queryData.page);

    next();
};