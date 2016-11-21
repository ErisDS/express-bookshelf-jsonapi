'use strict';
module.exports.handle = function handleStack(stack, apiReq, apiRes, cb) {
    var idx = 0;
    apiNext();

    function apiNext(err) {

        if (err) {
            apiRes.err = err;
            return cb(apiReq, apiRes);
        }

        var nextFunc = stack[idx];
        idx += 1;

        if (!nextFunc) {
            return cb(apiReq, apiRes);
        }

        return nextFunc(apiReq, apiRes, apiNext);
    }
};