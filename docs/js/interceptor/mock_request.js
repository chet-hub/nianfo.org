/** @typedef {import('./types').JsonPrimitive} JsonPrimitive */
/** @typedef {import('./types').DynamicResponseModFn} DynamicResponseModFn */
/** @typedef {import('./types').MockResponseConfig} MockResponseConfig */

/**
 * MockRequests will mock both `XMLHttpRequest` and `fetch` such that
 * one single configure call, and the entire app is provided with mocks.
 *
 * URLs not configured will be unaffected and still trigger an
 * async request as normal.
 *
 * @namespace MockRequests
 */
 const MockRequests = (function MockRequestsFactory() {
    /**
     * @name {@link JsonPrimitive}
     * @kind typedef
     * @memberOf MockRequests
     */
    /**
     * @name {@link DynamicResponseModFn}
     * @kind typedef
     * @memberOf MockRequests
     */
    /**
     * @name {@link MockResponseConfig}
     * @kind typedef
     * @memberOf MockRequests
     */

    /**
     * Key (URL string) - Value ({@link MockResponseConfig}) pairs for network mocks
     *
     * @type {Object<string, MockResponseConfig>}
     */
    let urlResponseMap = {};

    /**
     * Original XMLHttpRequest class, as defined in the global environment.
     *
     * @type {(XMLHttpRequest|undefined)}
     * @memberOf MockRequests
     */
    let OriginalXHR;

    /**
     * Original fetch function, as defined in the global environment.
     *
     * @type {(function|undefined)}
     * @memberOf MockRequests
     */
    let originalFetch;

    const globalScope = (
        typeof window !== 'undefined'
            ? window
            : typeof self !== 'undefined'
                ? self
                : global
    );

    /**
     * Initialize the mock with response objects.
     *
     * @param  {Object<string, JsonPrimitive>} apiUrlResponseConfig - Config object containing URL strings as keys and respective mock response objects as values
     * @param {boolean} [overwritePreviousConfig=true] - If the map from a previous configure call should be overwritten by this call (true) or not (false)
     * @memberOf MockRequests
     */
    function configure(apiUrlResponseConfig = {}, overwritePreviousConfig = true) {
        const newUrlResponseMap = mapStaticConfigToDynamic(apiUrlResponseConfig);

        if (overwritePreviousConfig) {
            urlResponseMap = newUrlResponseMap;
        } else {
            urlResponseMap = { ...urlResponseMap, ...newUrlResponseMap };
        }
    }

    /**
     * Initialize the mock with response objects and their dynamic update functions
     *
     * @param {Object<string, MockResponseConfig>} dynamicApiUrlResponseConfig - URL-MockResponseConfig mappings
     * @param {boolean} [overwritePreviousConfig=true] - If the map from a previous configure call should be overwritten by this call (true) or not (false)
     * @memberOf MockRequests
     */
    function configureDynamicResponses(dynamicApiUrlResponseConfig = {}, overwritePreviousConfig = true) {
        const newUrlResponseMap = Object.keys(dynamicApiUrlResponseConfig).reduce((mockResponses, url) => {
            const config = createConfigObj(dynamicApiUrlResponseConfig[url]);

            if (config.usePathnameForAllQueries) {
                const { pathname } = getPathnameAndQueryParams(url);
                mockResponses[pathname] = config;
            } else {
                mockResponses[url] = config;
            }

            return mockResponses;
        }, {});

        if (overwritePreviousConfig) {
            urlResponseMap = newUrlResponseMap;
        } else {
            urlResponseMap = { ...urlResponseMap, ...newUrlResponseMap };
        }
    }

    /**
     * Mock any network requests to the given URL using the given responseObject
     *
     * @param {string} url - URL to mock
     * @param {JsonPrimitive} response - Mock response object
     * @memberOf MockRequests
     */
    function setMockUrlResponse(url, response = null) {
        urlResponseMap[url] = createConfigObj({ response });
    }

    /**
     * Mock any network requests to the given URL using the given responseObject
     * and dynamic response modification function
     *
     * @param {string} url - URL to mock
     * @param {MockResponseConfig} mockResponseConfig - Config object with the fields desired to be configured
     * @memberOf MockRequests
     */
    function setDynamicMockUrlResponse(url, mockResponseConfig) {
        const config = createConfigObj(mockResponseConfig);

        if (config.usePathnameForAllQueries) {
            const { pathname } = getPathnameAndQueryParams(url);
            urlResponseMap[pathname] = config;
        } else {
            urlResponseMap[url] = config;
        }
    }

    /**
     * Get the mock response object associated with the passed URL
     *
     * @param {string} url - URL that was previously mocked
     * @returns {JsonPrimitive} - Configured response object
     * @memberOf MockRequests
     */
    function getResponse(url) {
        const config = getConfig(url);

        if (!config) {
            return undefined;
        }

        return config.response;
    }

    /**
     * Deletes the URL and respective mock object
     *
     * @param {string} url - URL that was previously mocked
     * @returns {boolean} - Value returned from `delete Object.url`
     * @memberOf MockRequests
     */
    function deleteMockUrlResponse(url) {
        const config = getConfig(url);

        if (config.usePathnameForAllQueries) {
            const { pathname } = getPathnameAndQueryParams(url);
            return delete urlResponseMap[pathname];
        }

        return delete urlResponseMap[url];
    }

    /**
     * Deletes all entries in the MockRequests configuration
     *
     * @memberOf MockRequests
     */
    function clearAllMocks() {
        urlResponseMap = {};
    }

    /**
     * Gets the config object for a specified URL or its pathname if the URL itself isn't mocked
     *
     * @param {string} url
     * @returns {(MockResponseConfig|null)}
     */
    function getConfig(url) {
        const isMocked = urlIsMocked(url);

        if (!isMocked) {
            return null;
        }

        const { pathname } = getPathnameAndQueryParams(url);
        const config = urlResponseMap[url] || urlResponseMap[pathname];

        return config;
    }

    /**
     * Create the default MockResponseConfig object structure, ensuring all fields exist and populating with default
     * values as necessary.
     *
     * @param {MockResponseConfig} mockResponseConfig - Config object with the fields desired to be configured
     * @returns {MockResponseConfig}
     */
    function createConfigObj({
        response = null,
        dynamicResponseModFn = null,
        delay = 0,
        usePathnameForAllQueries = false,
        responseProperties = {},
    } = {}) {
        const mockResponseConfig = {
            response: null,
            dynamicResponseModFn: null,
            delay: 0,
            usePathnameForAllQueries: false,
            responseProperties,
        };

        mockResponseConfig.response = deepCopyObject(response);

        if (dynamicResponseModFn && typeof dynamicResponseModFn === 'function') {
            mockResponseConfig.dynamicResponseModFn = dynamicResponseModFn;
        }

        if (delay) {
            mockResponseConfig.delay = delay;
        }

        mockResponseConfig.usePathnameForAllQueries = Boolean(usePathnameForAllQueries);

        return mockResponseConfig;
    }

    /**
     * Deep copies a JS object
     *
     * @param {JsonPrimitive} [obj=null]
     * @returns {JsonPrimitive}
     */
    function deepCopyObject(obj = null) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Reformats a static URL-response config object to match the dynamic MockResponseConfig object structure
     *
     * @param {Object<string, JsonPrimitive>} staticConfig - URL-staticResponse map
     * @returns {Object<string, MockResponseConfig>} - URL-MockResponseConfig object with default configuration fields
     * @memberOf MockRequests
     */
    function mapStaticConfigToDynamic(staticConfig) {
        return Object.keys(staticConfig).reduce((dynamicMockConfig, staticUrl) => {
            dynamicMockConfig[staticUrl] = createConfigObj({ response: staticConfig[staticUrl] });

            return dynamicMockConfig;
        }, {});
    }

    /**
     * Gets the `responseText` for XHR or `res.text()` for fetch.
     *
     * @param {JsonPrimitive} response
     */
    function castToString(response) {
        return (typeof response === typeof {}) ? JSON.stringify(response) : `${response}`;
    }

    /**
     * Parses a URL for query parameters/hash entry and extracts the pathname/query parameter map respectively.
     *
     * @param {string} url - URL to parse for query parameters
     * @returns {{hasQueryParams: boolean, queryParamMap: Object<string, string>, pathname: string}} - Pathname, query parameter map, and if query params/hash exist
     */
    function getPathnameAndQueryParams(url) {
        const queryIndex = url.indexOf('?');
        const hasQueryParams = queryIndex >= 0;
        const hashIndex = url.indexOf('#');
        const hasHash = hashIndex >= 0;
        const pathname = hasQueryParams ?
            url.substring(0, queryIndex)
            : hasHash ?
                url.substring(0, hashIndex)
                : url;
        const queryString = hasQueryParams ?
            hasHash ?
                url.substring(queryIndex + 1, hashIndex)
                : url.substring(queryIndex + 1)
            : '';
        const hashString = hasHash ? url.substring(hashIndex + 1) : '';
        const queryParamMap = queryString.length === 0 ? {} : queryString.split('&').reduce((queryParamObj, query) => {
            const unparsedKeyVal = query.split('=');
            const key = decodeURIComponent(unparsedKeyVal[0]);
            const val = decodeURIComponent(unparsedKeyVal[1]);

            queryParamObj[key] = val;

            return queryParamObj;
        }, {});

        if (hashString.length > 0) {
            queryParamMap.hash = decodeURIComponent(hashString);
        }

        return {
            pathname,
            queryParamMap,
            hasQueryParams: hasQueryParams || hasHash
        };
    }

    function urlIsMocked(url) {
        const urlIsMocked = urlResponseMap.hasOwnProperty(url);
        const { pathname, hasQueryParams } = getPathnameAndQueryParams(url);
        const pathnameIsMocked = urlResponseMap.hasOwnProperty(pathname);

        return urlIsMocked || (hasQueryParams && pathnameIsMocked && urlResponseMap[pathname].usePathnameForAllQueries);
    }

    /**
     * Parse payload content from fetch/XHR such that if it's a stringified object,
     * the object is returned. Otherwise, return the content as-is.
     *
     * @param {*} content
     * @returns {(JsonPrimitive|*)} - Object if the content is a stringified object, otherwise the passed content
     */
    function attemptParseJson(content) {
        let parsedContent;

        try {
            parsedContent = JSON.parse(content);
        } catch (e) {
            parsedContent = content;
        }

        return parsedContent;
    }

    /**
     * Returns the configured mock response. If a dynamic response modification function exists, then modify the
     * response before returning it and save it to the urlRequestMap.
     *
     * @param {string} url
     * @param {JsonPrimitive} requestPayload
     * @returns {JsonPrimitive} - Configured response after the dynamic modification function has been run (if it exists)
     */
    async function getResponseAndDynamicallyUpdate(url, requestPayload) {
        const mockResponseConfig = getConfig(url);

        if (mockResponseConfig.dynamicResponseModFn && typeof mockResponseConfig.dynamicResponseModFn === 'function') {
            const { queryParamMap } = getPathnameAndQueryParams(url);
            const newResponse = deepCopyObject(
                await mockResponseConfig.dynamicResponseModFn(
                    attemptParseJson(requestPayload),
                    mockResponseConfig.response,
                    queryParamMap
                )
            );

            mockResponseConfig.response = newResponse;
        }

        return mockResponseConfig.response;
    }

    /**
     * Composes the passed function with a timeout delay if it exists
     *
     * @param {number} delay - Milliseconds delay
     * @param {function} func - Function to wrap
     * @returns {function} - Original function if no delay or same function to be called after a delay
     */
    function withOptionalDelay(delay, func = () => {}) {
        if (delay) {
            return (...args) => {
                setTimeout(() => {
                    func(...args);
                }, delay);
            };
        }

        return func;
    }

    /**
     * Creates an event with the desired properties.
     *
     * Supported on:
     *  - Modern browsers.
     *  - IE >= 9 (`Event` constructor and `CustomEvent` aren't polyfilled by Babel).
     *  - NodeJS (with polyfills).
     *
     * @param {string} eventType - Event to create.
     * @param {Object} [options]
     * @param {HTMLElement} [options.element=self] - Target element on which to dispatch the event.
     * @param {boolean} [options.bubbles=false] - If the event bubbles.
     * @param {boolean} [options.cancelable=false] - If the event is cancellable.
     * @param {boolean} [options.composed=false] - If the event can trigger listeners outside of a shadow DOM.
     * @param {Object} [options.properties] - Custom fields to add to the event object.
     * @returns {function} - Function to dispatch the event when desired.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events}
     */
    function createEvent(
        eventType,
        {
            element = globalScope,
            bubbles = false,
            cancelable = false,
            composed = false,
            properties = {},
        } = {}
    ) {
        /**
         * Event to dispatch for event listeners added via `addEventListener()` to receive.
         *
         * @type {Event}
         * @see [MDN Event docs]{@link https://developer.mozilla.org/en-US/docs/Web/API/Event}
         */
        let event;

        try {
            // Only supported in NodeJS >= 15 and modern browsers
            event = new Event(eventType, { bubbles, cancelable, composed });
        } catch (eventConstructorNotSupported) {
            try {
                // Deprecated, but required to support IE >= 9
                event = document.createEvent('Event');

                event.initEvent(eventType, bubbles, cancelable);
            } catch (documentNotInGlobalScope) {
                event = {
                    type: eventType,
                    bubbles,
                    cancelable,
                    composed,
                    target: element,
                    currentTarget: element,
                    isTrusted: false,
                    defaultPrevented: false,
                    eventPhase: 0,
                    path: [], // Path from root to element
                    cancelBubble: false, // Deprecated
                    returnValue: true, // Deprecated
                    srcElement: element, // Deprecated
                    timeStamp: 1234,
                    toString: () => '[object Event]',
                    initEvent(type, bubbles = false, cancelable = false) {
                        this.type = type;
                        this.bubbles = bubbles;
                        this.cancelable = cancelable;
                    },
                    preventDefault() {
                        this.defaultPrevented = true;
                    },
                    stopPropagation() {
                        this.bubbles = false;
                        this.cancelBubble = true;
                    },
                    stopImmediatePropagation() {
                        this.stopPropagation();
                    },
                };
            }
        }

        // There are no built-in `Event` functions to add custom event properties,
        // so they must be attached to the event object directly
        Object.entries(properties).forEach(([ key, value ]) => {
            Object.defineProperty(event, key, {
                configurable: false,
                writable: false,
                enumerable: true,
                value,
            });
        });

        return () => element && element.dispatchEvent && element.dispatchEvent(event);
    }

    /**
     * Overwrites the XMLHttpRequest function with a wrapper that
     * mocks the readyState, status, statusText, and various other
     * fields that depend on the status of the request, and applies
     * the mock object response to the `xhr.response` field.
     *
     * The wrapper always marks the request as successful,
     * e.g. status = 200 and statusText = 'OK'
     */
    function overwriteXmlHttpRequestObject() {
        const globalXhrExists = !!(globalScope.XMLHttpRequest);
        const localXhrExists = typeof XMLHttpRequest !== typeof undefined;

        if (!globalXhrExists && !localXhrExists) {
            return;
        }

        OriginalXHR = XMLHttpRequest;

        XMLHttpRequest = function() {
            const xhr = new OriginalXHR();

            async function mockXhrRequest(requestPayload) {
                const config = getConfig(xhr.url);
                const mockedResponse = await getResponseAndDynamicallyUpdate(xhr.url, requestPayload);
                const mockedValues = {
                    readyState: 4,
                    response: mockedResponse,
                    responseText: castToString(mockedResponse),
                    responseUrl: xhr.url,
                    status: 200,
                    statusText: 'OK',
                    timeout: 0,
                    ...config.responseProperties,
                    headers: {
                        status: '200',
                        ...config.responseProperties.headers,
                    },
                };

                Object.entries(mockedValues).forEach(([ key, value ]) => {
                    Object.defineProperties(xhr, {
                        [key]: {
                            configurable: true,
                            enumerable: true,
                            // Must use getter/setter because `Object.defineProperty(xhr, ...)` fails if the field only uses
                            // a getter/unset setter. Properties with `writable`/`value` still work as expected.
                            get() {
                                return this[`_${key}`];
                            },
                            set(newValue) {
                                this[`_${key}`] = newValue;
                                return this;
                            },
                        },
                        [`_${key}`]: {
                            configurable: true,
                            enumerable: false,
                            writable: true,
                            value: mockedValues[key],
                        },
                    });
                });

                function getResponseHeader(headerKey) {
                    const headerVal = this.headers[headerKey];

                    if (headerVal != null) {
                        return headerVal;
                    }

                    return null;
                }

                function getAllResponseHeaders() {
                    return Object.entries(this.headers)
                        .map(([ headerKey, headerVal ]) => `${headerKey}: ${headerVal}`)
                        .join('\r\n');
                }

                xhr.getResponseHeader = getResponseHeader.bind(xhr);
                xhr.getAllResponseHeaders = getAllResponseHeaders.bind(xhr);
            }

            xhr.originalOpen = xhr.open;
            xhr.open = function(method, url, ...args) {
                xhr.url = url;
                xhr.originalOpen(method, url, ...args);
            };

            xhr.originalSend = xhr.send;
            xhr.send = async function(requestPayload) {
                if (urlIsMocked(xhr.url)) {
                    const config = getConfig(xhr.url);

                    await mockXhrRequest(requestPayload);

                    const resolveEvents = [
                        {
                            eventType: 'readystatechange',
                        },
                        {
                            eventType: 'load',
                            // `ProgressEvent` properties: https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent/ProgressEvent
                            properties: {
                                lengthComputable: true,
                                loaded: xhr.responseText.length,
                                total: xhr.responseText.length,
                            }
                        },
                        {
                            // Used by Axios
                            eventType: 'loadend',
                            properties: {
                                lengthComputable: true,
                                loaded: xhr.responseText.length,
                                total: xhr.responseText.length,
                            }
                        },
                    ];

                    resolveEvents.forEach(({ eventType, properties }) => {
                        const resolveRequest = () => {
                            const resolveOnHandler = xhr[`on${eventType}`] || (() => {});
                            const resolveEvent = createEvent(eventType, {
                                element: xhr,
                                properties,
                            });

                            resolveOnHandler(properties);
                            resolveEvent();
                        };
                        const resolveAfterDelay = withOptionalDelay(config.delay, resolveRequest);

                        resolveAfterDelay();
                    });
                } else {
                    xhr.originalSend(requestPayload);
                }
            };

            return xhr;
        }
    }

    /**
     * Overwrites the fetch() function with a wrapper that mocks
     * the response value after the configured delay has passed.
     */
    function overwriteFetch() {
        const globalFetchExists = !!(globalScope.fetch);
        const localFetchExists = typeof fetch !== typeof undefined;

        if (!globalFetchExists && !localFetchExists) {
            return;
        }

        originalFetch = globalScope.fetch.bind(globalScope);

        globalScope.fetch = function(resource, init) {
            const isUsingRequestObject = typeof resource === typeof {};
            const url = isUsingRequestObject ? resource.url : resource;

            if (urlIsMocked(url)) {
                return (async () => {
                    const config = getConfig(url);
                    const requestPayload = isUsingRequestObject
                        ? attemptParseJson(await resource.text())
                        : (init && init.hasOwnProperty('body') && init.body)
                            ? attemptParseJson(init.body)
                            : undefined;
                    const responseBody = await getResponseAndDynamicallyUpdate(url, requestPayload);
                    const response = {
                        clone() {
                            return this;
                        },
                        json: () => Promise.resolve(responseBody),
                        text: () => Promise.resolve(castToString(responseBody)),
                        status: 200,
                        statusText: '',
                        ok: true,
                        redirected: false,
                        type: 'basic',
                        url,
                        ...config.responseProperties,
                        headers: new Headers({
                            status: '200',
                            ...config.responseProperties?.headers,
                        }),
                    };

                    return await new Promise(resolve => {
                        const resolveAfterDelay = withOptionalDelay(config.delay, resolve);
                        resolveAfterDelay(response);
                    });
                })();
            } else {
                return originalFetch(resource, init);
            }
        }
    }

    overwriteXmlHttpRequestObject();
    overwriteFetch();

    return {
        configure,
        configureDynamicResponses,
        setMockUrlResponse,
        setDynamicMockUrlResponse,
        getResponse,
        deleteMockUrlResponse,
        clearAllMocks,
        mapStaticConfigToDynamic,
        OriginalXHR,
        originalFetch
    };
})();