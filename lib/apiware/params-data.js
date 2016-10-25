var debug = require('debug')('ebja:apiware:params-data');

module.exports = function paramsData(apiReq, apiRes, next) {
    debug('Handling identifier');
    // Handle having an ID
    if (apiReq.params.identifier) {
        apiReq.query.data.id = apiReq.params.identifier;
    }

    next();
};
