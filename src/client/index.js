import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './store/rootReducer';
import initialState from './store/initialState';
import './scss/main.scss';
import App from './app.jsx';

// Handler service worker registration
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('/service-worker.js').then(() => {
			if('SyncManager' in window) {
				window.serviceWorkerRegistered = true;
				reactRender(true);
			} else {
				reactRender(false);
			}
		}).catch(() => reactRender(false));
	});
} else {
	reactRender(false);
}

function reactRender(isServiceWorkerEnabled) {
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	const store = createStore(
		rootReducer, 
		{...initialState, serviceWorkerEnabled: isServiceWorkerEnabled},
		composeEnhancers(applyMiddleware(thunk)));
	
	if(store.getState().user.darkMode) {
		document.body.classList.add('dark');
	}
	ReactDOM.render(
		<Provider store={store}>
			<App />
		</Provider>,
		document.getElementById('root')
	);
}