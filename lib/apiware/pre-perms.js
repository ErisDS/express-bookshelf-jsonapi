var debug = require('ghost-ignition').debug('apiware:preperms');
module.exports = function preperms(apiReq, apiRes, next) {
    debug('doing no op');
    next();
};