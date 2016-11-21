var utils = exports;
var _ = require('lodash');
// This is the same util used by bookshelf
var createError = require('create-error');

// Load sinon chai helper
var chai = require('chai');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

// Load our chai helpers
var chaiHelpers = require('./helpers');
chaiHelpers.forEach(function (helper) {
    chai.use(helper);
});

// Load sinon bluebird helper
var sinon = require('sinon');
var Promise = require('bluebird');
require('sinon-bluebird');

utils.fakeModel = function (options) {
    return _.merge({}, {
        NotFoundError: createError('NotFoundError'),
        NoRowsDeletedError: createError('NoRowsDeletedError'),
        NoRowsUpdatedError: createError('NoRowsUpdatedError'),
    }, options);
};

