var debug = require('debug')('ebja:apiware:query');
var errors = require('ghost-ignition').errors;
module.exports = function query(apiReq, apiRes, next) {
    debug('called');

    apiReq.model[apiReq.modelMethod](apiReq.query)
        .then(function querySuccess(result) {
            debug('model query succeeded', result.id);
            apiRes.model = result;
            return next();
        })
        .catch(apiReq.model.NotFoundError, function notFound() {
            debug('model query found no result');
            return next(new errors.NotFoundError('No result found'));
        })
        .catch(function queryFailure(err) {
            debug('model query failed');
            console.log(err.stack);
            return next(err);
        });
};