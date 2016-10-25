var debug = require('debug')('ebja:apiware:post-perms');
module.exports = function postPerms(apiReq, apiRes, next) {
    debug('called');
    next();
};