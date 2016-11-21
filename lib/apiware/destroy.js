var debug = require('ghost-ignition').debug('apiware:destroy');
var errors = require('ghost-ignition').errors;

module.exports = function destroy(apiReq, apiRes, next) {
    if (!apiReq.params.identifier) {
        return next(new errors.BadRequestError({message: 'Attempting to destroy a resource without an identifier'}));
    }

    // Default to looking for a method called destroy
    var methodToCall = apiReq.options.destroyMethod || 'destroy';

    var destroyPayload = {
        id:  apiReq.params.identifier,
        require: true
        // @TODO make it possible to pass through through a transaction
    };

    apiRes.exec.push({
        method: methodToCall,
        payload: destroyPayload
    });

    return apiReq.model[methodToCall](destroyPayload)
        .then(function destroySuccess() {
            debug('Success!');
            return next();
        }, function destroyFailure(err) {
            if (err instanceof apiReq.model.NoRowsDeletedError) {
                return next(new errors.NotFoundError({message: 'Resource Not Found'}));
            }

            debug('model destroy failed');
            return next(err);
        });
};
