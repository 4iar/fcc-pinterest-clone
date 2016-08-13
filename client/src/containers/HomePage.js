import React from 'react';

import AddPost from '../components/AddPost';
import Posts from '../components/Posts';
import Notifications from '../components/Notifications';
import BottomNavbar from '../components/BottomNavbar';


export default class App extends React.Component {
  render() {
    return (
      <div>
        <Posts postCreatedByIdFilter={this.props.params.id} />
        <Notifications />
        <BottomNavbar postCreatedByIdFilter={this.props.params.id} />
        <AddPost />
      </div>
    );
  }
}
