var debug = require('debug')('ebja:apiware:params');
var errors = require('ghost-ignition').errors;
var _ = require('lodash');

module.exports = function params(apiReq, apiRes, next) {
    debug('called', apiReq.params);

    // Handle having an ID
    if (apiReq.params.identifier) {
        apiReq.query.data.id = apiReq.params.identifier;
    }

    // Handle Includes
    var requestedIncludes = apiReq.params.queryData.include;
    var allowedIncludes = apiReq.options.relations;
    var diff = _.difference(requestedIncludes, allowedIncludes);
    if (diff.length > 0) {
        return next(new errors.ValidationError('Unsupported include value', diff.join(', ')));
    }

    apiReq.query.options.include = apiReq.params.queryData.include;

    // @TODO: proper page implementation, with configurable defaults & handling of pageSize and page
    apiReq.query.options.page = apiReq.params.queryData.page;
    if (!apiReq.query.options.page.limit) {
        apiReq.query.options.page.limit = 10;
    }

    if (!apiReq.query.options.page.offset) {
        apiReq.query.options.page.offset = 0;
    }

    // These aren't fully implemented/supported yet, temporarily disable:
    apiReq.query.options.filter = {};
    apiReq.query.options.fields = {};
    apiReq.query.options.sort = [];

    next();
};
