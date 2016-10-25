var debug = require('ghost-ignition').debug('request');

// @TODO resolve this into a sensible signature
function APIRequest(model, options, params) {
    debug('APIRequest');
    return {
        model: model,
        modelMethod: options.modelMethod,
        options: options,
        params: params,
        query: {
            data: {},
            options: {}
        }
    };
}

module.exports = APIRequest;