'use strict';
var debug = require('ghost-ignition').debug('request');

// @TODO resolve this into a sensible signature
class APIRequest {
    constructor(model, options, params, payload, source) {
        debug('APIRequest');

        // Ensure we have response options
        options.response = options.response || {};

        // The bookshelf model for which this request is being made
        this.model = model;
        // The model method that will be called to do a query
        this.modelMethod = options.modelMethod;
        // Any other options passed in
        this.options = options;
        // Parameters
        this.params = params;
        // Payload
        this.payload = payload;
        // The query that is going to be passed to the model method
        this.query = {
            data: {},
            options: {}
        };
        // Who or what is making the request (usually some sort of user)
        this.source = source;
    }
}

module.exports = APIRequest;