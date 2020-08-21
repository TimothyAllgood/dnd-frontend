import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar({ currentUser, username, logout }) {
	return (
		<nav>
			<div className='container'>
				<div className='logo'>
					<h1>
						<NavLink to='/'>DnDGo</NavLink>
					</h1>
				</div>
				<ul className='nav-list'>
					{currentUser && (
						<>
							<li className='nav-item'>
								<NavLink className='nav-link' to={`/profile/${currentUser}`}>
									Welcome, {username}
								</NavLink>
							</li>
							<li className='nav-item'>
								<NavLink className='nav-link' to={`/nearby/${currentUser}`}>
									Nearby
								</NavLink>
							</li>
							<li className='nav-item'>
								<span onClick={logout} className='nav-link'>
									Logout
								</span>
							</li>
						</>
					)}
					{!currentUser && (
						<>
							<li className='nav-item'>
								<NavLink className='nav-link' to='/login'>
									Login
								</NavLink>
							</li>
							<li className='nav-item'>
								<NavLink className='nav-link' to='/register'>
									Sign Up
								</NavLink>
							</li>
						</>
					)}
				</ul>
			</div>
		</nav>
	);
}

export default Navbar;
