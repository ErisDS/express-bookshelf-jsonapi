'use strict';
var debug = require('ghost-ignition').debug('response');
var _ = require('lodash');
var Mapper = require('./vendor/jsonapi-mapper');

function getType(request) {
    if (request.options.response.type) {
        return request.options.response.type;
    }
    return request.params.relationshipType || request.params.resourceType;
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
        this.type = getType(request);
        // Various convoluted settings/options that get passed to the jsonapi mapper when formatting
        this.serializerOptions = _.pick(request.options.response, Mapper.knownSerializerOptions);
        this.mapperOptions = _.pick(request.options.response, Mapper.knownMapperOptions);
        // An array of executed model methods
        this.exec = [];
    }
}

module.exports = APIResponse;