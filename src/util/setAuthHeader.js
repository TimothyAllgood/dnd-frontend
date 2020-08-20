// Sets/Removes Authorization Header for every API call
import axios from 'axios';

const setAuthHeader = (token) => {
	if (token) {
		axios.defaults.headers.common['Authorization'] = token;
	} else {
		delete axios.defaults.headers.common['Authorization'];
	}
};

export default setAuthHeader;
