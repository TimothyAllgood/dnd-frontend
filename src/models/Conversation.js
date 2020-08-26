import axios from 'axios';

const BASE_URL = 'https://shrouded-castle-10865.herokuapp.com/api';

export default class Conversation {
	static get = async (userOne, userTwo) => {
		return axios.get(`${BASE_URL}/v1/messages/${userOne}/${userTwo}`);
	};
	static start = async (userOne, userTwo) => {
		return axios.post(`${BASE_URL}/v1/messages/${userOne}/${userTwo}`);
	};
	static getAll = async (userOne) => {
		return axios.get(`${BASE_URL}/v1/messages/conversations/${userOne}`);
	};

	static getOneByID = async (id) => {
		return axios.get(`${BASE_URL}/v1/messages/conversationByID/${id}`);
	};

	static addMessage = async (userOne, userTwo, messageContent) => {
		return axios.post(
			`${BASE_URL}/v1/messages/conversation/${userOne}/${userTwo}`,
			messageContent
		);
	};
}
