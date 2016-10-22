var debug = require('debug')('ebja:apiware:params');
module.exports = function params(apiReq, apiRes, next) {
    debug('called', apiReq.params);

    if (apiReq.params.identifier) {
        apiReq.query.id = apiReq.params.identifier;
    }

    next();
};