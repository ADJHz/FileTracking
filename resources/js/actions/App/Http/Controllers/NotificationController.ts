import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:15
 * @route '/api/v1/notifications'
 */
const index61390cf35a89fe10cc418b5300acba9f = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index61390cf35a89fe10cc418b5300acba9f.url(options),
    method: 'get',
})

index61390cf35a89fe10cc418b5300acba9f.definition = {
    methods: ["get","head"],
    url: '/api/v1/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:15
 * @route '/api/v1/notifications'
 */
index61390cf35a89fe10cc418b5300acba9f.url = (options?: RouteQueryOptions) => {
    return index61390cf35a89fe10cc418b5300acba9f.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:15
 * @route '/api/v1/notifications'
 */
index61390cf35a89fe10cc418b5300acba9f.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index61390cf35a89fe10cc418b5300acba9f.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:15
 * @route '/api/v1/notifications'
 */
index61390cf35a89fe10cc418b5300acba9f.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index61390cf35a89fe10cc418b5300acba9f.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:15
 * @route '/api/v1/notifications'
 */
    const index61390cf35a89fe10cc418b5300acba9fForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index61390cf35a89fe10cc418b5300acba9f.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:15
 * @route '/api/v1/notifications'
 */
        index61390cf35a89fe10cc418b5300acba9fForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index61390cf35a89fe10cc418b5300acba9f.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:15
 * @route '/api/v1/notifications'
 */
        index61390cf35a89fe10cc418b5300acba9fForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index61390cf35a89fe10cc418b5300acba9f.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index61390cf35a89fe10cc418b5300acba9f.form = index61390cf35a89fe10cc418b5300acba9fForm
    /**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:15
 * @route '/notifications'
 */
const indexd3f40fab60887a2723ab34bfa72648a2 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexd3f40fab60887a2723ab34bfa72648a2.url(options),
    method: 'get',
})

indexd3f40fab60887a2723ab34bfa72648a2.definition = {
    methods: ["get","head"],
    url: '/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:15
 * @route '/notifications'
 */
indexd3f40fab60887a2723ab34bfa72648a2.url = (options?: RouteQueryOptions) => {
    return indexd3f40fab60887a2723ab34bfa72648a2.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:15
 * @route '/notifications'
 */
indexd3f40fab60887a2723ab34bfa72648a2.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexd3f40fab60887a2723ab34bfa72648a2.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:15
 * @route '/notifications'
 */
indexd3f40fab60887a2723ab34bfa72648a2.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexd3f40fab60887a2723ab34bfa72648a2.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:15
 * @route '/notifications'
 */
    const indexd3f40fab60887a2723ab34bfa72648a2Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexd3f40fab60887a2723ab34bfa72648a2.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:15
 * @route '/notifications'
 */
        indexd3f40fab60887a2723ab34bfa72648a2Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexd3f40fab60887a2723ab34bfa72648a2.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:15
 * @route '/notifications'
 */
        indexd3f40fab60887a2723ab34bfa72648a2Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexd3f40fab60887a2723ab34bfa72648a2.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexd3f40fab60887a2723ab34bfa72648a2.form = indexd3f40fab60887a2723ab34bfa72648a2Form

export const index = {
    '/api/v1/notifications': index61390cf35a89fe10cc418b5300acba9f,
    '/notifications': indexd3f40fab60887a2723ab34bfa72648a2,
}

/**
* @see \App\Http\Controllers\NotificationController::markAsRead
 * @see app/Http/Controllers/NotificationController.php:36
 * @route '/api/v1/notifications/{notification}/read'
 */
const markAsRead910e713662a0bbd3bd79c9ad4dcd42a1 = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: markAsRead910e713662a0bbd3bd79c9ad4dcd42a1.url(args, options),
    method: 'patch',
})

