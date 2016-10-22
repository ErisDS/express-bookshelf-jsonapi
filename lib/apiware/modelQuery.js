var debug = require('debug')('ebja:apiware:modelQuery');
module.exports = function modelQuery(apiReq, apiRes, next) {
    debug('called with', apiReq);

    apiReq.model[apiReq.modelMethod](apiReq.params.identifier)
        .then(function modelSuccess(result) {
            debug('model query succeeded');
            apiRes.resultModel = result;
            next();
        })
        .catch(function modelFailure(err) {
            debug('model query failed');
            // @TODO some more error handling here?
            next(err);
        });
};