'use strict';
var debug = require('ghost-ignition').debug('response');

function getType(params) {
    return params.relationshipType || params.resourceType;
}

// API Response
// @TODO resolve this into a sensible signature
// This object is initially constructed from just the request object
class APIResponse {
    constructor(request) {
        debug('APIResponse');
        // A reference to the request object
        this.request = request;
        // The result of the query (bookshelf model)
        this.model = {};
        // The type of object that we are returning
        this.type = getType(request.params);
        // An array of executed model methods
        this.exec = [];
    }
}

module.exports = APIResponse;