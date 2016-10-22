var debug = require('debug')('ebja:endpoint');
var http = require('./http');
var IncomingMessage = require('http').IncomingMessage;
var handleQueue = require('./queue');

module.exports = function Endpoint(api, options) {
    debug('returning endpoint function', options);
    var self = this;
    var queue = [];

    function doEndpoint(apiReq, apiRes, cb) {
        debug('Executing apiware');

        queue.push(require('./apiware/modelQuery'));
        handleQueue(queue, apiReq, apiRes, cb);
    }

    return function endpoint() {
        var args = Array.from(arguments);
        debug('endpoint start');

        if (args.length === 3 && args[0] instanceof IncomingMessage) {
            args.unshift(options);
            args.unshift(api);
            debug('endpoint apply with adapter');
            return doEndpoint.apply(self, http.adapter.apply(self, args));
        }

        throw new Error('Unimplemented!');
    }
};