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
  headers?: object | {};
  body?: object;
}

interface RequestResponse {
  response: any;
  error: any;
}

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
    const { name, ...endpoint } = config;
    this.endpoints[name] = endpoint;

    return name;
  }

  getEndpoint(name?: string) {
    if (name) {
      return this.endpoints[name];
    }

    return this.endpoints;
  }

  setHeaders(key: string, value: string) {
    this.headers[key] = value;
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
      const path = createUrl(new PathRegExp(endpoint.path), params);
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

    return fetch(url, requestParams)
      .then(checkNetworkStatus)
      .then(handleResponse)
      .catch(returnError)
      .then(returnResponse);
  }
}

export { Client };
