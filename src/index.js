import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './ui/index.css';
import App from './ui/App';
import { createStore } from './ui/redux/store';

const store = createStore();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
