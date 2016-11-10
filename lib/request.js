var debug = require('ghost-ignition').debug('request');

// @TODO resolve this into a sensible signature
// @TODO make this a proper class/object
function APIRequest(model, options, params, payload, source) {
    debug('APIRequest');
    return {
        // The bookshelf model for which this request is being made
        model: model,
        // The model method that will be called to do a query
        modelMethod: options.modelMethod,
        // Any other options passed in
        options: options,
        // Parameters
        params: params,
        // Payload
        payload: payload,
        // The query that is going to be passed to the model method
        query: {
            data: {},
            options: {}
        },
        // Who or what is making the request (usually some sort of user)
        source: source
    };
}

module.exports = APIRequest;