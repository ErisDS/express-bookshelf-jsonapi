var debug = require('ghost-ignition').debug('apiware:prePerms');
module.exports = function prePerms(apiReq, apiRes, next) {
    debug('no op');
    next();
};