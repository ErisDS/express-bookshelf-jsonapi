var debug = require('debug')('ebja:apiware:validate');
module.exports = function validate(apiReq, apiRes, next) {
    debug('called');
    next();
};