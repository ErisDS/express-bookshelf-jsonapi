var debug = require('debug')('ebja:apiware:format');
module.exports = function format(apiReq, apiRes, next) {
    debug('called');
    next();
};