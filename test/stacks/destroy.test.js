var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('../utils');
var _ = require('lodash');

var apiware = require('../../lib/apiware');
var stack = require('../../lib/stack');
var errors = require('ghost-ignition').errors;

var sandbox = sinon.sandbox.create();

describe('Stack: destroy', function () {
    var destroyStack, req, res;

    afterEach(function () {
        sandbox.restore();
    });

    beforeEach(function () {
        var fakeModel = utils.fakeModel({
            destroy: sandbox.stub().resolves(),
            otherMethod: sandbox.stub().resolves()
        });

        req = {
            model: fakeModel,
            params: {identifier: 'abc'},
            options: {}
        };
        res = {};

        // Create a spy version of the stack
        destroyStack = {};
        _.forEach(apiware.destroy, function (value, key) {
            destroyStack[key] = sandbox.spy(value);
        });
    });

    it('Calls the methods in order', function (done) {
        stack.handle(_.values(destroyStack), req, res, function finishing(err, apiReq, apiRes) {
            if (err) {
                return done(err);
            }

            expect(apiRes.exec).to.exist;
            expect(apiRes.exec).to.have.property('method', 'destroy');
            expect(apiRes.exec).to.have.property('payload');
            expect(apiRes.exec).to.have.deep.property('payload.id', 'abc');

            expect(destroyStack.permissions).to.have.been.calledOnce;
            expect(destroyStack.permissions).to.have.been.calledWith(req, res);
            expect(destroyStack.destroy).to.have.been.calledOnce;
            expect(destroyStack.destroy).to.have.been.calledWith(req, res);
            expect(destroyStack.destroy).to.have.been.calledAfter(destroyStack.permissions);

            done();
        });
    });

    it('Calls the model.destroy method by default', function (done) {
        stack.handle(_.values(destroyStack), req, res, function finishing(err, apiReq, apiRes) {
            if (err) {
                return done(err);
            }

            expect(apiRes.exec).to.exist;
            expect(apiRes.exec).to.have.property('method', 'destroy');
            expect(apiRes.exec).to.have.property('payload');
            expect(apiRes.exec).to.have.deep.property('payload.id', 'abc');

            expect(req.model.destroy).to.have.been.calledOnce;
            expect(req.model.destroy).to.have.been.calledWith(apiRes.exec.payload);

            done();
        });
    });


    it('Can override the model.destroy method', function (done) {
        req.options.destroyMethod = 'otherMethod';

        stack.handle(_.values(destroyStack), req, res, function finishing(err, apiReq, apiRes) {
            if (err) {
                return done(err);
            }

            expect(apiRes.exec).to.exist;
            expect(apiRes.exec).to.have.property('method', 'otherMethod');
            expect(apiRes.exec).to.have.property('payload');
            expect(apiRes.exec).to.have.deep.property('payload.id', 'abc');

            expect(req.model.destroy).to.have.not.been.called;
            expect(req.model.otherMethod).to.have.been.calledOnce;
            expect(req.model.otherMethod).to.have.been.calledWith(apiRes.exec.payload);

            done();
        });
    });

    it('catches bookshelf no rows errors and converts them to ignition errors', function (done) {
        req.model.destroy.rejects(new req.model.NoRowsDeletedError());

        stack.handle(_.values(destroyStack), _.cloneDeep(req), _.cloneDeep(res), function finishing(err) {
            if (err) {
                expect(err).to.be.an.IgnitionError('NotFoundError');

                expect(destroyStack.permissions).to.have.been.calledOnce;
                expect(destroyStack.destroy).to.have.been.calledOnce;

                return done();
            }

            done('This should have thrown an error');
        });
    });

    it('catches but does not convert unknown errors', function (done) {
        req.model.destroy.rejects(new Error('Unknown'));

        stack.handle(_.values(destroyStack), _.cloneDeep(req), _.cloneDeep(res), function finishing(err) {
            if (err) {
                expect(err).to.not.be.an.instanceof(errors.IgnitionError);
                expect(err.message).to.eql('Unknown');

                expect(destroyStack.permissions).to.have.been.calledOnce;
                expect(destroyStack.destroy).to.have.been.calledOnce;

                return done();
            }

            done('This should have thrown an error');
        });
    });

    it('Errors if there is no identifier', function (done) {
        delete req.params.identifier;

        stack.handle(_.values(destroyStack), _.cloneDeep(req), _.cloneDeep(res), function finishing(err) {
            if (err) {
                expect(err).to.be.an.IgnitionError('BadRequestError', /identifier/);
                return done();
            }

            done('This should have thrown an error');
        });
    });
});