import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:16
 * @route '/api/v1/dashboard'
 */
const index1c1918c8a6c63741345c1e1ddb8c7d3d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index1c1918c8a6c63741345c1e1ddb8c7d3d.url(options),
    method: 'get',
})

index1c1918c8a6c63741345c1e1ddb8c7d3d.definition = {
    methods: ["get","head"],
    url: '/api/v1/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:16
 * @route '/api/v1/dashboard'
 */
index1c1918c8a6c63741345c1e1ddb8c7d3d.url = (options?: RouteQueryOptions) => {
    return index1c1918c8a6c63741345c1e1ddb8c7d3d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:16
 * @route '/api/v1/dashboard'
 */
index1c1918c8a6c63741345c1e1ddb8c7d3d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index1c1918c8a6c63741345c1e1ddb8c7d3d.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:16
 * @route '/api/v1/dashboard'
 */
index1c1918c8a6c63741345c1e1ddb8c7d3d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index1c1918c8a6c63741345c1e1ddb8c7d3d.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:16
 * @route '/api/v1/dashboard'
 */
    const index1c1918c8a6c63741345c1e1ddb8c7d3dForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index1c1918c8a6c63741345c1e1ddb8c7d3d.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:16
 * @route '/api/v1/dashboard'
 */
        index1c1918c8a6c63741345c1e1ddb8c7d3dForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index1c1918c8a6c63741345c1e1ddb8c7d3d.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:16
 * @route '/api/v1/dashboard'
 */
        index1c1918c8a6c63741345c1e1ddb8c7d3dForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index1c1918c8a6c63741345c1e1ddb8c7d3d.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index1c1918c8a6c63741345c1e1ddb8c7d3d.form = index1c1918c8a6c63741345c1e1ddb8c7d3dForm
    /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:16
 * @route '/dashboard'
 */
const index42a740574ecbfbac32f8cc353fc32db9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

index42a740574ecbfbac32f8cc353fc32db9.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:16
 * @route '/dashboard'
 */
index42a740574ecbfbac32f8cc353fc32db9.url = (options?: RouteQueryOptions) => {
    return index42a740574ecbfbac32f8cc353fc32db9.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:16
 * @route '/dashboard'
 */
index42a740574ecbfbac32f8cc353fc32db9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:16
 * @route '/dashboard'
 */
index42a740574ecbfbac32f8cc353fc32db9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:16
 * @route '/dashboard'
 */
    const index42a740574ecbfbac32f8cc353fc32db9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index42a740574ecbfbac32f8cc353fc32db9.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:16
 * @route '/dashboard'
 */
        index42a740574ecbfbac32f8cc353fc32db9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index42a740574ecbfbac32f8cc353fc32db9.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:16
 * @route '/dashboard'
 */
        index42a740574ecbfbac32f8cc353fc32db9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index42a740574ecbfbac32f8cc353fc32db9.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index42a740574ecbfbac32f8cc353fc32db9.form = index42a740574ecbfbac32f8cc353fc32db9Form

export const index = {
    '/api/v1/dashboard': index1c1918c8a6c63741345c1e1ddb8c7d3d,
    '/dashboard': index42a740574ecbfbac32f8cc353fc32db9,
}

const DashboardController = { index }

export default DashboardController