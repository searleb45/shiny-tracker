import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setDarkModePreference } from '../../store/actions/user';

import './user-widget.scss';

const UserWidget = (props) => {
	const isDarkModeEnabled = useSelector(state => state.user.darkMode);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const { username, picture, links } = props;
	const dispatch = useDispatch();

	function performSignOut() {
		window.location.href = 'twitchAuth/logout';
	}

	function toggleColorPreference(e) {
		dispatch(setDarkModePreference(e.target.checked));
	}

	return (
		<div className="user-widget">
			<button className={`user-widget-button ${dropdownOpen && 'expanded'}`} onClick={() => setDropdownOpen(!dropdownOpen)}>
				<div className="user-widget-icon" style={{backgroundImage: `url(${picture})`}}></div>
				<span className="user-widget-text">{username}</span>
			</button>
			<div className={`user-widget-menu ${dropdownOpen && 'open'}`}>
				<div className="mobile-nav-links" onClick={() => setDropdownOpen(false)}>
					{links}
				</div>
				<label htmlFor="darkModeToggle">
					<span>Dark Mode</span>
					<span className="switch">
						<input id="darkModeToggle" type="checkbox" defaultChecked={isDarkModeEnabled} onChange={(e) => toggleColorPreference(e)} />
						<span className="slider round"></span>
					</span>
				</label>
				<button onClick={performSignOut}>Log Out</button>
			</div>
		</div>
	)
}

export default UserWidget;