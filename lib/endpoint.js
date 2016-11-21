'use strict';
var debug = require('ghost-ignition').debug('endpoint');
var _ = require('lodash');
var http = require('./http');
var IncomingMessage = require('http').IncomingMessage;
var stack = require('./stack');
var apiWare = require('./apiware');

// @TODO come up with a better way to do this
// Inspect the request inside the HTTP layer? SO if it is a real-world GET request
// Or maybe use a different way to define which "type", like manually set the queue type
var types = {
    GET: 'query',
    POST: 'action',
    PUT: 'action',
    PATCH: 'action',
    DELETE: 'destroy'
};

function prepareStack(options) {
    var type = types[options.method || 'GET'];
    debug('STACK TYPE', type);
    var stack = _.clone(apiWare[type]);

    // Override the queue functions with any matching functions passed in as options
    // Matches are done between queue keys and option keys
    _.intersection(Object.keys(stack), Object.keys(options)).forEach(function handleMatch(optionsStackMatch) {
        stack[optionsStackMatch] = options[optionsStackMatch];
    });

    debug('STACK', stack);
    return stack;
}

// @TODO how to keep track of the resource that an endpoint belongs to?
var Endpoint = function Endpoint(api, options) {
    var self = this;
    this.api = api;
    this.options = options;
    this.stack = prepareStack(options);

    function doEndpoint(apiReq, apiRes, cb) {
        debug('Executing apiware stack');
        stack.handle(_.values(self.stack), apiReq, apiRes, cb);
    }

    // @TODO move this somewhere else?
    var handler = function handler() {
        debug('handling endpoint');
        var args = Array.from(arguments);

        // @TODO make this adapter logic a bit nicer
        if (args.length === 3 && args[0] instanceof IncomingMessage) {
            args.unshift(options);
            args.unshift(api);
            debug('endpoint apply with adapter');

            return doEndpoint.apply(self, http.adapter.apply(self, args));
        }

        throw new Error('Unimplemented!');
    };

    return handler;
};

module.exports = Endpoint;