markAsRead910e713662a0bbd3bd79c9ad4dcd42a1.definition = {
    methods: ["patch"],
    url: '/api/v1/notifications/{notification}/read',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\NotificationController::markAsRead
 * @see app/Http/Controllers/NotificationController.php:36
 * @route '/api/v1/notifications/{notification}/read'
 */
markAsRead910e713662a0bbd3bd79c9ad4dcd42a1.url = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: typeof args.notification === 'object'
                ? args.notification.id
                : args.notification,
                }

    return markAsRead910e713662a0bbd3bd79c9ad4dcd42a1.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::markAsRead
 * @see app/Http/Controllers/NotificationController.php:36
 * @route '/api/v1/notifications/{notification}/read'
 */
markAsRead910e713662a0bbd3bd79c9ad4dcd42a1.patch = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: markAsRead910e713662a0bbd3bd79c9ad4dcd42a1.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\NotificationController::markAsRead
 * @see app/Http/Controllers/NotificationController.php:36
 * @route '/api/v1/notifications/{notification}/read'
 */
    const markAsRead910e713662a0bbd3bd79c9ad4dcd42a1Form = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAsRead910e713662a0bbd3bd79c9ad4dcd42a1.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificationController::markAsRead
 * @see app/Http/Controllers/NotificationController.php:36
 * @route '/api/v1/notifications/{notification}/read'
 */
        markAsRead910e713662a0bbd3bd79c9ad4dcd42a1Form.patch = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAsRead910e713662a0bbd3bd79c9ad4dcd42a1.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    markAsRead910e713662a0bbd3bd79c9ad4dcd42a1.form = markAsRead910e713662a0bbd3bd79c9ad4dcd42a1Form
    /**
* @see \App\Http\Controllers\NotificationController::markAsRead
 * @see app/Http/Controllers/NotificationController.php:36
 * @route '/notifications/{notification}/read'
 */
const markAsReadb104048b11cc5e8b0cb2e7e034af82e0 = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: markAsReadb104048b11cc5e8b0cb2e7e034af82e0.url(args, options),
    method: 'patch',
})

markAsReadb104048b11cc5e8b0cb2e7e034af82e0.definition = {
    methods: ["patch"],
    url: '/notifications/{notification}/read',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\NotificationController::markAsRead
 * @see app/Http/Controllers/NotificationController.php:36
 * @route '/notifications/{notification}/read'
 */
markAsReadb104048b11cc5e8b0cb2e7e034af82e0.url = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: typeof args.notification === 'object'
                ? args.notification.id
                : args.notification,
                }

    return markAsReadb104048b11cc5e8b0cb2e7e034af82e0.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::markAsRead
 * @see app/Http/Controllers/NotificationController.php:36
 * @route '/notifications/{notification}/read'
 */
markAsReadb104048b11cc5e8b0cb2e7e034af82e0.patch = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: markAsReadb104048b11cc5e8b0cb2e7e034af82e0.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\NotificationController::markAsRead
 * @see app/Http/Controllers/NotificationController.php:36
 * @route '/notifications/{notification}/read'
 */
    const markAsReadb104048b11cc5e8b0cb2e7e034af82e0Form = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAsReadb104048b11cc5e8b0cb2e7e034af82e0.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificationController::markAsRead
 * @see app/Http/Controllers/NotificationController.php:36
 * @route '/notifications/{notification}/read'
 */
        markAsReadb104048b11cc5e8b0cb2e7e034af82e0Form.patch = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAsReadb104048b11cc5e8b0cb2e7e034af82e0.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    markAsReadb104048b11cc5e8b0cb2e7e034af82e0.form = markAsReadb104048b11cc5e8b0cb2e7e034af82e0Form

export const markAsRead = {
    '/api/v1/notifications/{notification}/read': markAsRead910e713662a0bbd3bd79c9ad4dcd42a1,
    '/notifications/{notification}/read': markAsReadb104048b11cc5e8b0cb2e7e034af82e0,
}

/**
* @see \App\Http\Controllers\NotificationController::markAllAsRead
 * @see app/Http/Controllers/NotificationController.php:61
 * @route '/api/v1/notifications/mark-all-read'
 */
