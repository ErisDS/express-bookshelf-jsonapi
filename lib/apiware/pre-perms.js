var debug = require('debug')('ebja:apiware:preperms');
module.exports = function preperms(apiReq, apiRes, next) {
    debug('called');
    next();
};