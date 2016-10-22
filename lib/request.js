var debug = require('debug')('ebja:request');

// @TODO resolve this into a sensible signature
function APIRequest(baseUrl, model, modelMethod, params) {
    debug('APIRequest');
    return {
        baseUrl: baseUrl,
        model: model,
        modelMethod: modelMethod,
        options: {},
        params: params,
        query: {}
    };
}

module.exports = APIRequest;