var errors = require('ghost-ignition').errors;
// Assert Text Response
//
// Usage:
//   expect(response).to.be.an.ignitionError(type);
//
module.exports = function ignitionError(chai, utils) {
    var Assertion = chai.Assertion;

    Assertion.addMethod('IgnitionError', function (type, message) {
        var error = this._obj;

        new Assertion(error).to.be.an.instanceof(errors.IgnitionError);
        new Assertion(error).to.have.a.property('errorType', type);
        new Assertion(error).to.have.a.property('message');
        if (message) {
            new Assertion(error.message).to.match(message);
        }
    });
};