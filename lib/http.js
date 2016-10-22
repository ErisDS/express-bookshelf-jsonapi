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
    var apiRequest = APIRequest(api.baseUrl, api.models[options.model], options.modelMethod, params);
    var apiResponse = APIResponse(apiRequest, params, options);

    return [
        apiRequest,
        apiResponse
    ];
};

_private.fromAPI = function fromAPI(apiReq, apiRes) {
    debug('CONVERT to HTTP');
    return formatter(apiReq, apiRes);
};

http.adapter = function adapter(api, options, req, res, next) {
    var args = _private.toAPI(api, req, options);
    var callback = function callback(apiReq, apiRes) {
        debug('HTTP callback');
        var json = _private.fromAPI(apiReq, apiRes);

        debug('Returning to express');
        return res.json(json);
    };

    args.push(callback);
    return args;
};

