var debug = require('debug')('ebja:response');

// @TODO resolve this into a sensible signature
function APIResponse(request, params, options) {
    debug('APIResponse');
    return {
        request: request,
        query: {},
        model: {},
        type: params.resourceType,
        options: options.mapperOptions,
        mapperOptions: {}
    };
}

module.exports = APIResponse;