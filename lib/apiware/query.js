var debug = require('ghost-ignition').debug('apiware:query');
var errors = require('ghost-ignition').errors;

module.exports = function query(apiReq, apiRes, next) {
    // Default to using the getOne method
    var methodToCall = apiReq.options.queryMethod || 'getOne';

    debug('doing model queryMethod', methodToCall);

    apiRes.exec.push({
        method: methodToCall,
        payload: apiReq.query
    });

    apiReq.model[methodToCall](apiReq.query)
        .then(function querySuccess(result) {
            debug('model query succeeded');
            apiRes.model = result;
            return next();
        }, function queryFailure(err) {
            if (err instanceof apiReq.model.NotFoundError) {
                return next(new errors.NotFoundError({message: 'No result found'}));
            }

            debug('model query failed');
            return next(err);
        });
};