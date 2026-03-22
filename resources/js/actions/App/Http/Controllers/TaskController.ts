import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TaskController::index
 * @see app/Http/Controllers/TaskController.php:23
 * @route '/api/v1/tasks'
 */
const index9af19c54a38ea8b94322a3e43da146fc = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index9af19c54a38ea8b94322a3e43da146fc.url(options),
    method: 'get',
})

index9af19c54a38ea8b94322a3e43da146fc.definition = {
    methods: ["get","head"],
    url: '/api/v1/tasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TaskController::index
 * @see app/Http/Controllers/TaskController.php:23
 * @route '/api/v1/tasks'
 */
index9af19c54a38ea8b94322a3e43da146fc.url = (options?: RouteQueryOptions) => {
    return index9af19c54a38ea8b94322a3e43da146fc.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::index
 * @see app/Http/Controllers/TaskController.php:23
 * @route '/api/v1/tasks'
 */
index9af19c54a38ea8b94322a3e43da146fc.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index9af19c54a38ea8b94322a3e43da146fc.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TaskController::index
 * @see app/Http/Controllers/TaskController.php:23
 * @route '/api/v1/tasks'
 */
index9af19c54a38ea8b94322a3e43da146fc.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index9af19c54a38ea8b94322a3e43da146fc.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TaskController::index
 * @see app/Http/Controllers/TaskController.php:23
 * @route '/api/v1/tasks'
 */
    const index9af19c54a38ea8b94322a3e43da146fcForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index9af19c54a38ea8b94322a3e43da146fc.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TaskController::index
 * @see app/Http/Controllers/TaskController.php:23
 * @route '/api/v1/tasks'
 */
        index9af19c54a38ea8b94322a3e43da146fcForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index9af19c54a38ea8b94322a3e43da146fc.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TaskController::index
 * @see app/Http/Controllers/TaskController.php:23
 * @route '/api/v1/tasks'
 */
        index9af19c54a38ea8b94322a3e43da146fcForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index9af19c54a38ea8b94322a3e43da146fc.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index9af19c54a38ea8b94322a3e43da146fc.form = index9af19c54a38ea8b94322a3e43da146fcForm
    /**
* @see \App\Http\Controllers\TaskController::index
 * @see app/Http/Controllers/TaskController.php:23
 * @route '/tasks'
 */
const indexaefb1b9af2c8d8e723708dc6f7e19610 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexaefb1b9af2c8d8e723708dc6f7e19610.url(options),
    method: 'get',
})

indexaefb1b9af2c8d8e723708dc6f7e19610.definition = {
    methods: ["get","head"],
    url: '/tasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TaskController::index
 * @see app/Http/Controllers/TaskController.php:23
 * @route '/tasks'
 */
indexaefb1b9af2c8d8e723708dc6f7e19610.url = (options?: RouteQueryOptions) => {
    return indexaefb1b9af2c8d8e723708dc6f7e19610.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::index
 * @see app/Http/Controllers/TaskController.php:23
 * @route '/tasks'
 */
indexaefb1b9af2c8d8e723708dc6f7e19610.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexaefb1b9af2c8d8e723708dc6f7e19610.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TaskController::index
 * @see app/Http/Controllers/TaskController.php:23
 * @route '/tasks'
 */
indexaefb1b9af2c8d8e723708dc6f7e19610.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexaefb1b9af2c8d8e723708dc6f7e19610.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TaskController::index
 * @see app/Http/Controllers/TaskController.php:23
 * @route '/tasks'
 */
    const indexaefb1b9af2c8d8e723708dc6f7e19610Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexaefb1b9af2c8d8e723708dc6f7e19610.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TaskController::index
 * @see app/Http/Controllers/TaskController.php:23
 * @route '/tasks'
 */
        indexaefb1b9af2c8d8e723708dc6f7e19610Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexaefb1b9af2c8d8e723708dc6f7e19610.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TaskController::index
 * @see app/Http/Controllers/TaskController.php:23
 * @route '/tasks'
 */
        indexaefb1b9af2c8d8e723708dc6f7e19610Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexaefb1b9af2c8d8e723708dc6f7e19610.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexaefb1b9af2c8d8e723708dc6f7e19610.form = indexaefb1b9af2c8d8e723708dc6f7e19610Form

export const index = {
    '/api/v1/tasks': index9af19c54a38ea8b94322a3e43da146fc,
    '/tasks': indexaefb1b9af2c8d8e723708dc6f7e19610,
}

/**
* @see \App\Http\Controllers\TaskController::store
 * @see app/Http/Controllers/TaskController.php:41
 * @route '/api/v1/tasks'
 */
const store9af19c54a38ea8b94322a3e43da146fc = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store9af19c54a38ea8b94322a3e43da146fc.url(options),
    method: 'post',
})

