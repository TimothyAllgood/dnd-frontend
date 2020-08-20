import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Register from '../components/Register/Register';
import Login from '../components/Login/Login';
import Profile from '../pages/Profile/Profile';

export default ({ currentUser, setCurrentUser }) => (
	<Switch>
		<Route exact path='/' component={Home} />
		<Route path='/register' component={Register} />
		<Route
			path='/login'
			render={() => <Login setCurrentUser={setCurrentUser} />}
		/>
		<Route path='/users/:id' component={Profile} />
	</Switch>
);
