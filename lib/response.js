var debug = require('ghost-ignition').debug('response');

function getType(params) {
    return params.relationshipType || params.resourceType;
}

// API Response
// @TODO resolve this into a sensible signature
// @TODO make this a proper class/object
// This object is initially constructed from just the request object
function APIResponse(request) {
    debug('APIResponse');
    return {
        // A reference to the request object
        request: request,
        // The result of the query (bookshelf model)
        model: {},
        // The type of object that we are returning
        type: getType(request.params)
    };
}

module.exports = APIResponse;