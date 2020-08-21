import React, { Component } from 'react';
import Nearby from '../../models/Nearby';
import NearbyUser from '../../components/NearbyUser/NearbyUser';

class NearbyContainer extends Component {
	state = {
		nearbyUsers: [],
	};

	async componentDidMount() {
		const nearbyUsers = await Nearby.get(this.props.match.params.id);
		this.setState({
			nearbyUsers: nearbyUsers.data.nearbyUsers,
		});
	}

	render() {
		let nearbyUsers;
		if (this.props.currentUser) {
			nearbyUsers = this.state.nearbyUsers.map((nearbyUser) => {
				return <NearbyUser key={nearbyUser._id} user={nearbyUser} />;
			});
		}
		return <div>{nearbyUsers}</div>;
	}
}

export default NearbyContainer;
