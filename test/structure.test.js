var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('./utils');

// This is what calling models require
var ebja = require('../index');
var queue = require('../lib/queue');
var http = require('../lib/http');

var sandbox = sinon.sandbox.create();

describe('Structure: Method Signatures', function () {

    afterEach(function () {
        sandbox.restore();
    });

    describe('EBJA', function () {
        it('exposes a plugin', function () {
            expect(ebja).to.have.ownProperty('plugin');
            expect(ebja.plugin).to.be.a.Function;
        });

        it('plugin also registers plugins if they are not yet registered', function () {
            var fakeBookshelf = {
                Model: {
                    extend: sandbox.spy()
                },
                plugin: sandbox.spy()

            };

            ebja.plugin(fakeBookshelf);

            expect(fakeBookshelf.plugin).to.have.been.calledTwice;
            expect(fakeBookshelf.plugin.firstCall).to.have.been.calledWith(require('bookshelf-jsonapi-params'));
            expect(fakeBookshelf.plugin.secondCall).to.have.been.calledWith('pagination');
        });

        it('plugin does not register plugins if they are already registered', function () {
            var fakeBookshelf = {
                Model: {
                    extend: sandbox.stub(),
                    fetchJsonApi: '',
                    fetchPage: ''
                },
                plugin: sandbox.spy()

            };

            ebja.plugin(fakeBookshelf);

            expect(fakeBookshelf.plugin).to.have.not.been.called;
        });

        it('calls extend with correct properties', function () {
            var fakeBookshelf = {
                Model: {
                    extend: sandbox.stub().returnsThis()
                },
                plugin: sandbox.spy()

            };

            ebja.plugin(fakeBookshelf);

            expect(fakeBookshelf.Model.extend).to.have.been.calledOnce;
            expect(fakeBookshelf.Model.extend.firstCall.args[0]).to.eql({jsonapi: true});
            expect(fakeBookshelf.Model.extend.firstCall.args[1]).to.have.property('getOne');
            expect(fakeBookshelf.Model.extend.firstCall.args[1]).to.have.property('getPage');
        });
    });

    describe('API', function () {
        it('throws error with no config', function () {
            function setupEbja() {
                return ebja();
            }

            expect(setupEbja).to.throw(Error);
            expect(setupEbja).to.throw(/requires configuration/);
        });

        it('throws error with no baseUrl', function () {
            function setupEbja() {
                return ebja({
                    models: []
                });
            }
            expect(setupEbja).to.throw(Error);
            expect(setupEbja).to.throw(/requires a baseUrl/);
        });

        it('throws error with no models', function () {
            function setupEbja() {
                return ebja({
                    baseUrl: 'thing'
                });
            }
            expect(setupEbja).to.throw(Error);
            expect(setupEbja).to.throw(/requires bookshelf models/);
        });

        it('can setup with all config values', function () {
            function setupEbja() {
                return ebja({
                    baseUrl: 'thing',
                    models: []
                });
            }

            expect(setupEbja).to.not.throw(Error);
        });

        it('setupa api exposes public methods', function () {
            var api = ebja({
                baseUrl: 'thing',
                models: []
            });

            expect(api).to.have.ownProperty('Endpoint');
            expect(api).to.have.ownProperty('Resource');

            expect(api.Endpoint).to.be.a('function');
            expect(api.Endpoint).to.have.property('name', 'registerEndpoint');
            expect(api.Resource).to.be.a('function');
            expect(api.Resource).to.have.property('name', 'registerResource');

            //  TODO
            // expect(api).to.be.instanceof(require('../lib/api'));
        });
    });

    describe('Endpoint', function () {
        var api;
        beforeEach(function () {
            api = ebja({
                baseUrl: 'thing',
                models: []
            });
        });

        afterEach(function () {
            sandbox.restore();
        });

        it('throws error with no options', function () {
            function setupEndpoint() {
                api.Endpoint();
            }

            expect(setupEndpoint).to.throw(Error);
        });

        it('can register an endpoint with empty options object', function () {
            function setupEndpoint() {
                return api.Endpoint({});
            }

            expect(setupEndpoint).to.not.throw(Error);
        });

        it('an endpoint is a handler function', function () {
            var ep = api.Endpoint({});
            expect(ep).to.be.a.Function;
            expect(ep).to.have.property('name', 'handler');
        });

        it('endpoint handler function throws error without arguments', function () {
            var ep = api.Endpoint({});
            expect(ep).to.throw(Error);
        });

        it('endpoint handler can be called as middleware', function (done) {
            var options = {};
            var ep = api.Endpoint(options);
            var req = {__proto__: require('http').IncomingMessage.prototype};
            var res = {};
            var next = function callback() {
                expect(httpStub).to.have.been.calledOnce;
                expect(httpStub).to.have.been.calledWith(api, options, req, res, next);
                expect(queueStub).to.have.been.calledOnce;

                done();
            };

            var queueStub = sandbox.stub(queue, 'handle').callsArg(3);
            var httpStub = sandbox.stub(http, 'adapter').returns([{}, {}, next]);

            ep(req, res, next);
        });
    });

    describe('Resource', function () {
        var api;
        beforeEach(function () {
            api = ebja({
                baseUrl: 'thing',
                models: []
            });
        });

        afterEach(function () {
            sandbox.restore();
        });

        it('throws error with no options', function () {
            function setupResource() {
                api.Resource();
            }

            expect(setupResource).to.throw(Error);
        });

        it('can register an endpoint with empty options object', function () {
            function setupResource() {
                return api.Resource({});
            }

            expect(setupResource).to.not.throw(Error);
        });

        it('resource is just an object with an Endpoint function', function () {
            var rs = api.Resource({});

            expect(rs).to.be.a('object');
            expect(rs).to.have.property('Endpoint');
            expect(rs.Endpoint).to.be.a('function');
            expect(rs.Endpoint).to.have.property('name', 'registerEndpoint');
        });

        describe('Resource.Endpoint', function () {
            var rs;
            beforeEach(function () {
                rs = api.Resource({});
            });


            it('throws error with no options', function () {
                function setupEndpoint() {
                    rs.Endpoint();
                }

                expect(setupEndpoint).to.throw(Error);
            });

            it('can register an endpoint with empty options object', function () {
                function setupEndpoint() {
                    return rs.Endpoint({});
                }

                expect(setupEndpoint).to.not.throw(Error);
            });

            it('an endpoint is a handler function', function () {
                var ep = rs.Endpoint({});
                expect(ep).to.be.a.Function;
                expect(ep).to.have.property('name', 'handler');
            });

            it('endpoint handler function throws error without arguments', function () {
                var ep = rs.Endpoint({});
                expect(ep).to.throw(Error);
            });

            it('endpoint handler can be called as middleware', function (done) {
                var options = {};
                var ep = rs.Endpoint(options);
                var req = {__proto__: require('http').IncomingMessage.prototype};
                var res = {};
                var next = function callback() {
                    expect(httpStub).to.have.been.calledOnce;
                    expect(httpStub).to.have.been.calledWith(api, options, req, res, next);
                    expect(queueStub).to.have.been.calledOnce;

                    done();
                };

                var queueStub = sandbox.stub(queue, 'handle').callsArg(3);
                var httpStub = sandbox.stub(http, 'adapter').returns([{}, {}, next]);

                ep(req, res, next);
            });
        });
    });
});
