import React from 'react';
import { NavLink } from 'react-router-dom';

function NearbyUser({ user }) {
	return (
		<div>
			<NavLink to={`/users/${user._id}`}>
				<img src={user.profileImg} width='200px' alt='' />
				<p>{user.username}</p>
				<p>{user.role}</p>
			</NavLink>
		</div>
	);
}

export default NearbyUser;
