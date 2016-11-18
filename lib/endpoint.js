var debug = require('ghost-ignition').debug('endpoint');
var _ = require('lodash');
var http = require('./http');
var IncomingMessage = require('http').IncomingMessage;
var queue = require('./queue');
var apiWare = require('./apiware');

var types = {
    GET: 'query',
    POST: 'action',
    PUT: 'action',
    PATCH: 'action',
    DELETE: 'destroy'
};

// @TODO how to keep track of the resource that an endpoint belongs to?
var Endpoint = function Endpoint(api, options) {
    var self = this;
    this.api = api;
    this.options = options;
    this.method = options.method || 'GET';
    this.type = types[this.method];

    this.queue = _.clone(apiWare[this.type]);

    debug('QUEUE TYPE', this.type);

    // Override the queue functions with any matching functions passed in as options
    // Matches are done between queue keys and option keys
    _.intersection(Object.keys(this.queue), Object.keys(this.options)).forEach(function handleMatch(optionQueueMatch) {
        self.queue[optionQueueMatch] = self.options[optionQueueMatch];
    });

    debug('QUEUE', this.queue);

    function doEndpoint(apiReq, apiRes, cb) {
        debug('Executing apiware queue');
        queue.handle(_.values(self.queue), apiReq, apiRes, cb);
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
