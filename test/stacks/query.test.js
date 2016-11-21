var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('../utils');
var _ = require('lodash');

var apiware = require('../../lib/apiware');
var stack = require('../../lib/stack');
var errors = require('ghost-ignition').errors;

var sandbox = sinon.sandbox.create();

describe('Stack: query', function () {
    var queryStack, req, res;

    afterEach(function () {
        sandbox.restore();
    });


    beforeEach(function () {
        var fakeModel = utils.fakeModel({
            getOne: sandbox.stub().resolves(),
            getPage: sandbox.stub().resolves(),
            otherMethod: sandbox.stub().resolves()
        });

        req = {
            model: fakeModel,
            options: {},
            params: {
                queryData: {
                    page: {}
                }
            },
            query: {
                data: {},
                options: {}
            }
        };
        res = {
            exec: []
        };

        // Create a spy version of the stack
        queryStack = {};
        _.forEach(apiware.query, function (value, key) {
            queryStack[key] = sandbox.spy(value);
        });
    });

    it('Calls the methods in order', function (done) {
        stack.handle(_.values(queryStack), req, res, function finishing(err, apiReq, apiRes) {
            if (err) {
                return done(err);
            }

            expect(queryStack.validate).to.have.been.calledOnce;
            expect(queryStack.paramsData).to.have.been.calledOnce;
            expect(queryStack.paramsInclude).to.have.been.calledOnce;
            expect(queryStack.paramsPage).to.have.been.calledOnce;
            expect(queryStack.paramsFilter).to.have.been.calledOnce;
            expect(queryStack.paramsFields).to.have.been.calledOnce;
            expect(queryStack.paramsSort).to.have.been.calledOnce;
            expect(queryStack.permissions).to.have.been.calledOnce;
            expect(queryStack.query).to.have.been.calledOnce;
            expect(queryStack.process).to.have.been.calledOnce;
            expect(queryStack.format).to.have.been.calledOnce;

            sinon.assert.callOrder(
                queryStack.validate,
                queryStack.paramsData,
                queryStack.paramsInclude,
                queryStack.paramsPage,
                queryStack.paramsFilter,
                queryStack.paramsFields,
                queryStack.paramsSort,
                queryStack.permissions,
                queryStack.query,
                queryStack.process,
                queryStack.format
            );

            done();
        });
    });

    it('Calls the getOne query method by default', function (done) {
        stack.handle(_.values(queryStack), req, res, function finishing(err, apiReq, apiRes) {
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

    it('Can set the query method', function (done) {
        req.options.queryMethod = 'otherMethod';

        stack.handle(_.values(queryStack), req, res, function finishing(err, apiReq, apiRes) {
            if (err) {
                return done(err);
            }

            expect(apiRes.exec[0]).to.have.property('method', 'otherMethod');
            expect(apiRes.exec[0]).to.have.property('payload');
            expect(apiRes.exec[0]).to.have.deep.property('payload.data');
            expect(apiRes.exec[0]).to.have.deep.property('payload.options');

            expect(req.model.otherMethod).to.have.been.calledOnce;
            expect(req.model.otherMethod).to.have.been.calledWith(apiRes.exec[0].payload);
            expect(queryStack.query).to.have.been.calledOnce;

            done();
        });
    });

    it('Passes through the identifier, if there is one', function (done) {
        req.params.identifier = 'cba';

        stack.handle(_.values(queryStack), req, res, function finishing(err, apiReq, apiRes) {
            if (err) {
                return done(err);
            }

            expect(apiRes.exec).to.be.an('array').and.have.lengthOf(1);
            expect(apiRes.exec[0]).to.have.property('method', 'getOne');
            expect(apiRes.exec[0]).to.have.property('payload');
            expect(apiRes.exec[0]).to.have.deep.property('payload.data');
            expect(apiRes.exec[0]).to.have.deep.property('payload.options');
            expect(apiRes.exec[0]).to.have.deep.property('payload.data.id', 'cba');

            expect(req.model.getOne).to.have.been.calledOnce;
            expect(req.model.getOne).to.have.been.calledWith(apiRes.exec[0].payload);
            expect(queryStack.query).to.have.been.calledOnce;

            done();
        });
    });

    it('catches bookshelf no rows errors and converts them to ignition errors', function (done) {
        req.model.getOne.rejects(new req.model.NotFoundError());

        stack.handle(_.values(queryStack), _.cloneDeep(req), _.cloneDeep(res), function finishing(err, apiReq, apiRes) {
            if (err) {
                expect(err).to.be.an.IgnitionError('NotFoundError');

                expect(req.model.getOne).to.have.been.calledOnce;
                expect(req.model.getOne).to.have.been.calledWith(apiRes.exec[0].payload);
                expect(queryStack.query).to.have.been.called;
                expect(queryStack.process).to.have.not.been.called;

                return done();
            }

            done('This should have thrown an error');
        });
    });

    it('catches but does not convert unknown errors', function (done) {
        req.model.getOne.rejects(new Error('Unknown'));

        stack.handle(_.values(queryStack), _.cloneDeep(req), _.cloneDeep(res), function finishing(err, apiReq, apiRes) {
            if (err) {
                expect(err).to.not.be.an.instanceof(errors.IgnitionError);
                expect(err.message).to.eql('Unknown');

                expect(req.model.getOne).to.have.been.calledOnce;
                expect(req.model.getOne).to.have.been.calledWith(apiRes.exec[0].payload);
                expect(queryStack.query).to.have.been.called;
                expect(queryStack.process).to.have.not.been.called;

                return done();
            }

            done('This should have thrown an error');
        });
    });
});