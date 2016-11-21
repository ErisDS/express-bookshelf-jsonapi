var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('../utils');

var payload = require('../../lib/apiware/payload');

var sandbox = sinon.sandbox.create();

describe('apiware: payload', function () {
    var req, res;

    afterEach(function () {
        sandbox.restore();
    });

    beforeEach(function () {
        req = {
            options: {},
            payload: {},
            query: {
                data: {},
                options: {}
            }
        };

        res = {
            exec: []
        };
    });

    it('does nothing for empty payloads', function (done) {
        payload(req, res, function next(err) {
            if (err) {
                done(err);
            }

            expect(req.query.data).to.an('object').and.be.empty;
            done();
        });
    });

    describe('data validation', function () {
        it('errors for payloads without a data param', function (done) {
            req.payload = {id: 'a1b'};

            payload(req, res, function next(err) {
                if (err) {
                    expect(err).to.be.an.IgnitionError('BadRequestError', /Malformed payload/);

                    return done();
                }

                done('This should have thrown an error');
            });
        });

        it('errors for payloads with a string data param', function (done) {
            req.payload = {data: 'a1b'};

            payload(req, res, function next(err) {
                if (err) {
                    expect(err).to.be.an.IgnitionError('BadRequestError', /Malformed payload/);

                    return done();
                }

                done('This should have thrown an error');
            });
        });

        it('errors for payloads with an empty array data param', function (done) {
            req.payload = {data: []};

            payload(req, res, function next(err) {
                if (err) {
                    expect(err).to.be.an.IgnitionError('BadRequestError', /Malformed payload/);

                    return done();
                }

                done('This should have thrown an error');
            });
        });

        it('errors for payloads with an empty object data param', function (done) {
            req.payload = {data: {}};

            payload(req, res, function next(err) {
                if (err) {
                    expect(err).to.be.an.IgnitionError('BadRequestError', /Malformed payload/);

                    return done();
                }

                done('This should have thrown an error');
            });
        });

        it('errors for payloads with object and no type or attributes', function (done) {
            req.payload = {data: {id: 'a1b'}};

            payload(req, res, function next(err) {
                if (err) {
                    expect(err).to.be.an.IgnitionError('BadRequestError', /Malformed payload/);

                    return done();
                }

                done('This should have thrown an error');
            });
        });

        it('errors for payloads with object, type, but no attributes', function (done) {
            req.payload = {data: {
                id: 'a1b',
                type: 'thing'
            }};

            payload(req, res, function next(err) {
                if (err) {
                    expect(err).to.be.an.IgnitionError('BadRequestError', /Malformed payload/);

                    return done();
                }

                done('This should have thrown an error');
            });
        });

        it('errors for payloads with object, attributes, but no type', function (done) {
            req.payload = {data: {
                id: 'a1b',
                attributes: {cat: 'hat'}
            }};

            payload(req, res, function next(err) {
                if (err) {
                    expect(err).to.be.an.IgnitionError('BadRequestError', /Malformed payload/);

                    return done();
                }

                done('This should have thrown an error');
            });
        });

        it('does not error for payload with data, attributes and type', function (done) {
            req.payload = {data: {
                id: 'a1b',
                type: 'thing',
                attributes: {cat: 'hat'}
            }};

            payload(req, res, function next(err) {
                if (err) {
                    return done(err);
                }

                expect(req.query.data).to.be.an('object').and.have.property('cat', 'hat');
                done();
            });
        });

        it('does not error for non empty data array, but also does nothing with it :(', function (done) {
            req.payload = {data: [{
                id: 'a1b',
                type: 'thing',
                attributes: {cat: 'hat'}
            }]};

            payload(req, res, function next(err) {
                if (err) {
                    return done(err);
                }

                expect(req.query.data).to.an('object').and.be.empty;
                done();
            });
        });
    });

    it('picks attributes if they are provided', function (done) {
        req.payload = {data: {
            id: 'a1b',
            type: 'thing',
            attributes: {
                cat: 'hat',
                brains: 'head',
                feet: 'shoes'
            }
        }};

        req.options.attributes = ['cat', 'feet'];

        payload(req, res, function next(err) {
            if (err) {
                return done(err);
            }

            expect(req.query.data).to.be.an('object');
            expect(req.query.data).to.have.property('cat', 'hat');
            expect(req.query.data).to.have.property('feet', 'shoes');
            expect(req.query.data).to.not.have.property('brains');
            done();
        });
    });
});