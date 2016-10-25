var debug = require('ghost-ignition').debug('apiware:postperms');
module.exports = function postperms(apiReq, apiRes, next) {
    debug('doing no op');
    next();
};