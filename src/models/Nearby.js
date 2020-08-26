import axios from 'axios';

const BASE_URL = 'https://shrouded-castle-10865.herokuapp.com/api';

export default class Nearby {
	static get = async (userID) => {
		return axios.get(`${BASE_URL}/v1/users/nearby/${userID}`);
	};
}
