var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('../utils');
var _ = require('lodash');

var apiware = require('../../lib/apiware');
var stack = require('../../lib/stack');
var errors = require('ghost-ignition').errors;

var sandbox = sinon.sandbox.create();

describe('Stack: action', function () {
    var actionStack, req, res;

    afterEach(function () {
        sandbox.restore();
    });


    beforeEach(function () {
        var fakeModel = utils.fakeModel({
            getOne: sandbox.stub().resolves(),
            otherMethod: sandbox.stub().resolves({id: 'cde'})
        });

        req = {
            model: fakeModel,
            options: {},
            params: {},
            query: {
                data: {},
                options: {}
            }
        };
        res = {
            exec: []
        };

        // Create a spy version of the stack
        actionStack = {};
        _.forEach(apiware.action, function (value, key) {
            actionStack[key] = sandbox.spy(value);
        });
    });

    it('Calls the methods in order', function (done) {
        stack.handle(_.values(actionStack), req, res, function finishing(err, apiReq, apiRes) {
            if (err) {
                return done(err);
            }

            expect(actionStack.validate).to.have.been.calledOnce;
            expect(actionStack.payload).to.have.been.calledOnce;
            expect(actionStack.permissions).to.have.been.calledOnce;
            expect(actionStack.action).to.have.been.calledOnce;
            expect(actionStack.query).to.have.been.calledOnce;
            expect(actionStack.process).to.have.been.calledOnce;
            expect(actionStack.format).to.have.been.calledOnce;

            sinon.assert.callOrder(
                actionStack.validate,
                actionStack.payload,
                actionStack.permissions,
                actionStack.action,
                actionStack.query,
                actionStack.process,
                actionStack.format
            );

            done();
        });
    });

    it('Calls no action and the getOne query method by default', function (done) {
        stack.handle(_.values(actionStack), req, res, function finishing(err, apiReq, apiRes) {
            if (err) {
                return done(err);
            }

            expect(apiRes.exec).to.be.an('array').and.have.lengthOf(1);
            expect(apiRes.exec[0]).to.have.property('method', 'getOne');
            expect(apiRes.exec[0]).to.have.property('payload');
            expect(apiRes.exec[0]).to.have.deep.property('payload.data');
            expect(apiRes.exec[0]).to.have.deep.property('payload.options');

            done();
        });
    });

    it('Can set the action method', function (done) {
        req.options.actionMethod = 'otherMethod';

        stack.handle(_.values(actionStack), req, res, function finishing(err, apiReq, apiRes) {
            if (err) {
                return done(err);
            }

            expect(apiRes.exec).to.be.an('array').and.have.lengthOf(2);
            expect(apiRes.exec[0]).to.have.property('method', 'otherMethod');
            expect(apiRes.exec[0]).to.have.property('payload');

            expect(apiRes.exec[1]).to.have.property('method', 'getOne');
            expect(apiRes.exec[1]).to.have.property('payload');
            expect(apiRes.exec[1]).to.have.deep.property('payload.data');
            expect(apiRes.exec[1]).to.have.deep.property('payload.options');

            expect(req.model.otherMethod).to.have.been.calledOnce;
            expect(req.model.otherMethod).to.have.been.calledWith(apiRes.exec[0].payload);
            expect(actionStack.action).to.have.been.calledOnce;
            expect(actionStack.query).to.have.been.calledOnce;

            done();
        });
    });

    it('Passes through the identifier, if there is one', function (done) {
        req.params.identifier = 'cba';
        req.options.actionMethod = 'otherMethod';

        stack.handle(_.values(actionStack), req, res, function finishing(err, apiReq, apiRes) {
            if (err) {
                return done(err);
            }

            expect(apiRes.exec).to.be.an('array').and.have.lengthOf(2);
            expect(apiRes.exec[0]).to.have.property('method', 'otherMethod');
            expect(apiRes.exec[0]).to.have.property('payload');
            expect(apiRes.exec[0]).to.have.deep.property('payload.id', 'cba');

            expect(apiRes.exec[1]).to.have.property('method', 'getOne');
            expect(apiRes.exec[1]).to.have.property('payload');
            expect(apiRes.exec[1]).to.have.deep.property('payload.data');
            expect(apiRes.exec[1]).to.have.deep.property('payload.options');

            expect(req.model.otherMethod).to.have.been.calledOnce;
            expect(req.model.otherMethod).to.have.been.calledWith(apiRes.exec[0].payload);
            expect(actionStack.action).to.have.been.calledOnce;
            expect(actionStack.query).to.have.been.calledOnce;

            done();
        });
    });

    it('catches bookshelf no rows errors and converts them to ignition errors', function (done) {
        req.options.actionMethod = 'otherMethod';
        req.model.otherMethod.rejects(new req.model.NoRowsUpdatedError());

        stack.handle(_.values(actionStack), _.cloneDeep(req), _.cloneDeep(res), function finishing(err, apiReq, apiRes) {
            if (err) {
                expect(err).to.be.an.IgnitionError('NotFoundError');

                expect(req.model.otherMethod).to.have.been.calledOnce;
                expect(req.model.otherMethod).to.have.been.calledWith(apiRes.exec[0].payload);
                expect(actionStack.action).to.have.been.calledOnce;
                expect(actionStack.query).to.have.not.been.called;


                return done();
            }

            done('This should have thrown an error');
        });
    });

    it('catches but does not convert unknown errors', function (done) {
        req.options.actionMethod = 'otherMethod';
        req.model.otherMethod.rejects(new Error('Unknown'));

        stack.handle(_.values(actionStack), _.cloneDeep(req), _.cloneDeep(res), function finishing(err, apiReq, apiRes) {
            if (err) {
                expect(err).to.not.be.an.instanceof(errors.IgnitionError);
                expect(err.message).to.eql('Unknown');

                expect(req.model.otherMethod).to.have.been.calledOnce;
                expect(req.model.otherMethod).to.have.been.calledWith(apiRes.exec[0].payload);
                expect(actionStack.action).to.have.been.calledOnce;
                expect(actionStack.query).to.have.not.been.called;

                return done();
            }

            done('This should have thrown an error');
        });
    });
});