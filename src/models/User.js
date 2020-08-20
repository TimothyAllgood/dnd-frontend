import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

export default class User {
	static register = async (user) => {
		return axios.post(`${BASE_URL}/v1/auth/register`, user);
	};

	static login = async (user) => {
		return axios.post(`${BASE_URL}/v1/auth/login`, user);
	};

	static get = async (userID) => {
		return axios.get(`${BASE_URL}/v1/users/${userID}`);
	};

	static update = async (userID, user) => {
		return axios.post(`${BASE_URL}/v1/users/${userID}`, user);
	};
}
