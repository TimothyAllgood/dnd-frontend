import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

export default class Nearby {
	static get = async (userID) => {
		return axios.get(`${BASE_URL}/v1/users/nearby/${userID}`);
	};
}
