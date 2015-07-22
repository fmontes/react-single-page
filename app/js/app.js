import React from 'react';
import ReactDOM from 'react-dom';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import HashHistory from 'react-router/lib/HashHistory';
import Root from './react/Routes';

const rootEl = document.getElementById('myApp');
const history = new HashHistory();

ReactDOM.render(<Root history={history} />, rootEl);
