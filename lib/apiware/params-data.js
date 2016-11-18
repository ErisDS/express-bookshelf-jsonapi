var debug = require('ghost-ignition').debug('apiware:paramsData');

module.exports = function paramsData(apiReq, apiRes, next) {
    debug('Checking for identifier');
    if (apiReq.params.identifier) {
        // Handle having an ID
        debug('Handling identifier');
        apiReq.query.data.id = apiReq.params.identifier;
    }

    next();
};
