/**
 * Fetch options as defined by MDN.
 * @typedef {object} FetchInit
 * @property {string} method An HTTP method, GET by default. This will be overridden.
 * @property {string[]|Headers} headers An { array of header strings | instance of the Headers class }.
 * @property {string|Blob|BufferSource|FormData|URLSearchParams|ReadableStream} body The body of the request.
 * @property {string} mode
 * - no-cors
 * - *cors
 * - same-origin
 * @property {object} credentials
 * - include
 * -*same-origin
 * - omit
 * @property {string} cache
 * - *default
 * - no-store
 * - reload
 * - no-cache
 * - force-cache
 * - only-if-cached
 * @property {string} redirect
 * - *follow,
 * - error
 * - manual,
 * @property {USVString} referrer A USVString specifying the referrer of the request.
 * - same-origin URL
 * - *about:client
 * - "" 
 * @property {string} referrerPolicy
 * - ""
 * - no-referrer
 * - no-referrer-when-downgrade
 * - same-origin
 * - origin
 * - strict-origin
 * - origin-when-cross-origin
 * - *strict-origin-when-cross-origin
 * - unsafe-url
 * @property {string} integrity The known-ahead checksum.
 * @property {boolean} keepalive Whether or not to perform request in background even after leaving page. 
 * @property {AbortSignal} signal An AbortSignal object instance; allows you to communicate with a fetch request and abort it if desired via an AbortController.
 */




/**
 * @param {string} method An HTTP method, GET by default.
 * @param {string|Request} resource A { URL string | Request object }.
 * @param {object} init Options for configuring the Request. This is optional.
 * 
 * 
 * @returns {Promise} A promise that resolves to the response in JSON-format.
 */

export async function sendRequest(method = 'GET', resource, init = {})
{
    try {
        if (!resource || (resource.prototype === Request.prototype && !resource.url)) throw Error('Must define URL')

        let { headers, body, credentials, cache, redirect, referrer, referrerPolicy, integrity, keepalive, signal } = init
        init.method = method

        if (method === "GET" || method === "HEAD")
        {
            init.body = undefined
        }
        else if (typeof body !== 'string')
        {
            init.body = JSON.stringify(body)
        }

        if (!headers)
        {
            headers = new Headers()
            headers.set('Accept', 'application/json') //tells server this datatype can be sent back
            if (init.body) headers.set('Content-Type', 'application/json') //tells server what type of data is being sent
            init.headers = headers
        }
        let response = await fetch(resource, init)


        switch (String(response.status)[0])
        {
            case '4': throw Error('Bad request')
            case '5': throw Error('Server unavailable')
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("Response not in JSON");
        }
        
        let parsedResponse = await response.json()
        
        return {...parsedResponse, success:true}
    } catch (error) {
        console.error('Fetch failed:',error)
        return {success: false}
    }
}