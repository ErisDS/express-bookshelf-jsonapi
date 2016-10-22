var http = exports;
var _private = {};
var debug = require('debug')('ebja:http');
var APIRequest = require('./request');
var APIResponse = require('./response');

_private.toAPI = function toAPI(api, req, options) {
    debug('CONVERT to API', api, req.parsedParams, options);
    var apiRequest = APIRequest(api.models[options.model], options.modelMethod, req.parsedParams);
    var apiResponse = APIResponse(apiRequest, req.parsedParams, options);

    return [
        apiRequest,
        apiResponse
    ];
};

_private.fromAPI = function fromAPI(apiRes) {
    debug('CONVERT to HTTP');
    return {
        model: apiRes.resultModel,
        type: apiRes.type,
        options: apiRes.mapperOptions
    }
};

http.adapter = function adapter(api, options, req, res, next) {
    var args = _private.toAPI(api, req, options);
    var callback = function callback(apiReq, apiRes) {
        debug('HTTP callback');
        res.apiResult = _private.fromAPI(apiRes);

        debug('Returning to express');
        return next();
    };

    args.push(callback);
    return args;
};

