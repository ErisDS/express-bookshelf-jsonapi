var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('./utils');

var stack = require('../lib/stack');

var sandbox = sinon.sandbox.create();

describe('Stack handler', function () {
    var req, res;

    beforeEach(function () {
        req = {a: true};
        res = {b: false};
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Errors with no arguments', function () {
        expect(stack.handle).to.throw(TypeError);
    });

    it('Works with an empty array, returning req and res', function (done) {
        var req = {a: true};
        var res = {b: false};
        stack.handle([], req, res, function finished() {
            expect(arguments).to.have.lengthOf(2);
            expect(arguments[0]).to.eql(req);
            expect(arguments[1]).to.eql(res);
            done();
        });
    });

    it('Calls the functions in order', function (done) {
        var a = sandbox.stub().callsArg(2);
        var b = sandbox.stub().callsArg(2);
        var testStack = [a, b];

        stack.handle(testStack, req, res, function finished() {
            expect(a).to.have.been.calledOnce;
            expect(a).to.have.been.calledWith(req, res);
            expect(b).to.have.been.calledOnce;
            expect(b).to.have.been.calledWith(req, res);
            expect(a).to.have.been.calledBefore(b);

            expect(arguments).to.have.lengthOf(2);
            expect(arguments[0]).to.eql(req);
            expect(arguments[1]).to.eql(res);
            done();
        });
    });

    it('Returns req with an error if a stack method errors', function (done) {
        var a = sandbox.stub().callsArg(2);
        var b = sandbox.stub().callsArgWith(2, new Error('I broked!'));
        var testStack = [a, b];

        stack.handle(testStack, req, res, function finished() {
            expect(a).to.have.been.calledOnce;
            expect(a).to.have.been.calledWith(req, res);
            expect(b).to.have.been.calledOnce;
            expect(b).to.have.been.calledWith(req, res);
            expect(a).to.have.been.calledBefore(b);

            expect(arguments).to.have.lengthOf(2);
            expect(arguments[0]).to.eql(req);
            expect(arguments[1]).to.eql(res);
            expect(arguments[1]).to.have.property('err');

            done();
        });
    });

    it('Does not call methods after a stack method errors', function (done) {
        var a = sandbox.stub().callsArg(2);
        var b = sandbox.stub().callsArgWith(2, new Error('I broked!'));
        var c = sandbox.stub().callsArg(2);
        var testStack = [a, b, c];

        stack.handle(testStack, req, res, function finished() {
            expect(a).to.have.been.calledOnce;
            expect(a).to.have.been.calledWith(req, res);
            expect(b).to.have.been.calledOnce;
            expect(b).to.have.been.calledWith(req, res);
            expect(c).to.not.have.been.called;
            expect(a).to.have.been.calledBefore(b);

            expect(arguments).to.have.lengthOf(2);
            expect(arguments[0]).to.eql(req);
            expect(arguments[1]).to.eql(res);
            expect(arguments[1]).to.have.property('err');

            done();
        });
    });
});