store9af19c54a38ea8b94322a3e43da146fc.definition = {
    methods: ["post"],
    url: '/api/v1/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TaskController::store
 * @see app/Http/Controllers/TaskController.php:41
 * @route '/api/v1/tasks'
 */
store9af19c54a38ea8b94322a3e43da146fc.url = (options?: RouteQueryOptions) => {
    return store9af19c54a38ea8b94322a3e43da146fc.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::store
 * @see app/Http/Controllers/TaskController.php:41
 * @route '/api/v1/tasks'
 */
store9af19c54a38ea8b94322a3e43da146fc.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store9af19c54a38ea8b94322a3e43da146fc.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TaskController::store
 * @see app/Http/Controllers/TaskController.php:41
 * @route '/api/v1/tasks'
 */
    const store9af19c54a38ea8b94322a3e43da146fcForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store9af19c54a38ea8b94322a3e43da146fc.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TaskController::store
 * @see app/Http/Controllers/TaskController.php:41
 * @route '/api/v1/tasks'
 */
        store9af19c54a38ea8b94322a3e43da146fcForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store9af19c54a38ea8b94322a3e43da146fc.url(options),
            method: 'post',
        })
    
    store9af19c54a38ea8b94322a3e43da146fc.form = store9af19c54a38ea8b94322a3e43da146fcForm
    /**
* @see \App\Http\Controllers\TaskController::store
 * @see app/Http/Controllers/TaskController.php:41
 * @route '/tasks'
 */
const storeaefb1b9af2c8d8e723708dc6f7e19610 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeaefb1b9af2c8d8e723708dc6f7e19610.url(options),
    method: 'post',
})

storeaefb1b9af2c8d8e723708dc6f7e19610.definition = {
    methods: ["post"],
    url: '/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TaskController::store
 * @see app/Http/Controllers/TaskController.php:41
 * @route '/tasks'
 */
storeaefb1b9af2c8d8e723708dc6f7e19610.url = (options?: RouteQueryOptions) => {
    return storeaefb1b9af2c8d8e723708dc6f7e19610.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::store
 * @see app/Http/Controllers/TaskController.php:41
 * @route '/tasks'
 */
storeaefb1b9af2c8d8e723708dc6f7e19610.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeaefb1b9af2c8d8e723708dc6f7e19610.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TaskController::store
 * @see app/Http/Controllers/TaskController.php:41
 * @route '/tasks'
 */
    const storeaefb1b9af2c8d8e723708dc6f7e19610Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeaefb1b9af2c8d8e723708dc6f7e19610.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TaskController::store
 * @see app/Http/Controllers/TaskController.php:41
 * @route '/tasks'
 */
        storeaefb1b9af2c8d8e723708dc6f7e19610Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeaefb1b9af2c8d8e723708dc6f7e19610.url(options),
            method: 'post',
        })
    
    storeaefb1b9af2c8d8e723708dc6f7e19610.form = storeaefb1b9af2c8d8e723708dc6f7e19610Form

export const store = {
    '/api/v1/tasks': store9af19c54a38ea8b94322a3e43da146fc,
    '/tasks': storeaefb1b9af2c8d8e723708dc6f7e19610,
}

