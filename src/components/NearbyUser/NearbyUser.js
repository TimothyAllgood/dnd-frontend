import React from 'react';
import { NavLink } from 'react-router-dom';
require('./NearbyUser.css');

function NearbyUser({ user }) {
	return (
		<div className='nearby-card'>
			<NavLink to={`/users/${user._id}`}>
				<img
					className='nearby-img'
					src={user.profileImg}
					width='200px'
					alt=''
				/>
				<div className='nearby-info'>
					<h3>{user.username}</h3>
					<p>{user.roles ? user.roles : 'Undecided'}</p>
				</div>
			</NavLink>
		</div>
	);
}

export default NearbyUser;
