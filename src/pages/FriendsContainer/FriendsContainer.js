import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import User from '../../models/User';
import Friend from '../../components/Friend/Friend';

function FriendsContainer({ currentUser }) {
	const [friends, setfriends] = useState([]);

	useEffect(() => {
		fetchUser();
	});
	const fetchUser = async () => {
		const user = await User.get(currentUser);
		console.log(user.data.foundUser.friends);
		setfriends(user.data.foundUser.friends);
	};

	let friendsList;

	if (friends) {
		friendsList = friends.map((friend) => {
			return (
				<Friend key={friend._id} currentUser={currentUser} friend={friend} />
			);
		});
	}

	return <div class='container friends-container'>{friendsList}</div>;
}

export default withRouter(FriendsContainer);
