import axios from 'axios';

const BASE_URL = 'https://shrouded-castle-10865.herokuapp.com/api';

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

	static updateImg = async (userID, img) => {
		const formData = new FormData();
		formData.append('img', img);
		const config = {
			headers: {
				'content-type': 'multipart/form-data',
			},
		};

		return axios.post(`${BASE_URL}/v1/users/image/${userID}`, formData, config);
	};

	static addFriend = async (userID, friend) => {
		return axios.post(`${BASE_URL}/v1/users/addfriend/${userID}`, friend);
	};
}
