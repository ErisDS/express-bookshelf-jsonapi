var debug = require('ghost-ignition').debug('apiware:validate');
module.exports = function validate(apiReq, apiRes, next) {
    debug('doing no op');
    next();
};