import axios from 'axios';

export default class User {
	static register = async (user) => {
		return axios.post(`http://localhost:4000/api/v1/auth/register`, user);
	};

	static login = async (user) => {
		return axios.post(`http://localhost:4000/api/v1/auth/login`, user);
	};
}
