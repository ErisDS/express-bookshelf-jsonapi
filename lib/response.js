var debug = require('debug')('ebja:response');

function APIResponse(request, params, options) {
    debug('APIResponse');
    return {
        request: request,
        query: {},
        model: {},
        type: params.resourceType,
        mapperOptions: options.mapperOptions
    };
}

module.exports = APIResponse;