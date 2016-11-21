'use strict';
module.exports.handle = function handleStack(stack, apiReq, apiRes, cb) {
    var idx = 0;

    if (stack.length === 0) {
        return cb(null, apiReq, apiRes);
    }

    apiNext();

    function apiNext(err) {
        var nextFunc = stack[idx];
        idx += 1;

        if (!nextFunc) {
            return cb(err, apiReq, apiRes);
        }

        if (err) {
            apiRes.err = err;
            return cb(err, apiReq, apiRes);
        }

        try {
            nextFunc(apiReq, apiRes, apiNext);
        } catch (err) {
            cb(err, apiReq, apiRes);
        }
    }
};