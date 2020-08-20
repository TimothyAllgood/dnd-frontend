import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

class Navbar extends Component {
	render() {
		return (
			<nav>
				<div className='container'>
					<div className='logo'>
						<h1>
							<NavLink to='/'>DnDGo</NavLink>
						</h1>
					</div>
					<ul className='nav-list'>
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
					</ul>
				</div>
			</nav>
		);
	}
}

export default Navbar;
