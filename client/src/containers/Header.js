import React from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { connect } from 'react-redux';
import {fetchPosts} from '../actions/postsActions';
import {fetchCurrentUser} from '../actions/userActions';

injectTapEventPlugin();


@connect(null, {fetchPosts, fetchCurrentUser})
export default class Header extends React.Component {
  constructor(props) {
    super(props);
    console.log("header loaded");
    this.props.fetchPosts();
    this.props.fetchCurrentUser();
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        {this.props.children}
      </MuiThemeProvider>
    );
  }
}