/**
* @see \App\Http\Controllers\TaskController::update
 * @see app/Http/Controllers/TaskController.php:77
 * @route '/api/v1/tasks/{task}'
 */
const updatedf422ff14ca06e0b4c7517b8ab18b3f8 = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatedf422ff14ca06e0b4c7517b8ab18b3f8.url(args, options),
    method: 'put',
})

updatedf422ff14ca06e0b4c7517b8ab18b3f8.definition = {
    methods: ["put"],
    url: '/api/v1/tasks/{task}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TaskController::update
 * @see app/Http/Controllers/TaskController.php:77
 * @route '/api/v1/tasks/{task}'
 */
updatedf422ff14ca06e0b4c7517b8ab18b3f8.url = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { task: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        task: typeof args.task === 'object'
                ? args.task.id
                : args.task,
                }

    return updatedf422ff14ca06e0b4c7517b8ab18b3f8.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::update
 * @see app/Http/Controllers/TaskController.php:77
 * @route '/api/v1/tasks/{task}'
 */
updatedf422ff14ca06e0b4c7517b8ab18b3f8.put = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatedf422ff14ca06e0b4c7517b8ab18b3f8.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\TaskController::update
 * @see app/Http/Controllers/TaskController.php:77
 * @route '/api/v1/tasks/{task}'
 */
    const updatedf422ff14ca06e0b4c7517b8ab18b3f8Form = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatedf422ff14ca06e0b4c7517b8ab18b3f8.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TaskController::update
 * @see app/Http/Controllers/TaskController.php:77
 * @route '/api/v1/tasks/{task}'
 */
        updatedf422ff14ca06e0b4c7517b8ab18b3f8Form.put = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatedf422ff14ca06e0b4c7517b8ab18b3f8.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatedf422ff14ca06e0b4c7517b8ab18b3f8.form = updatedf422ff14ca06e0b4c7517b8ab18b3f8Form
    /**
* @see \App\Http\Controllers\TaskController::update
 * @see app/Http/Controllers/TaskController.php:77
 * @route '/tasks/{task}'
 */
const updatea9210b42b2fb5ac9933186a51e3242ee = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatea9210b42b2fb5ac9933186a51e3242ee.url(args, options),
    method: 'put',
})

updatea9210b42b2fb5ac9933186a51e3242ee.definition = {
    methods: ["put"],
    url: '/tasks/{task}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TaskController::update
 * @see app/Http/Controllers/TaskController.php:77
 * @route '/tasks/{task}'
 */
updatea9210b42b2fb5ac9933186a51e3242ee.url = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { task: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        task: typeof args.task === 'object'
                ? args.task.id
                : args.task,
                }

    return updatea9210b42b2fb5ac9933186a51e3242ee.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::update
 * @see app/Http/Controllers/TaskController.php:77
 * @route '/tasks/{task}'
 */
updatea9210b42b2fb5ac9933186a51e3242ee.put = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatea9210b42b2fb5ac9933186a51e3242ee.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\TaskController::update
 * @see app/Http/Controllers/TaskController.php:77
 * @route '/tasks/{task}'
 */
    const updatea9210b42b2fb5ac9933186a51e3242eeForm = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatea9210b42b2fb5ac9933186a51e3242ee.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TaskController::update
 * @see app/Http/Controllers/TaskController.php:77
 * @route '/tasks/{task}'
 */
        updatea9210b42b2fb5ac9933186a51e3242eeForm.put = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatea9210b42b2fb5ac9933186a51e3242ee.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatea9210b42b2fb5ac9933186a51e3242ee.form = updatea9210b42b2fb5ac9933186a51e3242eeForm

export const update = {
    '/api/v1/tasks/{task}': updatedf422ff14ca06e0b4c7517b8ab18b3f8,
    '/tasks/{task}': updatea9210b42b2fb5ac9933186a51e3242ee,
}

/**
* @see \App\Http\Controllers\TaskController::destroy
 * @see app/Http/Controllers/TaskController.php:138
 * @route '/api/v1/tasks/{task}'
 */
const destroydf422ff14ca06e0b4c7517b8ab18b3f8 = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroydf422ff14ca06e0b4c7517b8ab18b3f8.url(args, options),
    method: 'delete',
})

