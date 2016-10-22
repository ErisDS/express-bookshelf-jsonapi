var debug = require('debug')('ebja:apiware:postperms');
module.exports = function postperms(apiReq, apiRes, next) {
    debug('called');
    next();
};