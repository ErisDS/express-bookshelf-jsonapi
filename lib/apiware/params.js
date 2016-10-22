var debug = require('debug')('ebja:apiware:params');
var _ = require('lodash');
module.exports = function params(apiReq, apiRes, next) {
    debug('called', apiReq.params);

    if (apiReq.params.identifier) {
        apiReq.query.id = apiReq.params.identifier;
    }

    // @TODO do much smarter handling here :(
    apiReq.query = _.extend({}, apiReq.query, apiReq.params.queryData);
    apiReq.query.filter = {};

    next();
};