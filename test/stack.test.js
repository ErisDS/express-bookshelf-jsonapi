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
            expect(arguments).to.have.lengthOf(3);
            expect(arguments[0]).to.not.exist;
            expect(arguments[1]).to.eql(req);
            expect(arguments[2]).to.eql(res);
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

            expect(arguments).to.have.lengthOf(3);
            expect(arguments[0]).to.not.exist;
            expect(arguments[1]).to.eql(req);
            expect(arguments[2]).to.eql(res);
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

            expect(arguments).to.have.lengthOf(3);
            expect(arguments[0]).to.exist;
            expect(arguments[0].message).to.eql('I broked!');
            expect(arguments[1]).to.eql(req);
            expect(arguments[2]).to.eql(res);

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

            expect(arguments).to.have.lengthOf(3);
            expect(arguments[0]).to.exist;
            expect(arguments[0].message).to.eql('I broked!');
            expect(arguments[1]).to.eql(req);
            expect(arguments[2]).to.eql(res);

            done();
        });
    });

    it('Does not call methods if callback method errors', function (done) {
        var a = sandbox.stub().callsArg(2);
        var b = sandbox.stub().callsArg(2);
        var testStack = [a, b];

        try {
            stack.handle(testStack, req, res, function finished() {
                throw new Error('HAHAHAHAH');
            });
        } catch(err) {
            expect(a).to.have.been.calledOnce;
            expect(b).to.have.been.calledOnce;
            done();
        }
    });
});