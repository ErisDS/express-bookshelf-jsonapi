module.exports = function handleQueue(queue, apiReq, apiRes, cb) {
    var idx = 0;
    apiNext();

    function apiNext() {
        var nextFunc = queue[idx];
        idx += 1;

        if (!nextFunc) {
            return cb(apiReq, apiRes);
        }

        return nextFunc(apiReq, apiRes, apiNext);
    }
};