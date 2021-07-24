import React, {useState} from 'react';
import { useDispatch } from 'react-redux';

import { logout } from '../../store/actions/user';

import './user-widget.scss';

const UserWidget = (props) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const { username, picture } = props;
	const dispatch = useDispatch();

	function performSignOut() {
		dispatch(logout());
	}

	function toggleColorPreference() {
		console.log('dark mode');
	}

	return (
		<div className="user-widget">
			<button className={`user-widget-button ${dropdownOpen && 'expanded'}`} onClick={() => setDropdownOpen(!dropdownOpen)}>
				<div className="user-widget-icon" style={{backgroundImage: `url(${picture})`}}></div>
				<span className="user-widget-text">{username}</span>
			</button>
			<div className={`user-widget-menu ${dropdownOpen && 'open'}`}>
				<button onClick={toggleColorPreference}>Dark Mode</button>
				<button onClick={performSignOut}>Log Out</button>
			</div>
		</div>
	)
}

export default UserWidget;