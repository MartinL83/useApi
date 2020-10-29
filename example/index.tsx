import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CreateClient } from '../src';

const client = new CreateClient({
  uri: 'http://root.tld',
});

const posts = client.addEndpoint({
  name: 'posts',
  path: '/posts/:postId',
});

const App = () => {
  return <div>Hello</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