const markAllAsReadb3fc6d7260574a79d432a069a5e9286c = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: markAllAsReadb3fc6d7260574a79d432a069a5e9286c.url(options),
    method: 'patch',
})

markAllAsReadb3fc6d7260574a79d432a069a5e9286c.definition = {
    methods: ["patch"],
    url: '/api/v1/notifications/mark-all-read',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\NotificationController::markAllAsRead
 * @see app/Http/Controllers/NotificationController.php:61
 * @route '/api/v1/notifications/mark-all-read'
 */
markAllAsReadb3fc6d7260574a79d432a069a5e9286c.url = (options?: RouteQueryOptions) => {
    return markAllAsReadb3fc6d7260574a79d432a069a5e9286c.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::markAllAsRead
 * @see app/Http/Controllers/NotificationController.php:61
 * @route '/api/v1/notifications/mark-all-read'
 */
markAllAsReadb3fc6d7260574a79d432a069a5e9286c.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: markAllAsReadb3fc6d7260574a79d432a069a5e9286c.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\NotificationController::markAllAsRead
 * @see app/Http/Controllers/NotificationController.php:61
 * @route '/api/v1/notifications/mark-all-read'
 */
    const markAllAsReadb3fc6d7260574a79d432a069a5e9286cForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAllAsReadb3fc6d7260574a79d432a069a5e9286c.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificationController::markAllAsRead
 * @see app/Http/Controllers/NotificationController.php:61
 * @route '/api/v1/notifications/mark-all-read'
 */
        markAllAsReadb3fc6d7260574a79d432a069a5e9286cForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAllAsReadb3fc6d7260574a79d432a069a5e9286c.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    markAllAsReadb3fc6d7260574a79d432a069a5e9286c.form = markAllAsReadb3fc6d7260574a79d432a069a5e9286cForm
    /**
* @see \App\Http\Controllers\NotificationController::markAllAsRead
 * @see app/Http/Controllers/NotificationController.php:61
 * @route '/notifications/mark-all-read'
 */
const markAllAsReadb241654f34502d79d3adfc7a6fb1b558 = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: markAllAsReadb241654f34502d79d3adfc7a6fb1b558.url(options),
    method: 'patch',
})

markAllAsReadb241654f34502d79d3adfc7a6fb1b558.definition = {
    methods: ["patch"],
    url: '/notifications/mark-all-read',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\NotificationController::markAllAsRead
 * @see app/Http/Controllers/NotificationController.php:61
 * @route '/notifications/mark-all-read'
 */
markAllAsReadb241654f34502d79d3adfc7a6fb1b558.url = (options?: RouteQueryOptions) => {
    return markAllAsReadb241654f34502d79d3adfc7a6fb1b558.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::markAllAsRead
 * @see app/Http/Controllers/NotificationController.php:61
 * @route '/notifications/mark-all-read'
 */
markAllAsReadb241654f34502d79d3adfc7a6fb1b558.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: markAllAsReadb241654f34502d79d3adfc7a6fb1b558.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\NotificationController::markAllAsRead
 * @see app/Http/Controllers/NotificationController.php:61
 * @route '/notifications/mark-all-read'
 */
    const markAllAsReadb241654f34502d79d3adfc7a6fb1b558Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAllAsReadb241654f34502d79d3adfc7a6fb1b558.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificationController::markAllAsRead
 * @see app/Http/Controllers/NotificationController.php:61
 * @route '/notifications/mark-all-read'
 */
        markAllAsReadb241654f34502d79d3adfc7a6fb1b558Form.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAllAsReadb241654f34502d79d3adfc7a6fb1b558.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    markAllAsReadb241654f34502d79d3adfc7a6fb1b558.form = markAllAsReadb241654f34502d79d3adfc7a6fb1b558Form

export const markAllAsRead = {
    '/api/v1/notifications/mark-all-read': markAllAsReadb3fc6d7260574a79d432a069a5e9286c,
    '/notifications/mark-all-read': markAllAsReadb241654f34502d79d3adfc7a6fb1b558,
}

/**
* @see \App\Http\Controllers\NotificationController::destroy
 * @see app/Http/Controllers/NotificationController.php:79
 * @route '/api/v1/notifications/{notification}'
 */
const destroy629ca6fb068dbfc6cc23bead878cae31 = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy629ca6fb068dbfc6cc23bead878cae31.url(args, options),
    method: 'delete',
})

