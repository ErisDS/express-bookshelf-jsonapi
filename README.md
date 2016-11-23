# express-bookshelf-jsonapi
_ebja for short - yep this module needs a better name, that's why it's still under my username_

**WARNING: This is still very much a work in progress**

ebja can be used to create API endpoints which:

1. respond on express routes (act as middleware)
2. serialise a bookshelf model as a response (even if it also does other work)
3. use the JSONAPI format for request / responses

ebja assumes that endpoints need to be extremely customisable. It has lots of sensible defaults but tries to make everything overridable, whilst still making it very easy to return full JSONAPI-compliant responses.

## Example Usage

```js
var app = express();

var jsonapi = ebja({
    baseUrl: 'http://localhost:80/api',
    models: require('./my-bookshelf-models')
});
var blogs = jsonapi.Resource({
  model: 'Blog'
});

blogs.read = blogs.Endpoint({});

app.get('/blogs/:id', blogs.read)
```

## ebja()

The intial usage of ebja is to setup the initial config for your API.

```js
var jsonapi = ebja({
    baseUrl: 'http://localhost:80/api',
    models: require('./my-bookshelf-models')
});
```

`ebja()` takes an options object with two parameters:
* `baseUrl` - the url to prefix each endpoint with, for outputting in JSONAPI links
* `models` - an object with model names as keys, and bookshelf models as values

Once setup, the resulting object has two methods:
* `Resource({})` - define a resource for which endpoints will be created, e.g. a Blogs resource for creating various CRUD endpoints (returns a resource)
* `Endpoint({})` - define an endpoint without first creating a resource (returns a middleware function)

`Resource` & `Endpoint` both take all the same options.
A `Resource` has an `Endpoint` method which has all options passed to the resource as overridable defaults.

Resources are a convenience for packaging up options for a group of endpoints, E.g. setting the model, permissions and configuring the response across a full suite of CRUD endpoints.

## Principles

#### Bookshelf plugin

ebja assumes you'll wire up its bookshelf plugin. This provides access to two special model methods:

* `getOne` - return a single resource
* `getPage` - return a collection

Both of these methods are used by ebja by default, to ensure that the JSONAPI params `include`, `page`, `sort`, `field` and `filter` are passed through to the model correctly and applied.\*

```js
var knex = require('knex')(dbConfig)
var Bookshelf = require('bookshelf')(knex);

Bookshelf.plugin(require('ebja').plugin);
```

\* Note: the params `field` and `filter` are currently disabled by this module. The params are only utilised in GET / query type endpoints.


#### Endpoint "types"

ebja works on the idea that there are 3 main types of endpoint:
- query (method: GET) - default
- action (methods: POST, PUT or PATCH)
- destroy (method: DELETE)

**Query** endpoints perform a fetch for a single object or collection with support for the JSONAPI params `include`, `page`, `sort`, `field` and `filter`.

**Action** endpoints assume there is some operation to perform, e.g. to add or update a model. These endpoints usually perform a `getOne` query after the operation in order to return a serialised model in JSONAPI format.

**Destroy** endpoints assume they are deleting a resource. They return a 204 and empty response by default on success.

By setting the `method` option for an endpoint, the type of endpoint can be changed.

#### Function "stacks" (apiware)

For each type of endpoint (query, action, destroy) ebja has a stack of functions, much like middleware, that it will execute (see the Stacks listing below for details). Some stack functions have default behaviour, some are noops intended to be overridden with custom behaviour, e.g. `permissions`. These functions are referred to as apiware.

Calling Endpoint() results in a function which can be called as express middleware. When called as middleware, the http `req` and `res` parameters are converted into transport-agnostic `APIRequest` and `APIResponse` objects. The apiware functions operate the same as express middleware, with the `APIRequest` and `APIResponse` object being past to each in turn, and each function calling `next()` to continue.

For example, for a destroy endpoint there are just 2 apiware functions in the stack: `permissions()` (a noop) and `destroy()`. All 3 types of endpoint have a `permissions()` function just before the main operation. This function can be overridden by passing a function as a `permission` option to the Endpoint or Resource. All stack functions can be overridden in the same way.

Example:

```js
var usersRead = jsonapi.Endpoint({
    method: 'GET', // this is the default
    queryMethod: 'getOne', // this is the default
    model: 'User',
    permissions: function (apiReq, apiRes, next) {
      // If the id parameter in the url (query.data.id) matches the authenticated user (source.id)
      if (apiReq.query.data.id === apiReq.source.id) {
          // We're safe to continue because we are allowed access to this resource
          return next();
      }

      // Else, we have no permission to continue
      return next(new Error('NoPermissionError');
    }
});

```

## Options

* `method` (default: `GET`) the HTTP method of the endpoint
* `queryMethod` (default: `getOne`) the method to call on the model in the query apiware (query & action endpoints)
* `actionMethod` (default: `noop`) the method to call on the model in the action apiware (action endpoints only)
* `destroyMethod` (default: `destroy`) the method to call on the model in the destroy apiware (destroy endpoints only)
* `relations` array of relations that the endpoint can `include`
* `defaultSort` the default sort order
* `<apiwarename>` all apiware functions can be overridden by providing a function with the same name to the options
* `response` an object containing options for configuring the response
   * `type` a string type to return in the JSONAPI response
   * `attributes` whitelist
   * any other option supported by [jsonapi-serializer](https://github.com/SeyZ/jsonapi-serializer#serialization) or [jsonapi-mapper](https://github.com/scoutforpets/jsonapi-mapper#api)


## Stacks

#### Query (default)

* validate (noop)
* paramsData
* paramsInclude
* paramsPage
* paramsFilter
* paramsFields
* paramsSort
* permissions (noop)
* query (main operation)
* process (noop)
* format

#### Action

* validate (noop)
* payload
* permissions (noop)
* action (main operation)
* query (secondary operation)
* process (noop)
* format

#### Destroy
* permissions (noop)
* destroy (main operation)
