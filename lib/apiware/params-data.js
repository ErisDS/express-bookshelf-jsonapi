var debug = require('ghost-ignition').debug('apiware:paramsData');
var errors = require('ghost-ignition').errors;
var _ = require('lodash');

function isValidData(data) {
    if (_.isEmpty(data)) {
        return false;
    }

    if (!_.isArray(data) && !_.isObject(data)) {
        return false;
    }

    if (_.isObject(data)) {
        if (!_.has(data, 'type')) {
            return false;
        }

        if (!_.has(data, 'attributes')) {
            return false;
        }
    }

    // TODO: validate collections / arrays

    return true;
}

module.exports = function paramsData(apiReq, apiRes, next) {
    if (apiReq.params.identifier) {
        // Handle having an ID
        debug('Handling identifier');
        apiReq.query.data.id = apiReq.params.identifier;
    }

    if (!_.isEmpty(apiReq.payload)) {
        var data = apiReq.payload.data;
        // Handle having a payload
        if (!isValidData(data)) {
            return next(new errors.BadRequestError({
                message: 'Malformed payload: data object is invalid'
            }));
        }

        if (_.isObject(data)) {
            if (apiReq.options.attributes) {
                debug('data and attributes');
                apiReq.query.data = _.pick(data.attributes, apiReq.options.attributes);
            }

            apiReq.query.data = data.attributes;
        }

        // TODO handle array payloads?
    }

    next();
};
