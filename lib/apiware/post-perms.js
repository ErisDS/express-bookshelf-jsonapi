var debug = require('ghost-ignition').debug('apiware:postPerms');
module.exports = function postPerms(apiReq, apiRes, next) {
    debug('no op');
    next();
};