import React from 'react';

import Posts from '../components/Posts';
import Notifications from '../components/Notifications';


export default class App extends React.Component {
  render() {
    return (
      <div>
        <Posts />
        <Notifications />
      </div>
    );
  }
}
