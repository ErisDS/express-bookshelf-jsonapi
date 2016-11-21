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

    apiRes.payload = destroyPayload;

    apiReq.model[methodToCall](destroyPayload)
        .then(function () {
            return next();
        })
        .catch(apiReq.model.NoRowsUpdatedError, function notFound() {
            debug('model destroy found no resource to destroy');
            return next(new errors.NotFoundError({message: 'Resource not found'}));
        })
        .catch(function destroyFailure(err) {
            debug('model destroy failed');
            return next(err);
        });
};
