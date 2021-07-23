import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './store/rootReducer';
import './scss/main.scss';
import App from './app.jsx';

const store = createStore(rootReducer, compose(applyMiddleware(thunk)));
document.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(
		<React.StrictMode>
			<CookiesProvider>
				<Provider store={store}>
					<App />
				</Provider>
			</CookiesProvider>
		</React.StrictMode>,
		document.getElementById('root')
	);
});