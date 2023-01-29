import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import initHotReload from './initHotReload';

let root = document.getElementById('root');
if (root) ReactDOM.render(<App />, root);

// if (NODE_ENV == 'development') {
initHotReload();
// }