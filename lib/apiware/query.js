var debug = require('debug')('ebja:apiware:query');
module.exports = function query(apiReq, apiRes, next) {
    debug('called');

    apiReq.model[apiReq.modelMethod](apiReq.query, apiReq.options)
        .then(function querySuccess(result) {
            debug('model query succeeded');
            apiRes.resultModel = result;
            next();
        })
        .catch(function queryFailure(err) {
            debug('model query failed');
            // @TODO some more error handling here?
            next(err);
        });
};