destroydf422ff14ca06e0b4c7517b8ab18b3f8.definition = {
    methods: ["delete"],
    url: '/api/v1/tasks/{task}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TaskController::destroy
 * @see app/Http/Controllers/TaskController.php:138
 * @route '/api/v1/tasks/{task}'
 */
destroydf422ff14ca06e0b4c7517b8ab18b3f8.url = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { task: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        task: typeof args.task === 'object'
                ? args.task.id
                : args.task,
                }

    return destroydf422ff14ca06e0b4c7517b8ab18b3f8.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::destroy
 * @see app/Http/Controllers/TaskController.php:138
 * @route '/api/v1/tasks/{task}'
 */
destroydf422ff14ca06e0b4c7517b8ab18b3f8.delete = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroydf422ff14ca06e0b4c7517b8ab18b3f8.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TaskController::destroy
 * @see app/Http/Controllers/TaskController.php:138
 * @route '/api/v1/tasks/{task}'
 */
    const destroydf422ff14ca06e0b4c7517b8ab18b3f8Form = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroydf422ff14ca06e0b4c7517b8ab18b3f8.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TaskController::destroy
 * @see app/Http/Controllers/TaskController.php:138
 * @route '/api/v1/tasks/{task}'
 */
        destroydf422ff14ca06e0b4c7517b8ab18b3f8Form.delete = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroydf422ff14ca06e0b4c7517b8ab18b3f8.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroydf422ff14ca06e0b4c7517b8ab18b3f8.form = destroydf422ff14ca06e0b4c7517b8ab18b3f8Form
    /**
* @see \App\Http\Controllers\TaskController::destroy
 * @see app/Http/Controllers/TaskController.php:138
 * @route '/tasks/{task}'
 */
const destroya9210b42b2fb5ac9933186a51e3242ee = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroya9210b42b2fb5ac9933186a51e3242ee.url(args, options),
    method: 'delete',
})

destroya9210b42b2fb5ac9933186a51e3242ee.definition = {
    methods: ["delete"],
    url: '/tasks/{task}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TaskController::destroy
 * @see app/Http/Controllers/TaskController.php:138
 * @route '/tasks/{task}'
 */
destroya9210b42b2fb5ac9933186a51e3242ee.url = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { task: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        task: typeof args.task === 'object'
                ? args.task.id
                : args.task,
                }

    return destroya9210b42b2fb5ac9933186a51e3242ee.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::destroy
 * @see app/Http/Controllers/TaskController.php:138
 * @route '/tasks/{task}'
 */
destroya9210b42b2fb5ac9933186a51e3242ee.delete = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroya9210b42b2fb5ac9933186a51e3242ee.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TaskController::destroy
 * @see app/Http/Controllers/TaskController.php:138
 * @route '/tasks/{task}'
 */
    const destroya9210b42b2fb5ac9933186a51e3242eeForm = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroya9210b42b2fb5ac9933186a51e3242ee.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TaskController::destroy
 * @see app/Http/Controllers/TaskController.php:138
 * @route '/tasks/{task}'
 */
        destroya9210b42b2fb5ac9933186a51e3242eeForm.delete = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroya9210b42b2fb5ac9933186a51e3242ee.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroya9210b42b2fb5ac9933186a51e3242ee.form = destroya9210b42b2fb5ac9933186a51e3242eeForm

export const destroy = {
    '/api/v1/tasks/{task}': destroydf422ff14ca06e0b4c7517b8ab18b3f8,
    '/tasks/{task}': destroya9210b42b2fb5ac9933186a51e3242ee,
}

const TaskController = { index, store, update, destroy }

export default TaskController