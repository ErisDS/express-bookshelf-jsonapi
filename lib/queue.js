var debug = require('debug')('ebja:stack');

module.exports = function handleQueue(queue, apiReq, apiRes, cb) {
    debug('handleQueue');
    var idx = 0;
    apiNext();

    function apiNext() {
        debug('handleQueue calling next');
        var nextFunc = queue[idx];
        idx += 1;

        if (!nextFunc) {
            debug('handleQueue calling original next');
            return cb(apiReq, apiRes);
        }

        return nextFunc(apiReq, apiRes, apiNext);
    }
};