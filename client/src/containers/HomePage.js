import React from 'react';

import AddPost from '../components/AddPost';
import Posts from '../components/Posts';
import Notifications from '../components/Notifications';
import Navbar from '../components/Navbar';


export default class App extends React.Component {
  render() {
    return (
      <div>
        <Navbar postCreatedByIdFilter={this.props.params.id} />
        <Posts postCreatedByIdFilter={this.props.params.id} />
        <Notifications />
        <AddPost />
      </div>
    );
  }
}
