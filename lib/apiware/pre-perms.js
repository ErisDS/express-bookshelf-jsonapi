var debug = require('debug')('ebja:apiware:prePerms');
module.exports = function prePerms(apiReq, apiRes, next) {
    debug('called');
    next();
};