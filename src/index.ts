import { PathRegExp, createUrl } from '@marvinh/path-to-regexp';

import {
  checkNetworkStatus,
  handleResponse,
  returnResponse,
  returnError,
} from './utils';

interface ClientConfig {
  uri: string;
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface EndpointOptions {
  name: string;
  path?: string;
  method?: HttpMethod | 'GET';
  headers?: object;
}

interface RequestOptions {
  params?: Record<string, string | number>;
  body?: object;
  headers?: object | {};
}

interface RequestResponse {
  response: any;
  error: any;
}

/**
 *
 * @param url URL to call
 * @param options Request options to pass to http client.
 */
const httpClient = (url: string, options: RequestInit) =>
  fetch(url, options)
    .then(checkNetworkStatus)
    .then(handleResponse);

class Client {
  uri: string;
  endpoints: any = {};
  headers: any = {
    'content-type': 'application/json',
  };

  constructor(config: ClientConfig) {
    this.uri = config.uri;
  }

  addEndpoint(config: EndpointOptions) {
    const { name, path, ...endpoint } = config;

    const pathname = path ? new PathRegExp(path) : '';

    const data = {
      ...endpoint,
      pathname,
    };

    this.endpoints[name] = data;

    return name;
  }

  getEndpoint(name?: string) {
    if (name) {
      return this.endpoints[name];
    }

    return this.endpoints;
  }

  async request(
    name: string,
    options?: RequestOptions
  ): Promise<RequestResponse> {
    const endpoint = this.getEndpoint(name);
    const { params = {} } = options || {};

    let url;

    // TODO: Query params

    try {
      const path = createUrl(endpoint.pathname, params);
      url = `${this.uri}${path}`;
    } catch (error) {
      url = this.uri;
    }

    const requestParams: RequestInit = {
      method: endpoint.method,
      headers: {
        ...this.headers,
        ...endpoint?.headers,
        ...options?.headers,
      },
    };

    return httpClient(url, requestParams)
      .then(returnResponse)
      .catch(returnError);
  }
}

export { Client };
