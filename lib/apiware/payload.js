var debug = require('ghost-ignition').debug('apiware:payload');
var errors = require('ghost-ignition').errors;
var _ = require('lodash');

function isValidData(data) {
    if (_.isEmpty(data)) {
        return false;
    }

    if (!_.isArray(data) && !_.isObject(data)) {
        return false;
    }

    if (_.isArray(data)) {
        // TODO: validate collections / arrays
        return true;
    }

    if (!_.has(data, 'type')) {
        return false;
    }

    if (!_.has(data, 'attributes')) {
        return false;
    }

    return true;
}

module.exports = function payload(apiReq, apiRes, next) {
    if (!_.isEmpty(apiReq.payload)) {
        var data = apiReq.payload.data;
        // Handle having a payload
        if (!isValidData(data)) {
            return next(new errors.BadRequestError({
                message: 'Malformed payload: data object is invalid'
            }));
        }

        if (_.isArray(data) && data.length === 1) {
            apiReq.query.data = data[0].attributes;
        }

        // TODO handle array payloads with more than 1 item?

        // Arrays return true for isObject :(
        if (!_.isArray(data) && _.isObject(data)) {
            apiReq.query.data = data.attributes;
        }
    }

    next();
};
