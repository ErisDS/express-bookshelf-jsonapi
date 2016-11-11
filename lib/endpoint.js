var debug = require('ghost-ignition').debug('endpoint');
var _ = require('lodash');
var http = require('./http');
var IncomingMessage = require('http').IncomingMessage;
var handleQueue = require('./queue');
var apiWare = require('./apiware');

// @TODO how to keep track of the resource that an endpoint belongs to?
var Endpoint = function Endpoint(api, options) {
    var self = this;
    this.api = api;
    this.options = options;
    this.queue = _.keyBy(_.clone(apiWare), function (fn) {
        return fn.name;
    });

    function doEndpoint(apiReq, apiRes, cb) {
        debug('Executing apiware queue');
        handleQueue(_.values(self.queue), apiReq, apiRes, cb);
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

    handler.use = function use(name, func) {
        self.queue[name] = func;
    };

    return handler;
};

module.exports = Endpoint;
