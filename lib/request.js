var debug = require('debug')('ebja:request');

function APIRequest(model, modelMethod, params) {
    debug('APIRequest');
    return {
        model: model,
        modelMethod: modelMethod,
        options: {},
        params: params,
        query: {}
    };
}

module.exports = APIRequest;