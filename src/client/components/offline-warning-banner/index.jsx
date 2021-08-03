import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Redirect } from 'react-router-dom';
import { Offline } from 'react-detect-offline';

import './offline-warning-banner.scss';

const OfflineWarningBanner = (props) => {
	const {
		defaultMessage='It looks like you\'re offline.',
		serviceWorkerMessage='You can still update your existing shiny hunts. We\'ll try to sync up when you\'re back online.',
		showBoth=true
	} = props;
	const serviceWorkerEnabled = useSelector(state => state.serviceWorkerEnabled);
	const userAuthenticated = useSelector(state => state.user.authenticated);
	const location = useLocation();

	return (
		<Offline>
			<div className="offline-warning-banner">
				<div className="content">
					{!serviceWorkerEnabled || showBoth && defaultMessage}
					{serviceWorkerEnabled && serviceWorkerMessage}
				</div>
			</div>
			{userAuthenticated ? location.pathname !== '/active-hunts' && <Redirect to="/active-hunts" /> : location.pathname !== '/' && <Redirect to="/" />}
		</Offline>
	)
}

export default OfflineWarningBanner;