destroy629ca6fb068dbfc6cc23bead878cae31.definition = {
    methods: ["delete"],
    url: '/api/v1/notifications/{notification}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\NotificationController::destroy
 * @see app/Http/Controllers/NotificationController.php:79
 * @route '/api/v1/notifications/{notification}'
 */
destroy629ca6fb068dbfc6cc23bead878cae31.url = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: typeof args.notification === 'object'
                ? args.notification.id
                : args.notification,
                }

    return destroy629ca6fb068dbfc6cc23bead878cae31.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::destroy
 * @see app/Http/Controllers/NotificationController.php:79
 * @route '/api/v1/notifications/{notification}'
 */
destroy629ca6fb068dbfc6cc23bead878cae31.delete = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy629ca6fb068dbfc6cc23bead878cae31.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\NotificationController::destroy
 * @see app/Http/Controllers/NotificationController.php:79
 * @route '/api/v1/notifications/{notification}'
 */
    const destroy629ca6fb068dbfc6cc23bead878cae31Form = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy629ca6fb068dbfc6cc23bead878cae31.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificationController::destroy
 * @see app/Http/Controllers/NotificationController.php:79
 * @route '/api/v1/notifications/{notification}'
 */
        destroy629ca6fb068dbfc6cc23bead878cae31Form.delete = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy629ca6fb068dbfc6cc23bead878cae31.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy629ca6fb068dbfc6cc23bead878cae31.form = destroy629ca6fb068dbfc6cc23bead878cae31Form
    /**
* @see \App\Http\Controllers\NotificationController::destroy
 * @see app/Http/Controllers/NotificationController.php:79
 * @route '/notifications/{notification}'
 */
const destroy5450d3a7178b59f1a6789239cdf277dd = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy5450d3a7178b59f1a6789239cdf277dd.url(args, options),
    method: 'delete',
})

destroy5450d3a7178b59f1a6789239cdf277dd.definition = {
    methods: ["delete"],
    url: '/notifications/{notification}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\NotificationController::destroy
 * @see app/Http/Controllers/NotificationController.php:79
 * @route '/notifications/{notification}'
 */
destroy5450d3a7178b59f1a6789239cdf277dd.url = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: typeof args.notification === 'object'
                ? args.notification.id
                : args.notification,
                }

    return destroy5450d3a7178b59f1a6789239cdf277dd.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::destroy
 * @see app/Http/Controllers/NotificationController.php:79
 * @route '/notifications/{notification}'
 */
destroy5450d3a7178b59f1a6789239cdf277dd.delete = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy5450d3a7178b59f1a6789239cdf277dd.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\NotificationController::destroy
 * @see app/Http/Controllers/NotificationController.php:79
 * @route '/notifications/{notification}'
 */
    const destroy5450d3a7178b59f1a6789239cdf277ddForm = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy5450d3a7178b59f1a6789239cdf277dd.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificationController::destroy
 * @see app/Http/Controllers/NotificationController.php:79
 * @route '/notifications/{notification}'
 */
        destroy5450d3a7178b59f1a6789239cdf277ddForm.delete = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy5450d3a7178b59f1a6789239cdf277dd.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy5450d3a7178b59f1a6789239cdf277dd.form = destroy5450d3a7178b59f1a6789239cdf277ddForm

export const destroy = {
    '/api/v1/notifications/{notification}': destroy629ca6fb068dbfc6cc23bead878cae31,
    '/notifications/{notification}': destroy5450d3a7178b59f1a6789239cdf277dd,
}

const NotificationController = { index, markAsRead, markAllAsRead, destroy }

export default NotificationController