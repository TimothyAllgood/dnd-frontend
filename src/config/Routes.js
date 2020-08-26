import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Register from '../components/Register/Register';
import Login from '../components/Login/Login';
import Profile from '../pages/Profile/Profile';
import NearbyContainer from '../pages/NearbyContainer/NearbyContainer';
import UserProfile from '../pages/Profile/UserProfile';
import ConversationContainer from '../pages/ConversationContainer/ConversationContainer';
import FriendsContainer from '../pages/FriendsContainer/FriendsContainer';

export default ({ currentUser, setCurrentUser }) => (
	<Switch>
		<Route exact path='/' component={Home} />
		<Route path='/register' component={Register} />
		<Route
			path='/login'
			render={() => <Login setCurrentUser={setCurrentUser} />}
		/>
		<Route
			path='/users/:id'
			render={(matchProps) => (
				<Profile {...matchProps} currentUser={currentUser} />
			)}
		/>
		<Route
			path='/profile/:id'
			render={(matchProps) => (
				<UserProfile {...matchProps} currentUser={currentUser} />
			)}
		/>
		<Route
			path='/nearby/:id'
			render={(matchProps) => (
				<NearbyContainer {...matchProps} currentUser={currentUser} />
			)}
		/>
		<Route
			path='/messages/:user'
			render={(matchProps) => (
				<ConversationContainer {...matchProps} currentUser={currentUser} />
			)}
		/>

		<Route
			path='/friends'
			render={(matchProps) => (
				<FriendsContainer {...matchProps} currentUser={currentUser} />
			)}
		/>
	</Switch>
);
