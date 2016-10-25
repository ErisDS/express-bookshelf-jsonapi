var http = exports;
var _private = {};
var debug = require('debug')('ebja:http');
var queryParser = require('./vendor/jsonapi-query-parser');
var formatter = require('./format');
var APIRequest = require('./request');
var APIResponse = require('./response');

_private.toAPI = function toAPI(api, req, options) {
    var params = queryParser.parseRequest(req.url);

    debug('CONVERT to API', api, params, options);
    var apiRequest = APIRequest(api.models[options.model], options, params);
    var apiResponse = APIResponse(apiRequest);

    return [
        apiRequest,
        apiResponse
    ];
};

_private.fromAPI = function fromAPI(api, apiReq, apiRes) {
    debug('CONVERT to HTTP');
    return formatter(api, apiReq, apiRes);
};

http.adapter = function adapter(api, options, req, res, next) {
    var args = _private.toAPI(api, req, options);
    var callback = function callback(apiReq, apiRes) {
        debug('HTTP callback');
        var json = _private.fromAPI(api, apiReq, apiRes);

        debug('Returning to express');
        return res.json(json);
    };

    args.push(callback);
    return args;
};

