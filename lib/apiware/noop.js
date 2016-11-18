var debug = require('ghost-ignition').debug('apiware:noop');
module.exports = function noop(apiReq, apiRes, next) {
    debug('doing no op');
    next();
};