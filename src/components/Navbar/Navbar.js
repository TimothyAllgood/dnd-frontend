import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

class Navbar extends React.Component {
	state = {
		showMenu: false,
	};
	toggleMenu = () => {
		const menu = document.querySelector('.inner-menu');
		menu.classList.toggle('hide-menu');
	};

	logout = () => {
		this.props.logout();
		this.toggleMenu();
	};

	render() {
		const currentUser = this.props.currentUser;
		const username = this.props.username;
		const logout = this.props.logout;
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
									<span
										onClick={this.toggleMenu}
										className='nav-link menu-toggle'
									>
										Welcome, {username} <i className='fas fa-sort-down'></i>
									</span>
								</li>
								<div className='inner-menu hide-menu'>
									<li className='nav-item'>
										<NavLink
											onClick={this.toggleMenu}
											className='nav-link '
											to={`/profile/${currentUser}`}
										>
											View Profile
										</NavLink>
									</li>
									<li className='nav-item'>
										<NavLink
											onClick={this.toggleMenu}
											className='nav-link'
											to={`/nearby/${currentUser}`}
										>
											Nearby
										</NavLink>
									</li>
									<li className='nav-item'>
										<span onClick={this.logout} className='nav-link'>
											Logout
										</span>
									</li>
								</div>
							</>
						)}
						{!currentUser && (
							<>
								<div className='login'>
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
								</div>
							</>
						)}
					</ul>
				</div>
			</nav>
		);
	}
}

export default Navbar;
