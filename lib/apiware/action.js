var debug = require('ghost-ignition').debug('apiware:action');
var errors = require('ghost-ignition').errors;
var _ = require('lodash');

/**
 * Action
 *
 * Default behaviour: takes a method & sends the payload to it
 */
module.exports = function action(apiReq, apiRes, next) {
    // If there's no actionMethod defined, then this is a noop
    if (!apiReq.options.actionMethod) {
        debug('doing noop');
        return next();
    }

    var methodToCall = apiReq.options.actionMethod;
    debug('doing model actionMethod', methodToCall);

    var actionPayload = _.clone(apiReq.query.data);
    // We've used data, so we clear it from apiReq.query
    apiReq.query.data = {};

    if (apiReq.params.identifier) {
        actionPayload.id = apiReq.params.identifier;
    }

    apiRes.exec.push({
        method: methodToCall,
        payload: actionPayload
    });

    return apiReq.model[methodToCall](actionPayload)
        .then(function actionSuccess(result) {
            debug('Success!', result.id);
            apiReq.query.data.id = result.id;

            return next();
        }, function actionFailure(err) {
            if (err instanceof apiReq.model.NotFoundError || err instanceof apiReq.model.NoRowsUpdatedError) {
                return next(new errors.NotFoundError({message: 'Resource Not Found'}));
            }

            debug('model action failed');
            return next(err);
        });
};