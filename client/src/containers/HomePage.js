import React from 'react';

import Posts from '../components/Posts';
import Notifications from '../components/Notifications';
import BottomNavbar from '../components/BottomNavbar';


export default class App extends React.Component {
  render() {
    return (
      <div>
        <Posts />
        <Notifications />
        <BottomNavbar postCreatedByIdFilter={this.props.params.id} />
      </div>
    );
  }
}
