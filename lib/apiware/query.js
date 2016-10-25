var debug = require('debug')('ebja:apiware:query');
module.exports = function query(apiReq, apiRes, next) {
    debug('called');

    apiReq.model[apiReq.modelMethod](apiReq.query)
        .then(function querySuccess(result) {
            debug('model query succeeded', result.id);
            apiRes.model = result;
            next();
        })
        .catch(function queryFailure(err) {
            debug('model query failed');
            console.log(err.stack);
            // @TODO some more error handling here?
            next(err);
        });
};