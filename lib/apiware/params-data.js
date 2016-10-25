var debug = require('ghost-ignition').debug('apiware:paramsData');

module.exports = function paramsData(apiReq, apiRes, next) {
    debug('Handling identifier');
    // Handle having an ID
    if (apiReq.params.identifier) {
        apiReq.query.data.id = apiReq.params.identifier;
    }

    next();
};
