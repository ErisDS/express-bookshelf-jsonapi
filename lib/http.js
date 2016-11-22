'use strict';

var http = exports;
var _private = {};
var debug = require('ghost-ignition').debug('http');
var queryParser = require('./vendor/jsonapi-query-parser');
var formatter = require('./format');
var APIRequest = require('./request');
var APIResponse = require('./response');

// TODO: do this based on req.method instead of apiReq.options.method?
var successCodes = {
    GET: 200,
    POST: 201,
    DELETE: 204,
    PATCH: 200
};

_private.toAPI = function toAPI(api, req, options) {
    var params = queryParser.parseRequest(req.url);
    var payload = req.body;
    var source = req.user;

    debug('CONVERT to API');
    var apiRequest = new APIRequest(api.models[options.model], options, params, payload, source);
    var apiResponse = new APIResponse(apiRequest);

    return [
        apiRequest,
        apiResponse
    ];
};

_private.fromAPI = function fromAPI(api, apiReq, apiRes) {
    debug('CONVERT to HTTP');
    return {
        data: formatter(api, apiReq, apiRes),
        status: successCodes[apiReq.options.method] || 200
    };
};

http.adapter = function adapter(api, options, req, res, next) {
    var args = _private.toAPI(api, req, options);
    var callback = function callback(err, apiReq, apiRes) {
        debug('HTTP callback');
        if (err) {
            debug('Got an error');
            return next(err);
        }

        var json = _private.fromAPI(api, apiReq, apiRes);

        if (json) {
            debug('Returning JSON');
            return res.status(json.status).json(json.data);
        }

        return next();
    };

    args.push(callback);
    return args;
};

