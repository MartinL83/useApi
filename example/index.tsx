import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Client } from '../src';

const { useEffect, useState } = React;

const api = new Client({
  uri: 'https://jsonplaceholder.typicode.com',
});

const users = api.addEndpoint({
  name: 'users',
  path: '/posts/:postId',
});

const todos = api.addEndpoint({
  name: 'todos',
  path: '/users/:todoPostId/todos',
});

function useApi(name, options) {
  const [state, setState] = useState({
    data: undefined,
    error: false,
    loading: true,
  });

  useEffect(() => {
    if (!state.loading) {
      setState({ loading: true, error: false, data: undefined });
    }

    const runFetch = async () => {
      const { response, error } = await api.request(name, options);

      if (error) {
        setState({
          loading: false,
          error,
          data: undefined,
        });
        return;
      }

      setState({
        loading: false,
        error: false,
        data: response,
      });
    };

    runFetch();
  }, []);

  return state;
}

const App = () => {
  const { loading, error, data } = useApi(['users', 'todos'], {
    params: { postId: 1 },
  });

  console.log({ loading, error, data });

  return <div>Hello</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
