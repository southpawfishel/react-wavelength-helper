import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App/App';
import { appStore } from './store/AppStore';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={appStore}><App /></Provider>
  </React.StrictMode>,
  document.getElementById('root')
);