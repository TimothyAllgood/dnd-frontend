import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';

require('./Friend.css');

function Friend({ friend }) {
	console.log(friend);
	return (
		<div className='friend-card'>
			<NavLink to={`/users/${friend.id}`}>
				<img className='friend-img' src={friend.img} width='200px' alt='' />
				<div className='friend-info'>
					<h3>{friend.username}</h3>
					<p>{friend.roles ? friend.roles : 'Undecided'}</p>
				</div>
			</NavLink>
		</div>
	);
}

export default withRouter(Friend);
