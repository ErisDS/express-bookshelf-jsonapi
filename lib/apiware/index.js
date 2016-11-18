var queue = exports;

/**
 * Query GET "queue"
 *
 * - Validate = run any validations defined (how to define these?!)
 * - Params = run through all the params items, each with some config?
 * - Permissions = defined by the calling module / default concept of ownership
 * - Query = execute the modelMethod to collect the data to return
 * - Process = clean up the model data, post permissions, etc
 * - Format = prepare for mapper/formatter
 */
queue.query = {
    // Validate: no-op until we have a standard definition
    validate: require('./noop'),
    // Params: there's a bunch of these!
    // TODO: we need an efficient way to run them all
    // TODO: and a simple way to hook into each one to override behaviour / define if it is enabled or not
    paramsData: require('./params-data'), // this should probably have a different name?
    paramsInclude: require('./params-include'),
    paramsPage: require('./params-page'),
    paramsFilter: require('./params-filter'),
    paramsFields: require('./params-fields'),
    paramsSort: require('./params-sort'),
    // Permissions: noop until we have a default concept of ownership
    permissions: require('./noop'),
    // Query: execute a modelMethod to get data to return
    query: require('./query'),
    // Process: noop
    process: require('./noop'),
    // Format: prepare options to be passed to the formatter
    format: require('./format')
};

/**
 * Action POST/PUT/PATCH "queue"
 *
 * - Validate = run any validations defined (how to define these?!)
 * - Permissions = defined by the calling module / default concept of ownership
 * - Action = defined by the calling module
 * - Query = execute the modelMethod to collect the data to return
 * - Process = clean up the model data, post permissions, etc
 * - Format = prepare for mapper/formatter
 */
queue.action = {
    // Validate: no-op until we have a standard definition
    validate: require('./noop'),
    // Payload: process req.body
    payload: require('./payload'),
    // Permissions: noop until we have a default concept of ownership
    permissions: require('./noop'),
    // Action: noop unless defined by the calling module
    action: require('./noop'),
    // Query: execute a modelMethod to get data to return
    query: require('./query'),
    // Process: noop
    process: require('./noop'),
    // Format: prepare options to be passed to the formatter
    format: require('./format')
};


/**
 * DELETE "queue"
 *
 * - Permissions = defined by the calling module / default concept of ownership
 * - Query = execute the modelMethod to delete
 * END -> return error or 204 No Content
 */

queue.destroy = {
    // Permissions: noop until we have a default concept of ownership
    permissions: require('./noop'),
    // Destroy: execute the modelMethod to remove data
    // TODO: implement this!
    destroy: require('./noop')
    // TODO: do we need a post-deletion-handler?
};
