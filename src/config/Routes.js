import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Register from '../components/Register/Register';
import Login from '../components/Login/Login';

export default () => (
	<Switch>
		<Route exact path='/' component={Home} />
		<Route exact path='/register' component={Register} />
		<Route exact path='/login' component={Login} />
	</Switch>
);
