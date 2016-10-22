var debug = require('debug')('ebja:request');

function APIRequest(model, modelMethod, params) {
    debug('APIRequest');
    return {
        model: model,
        modelMethod: modelMethod,
        params: params
    };
}

module.exports = APIRequest;