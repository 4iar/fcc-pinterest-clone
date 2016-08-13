import React, {Component} from 'react';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router'


import {promptLogin} from '../actions/userActions';

const allIcon = <FontIcon className="material-icons">all</FontIcon>;
const myIcon = <FontIcon className="material-icons">my</FontIcon>;


function getState(state) {
  return {
    userId: state.user.id
  };
}

@connect(getState, {promptLogin})
export default class Navbar extends Component {
  constructor(props) {
    super(props);

    let selectedIndex = 0;

    if (props.postCreatedByIdFilter === props.userId) {
      selectedIndex = 1;
    } else if (props.postCreatedByIdFilter) {
      selectedIndex = 2;
    }

    this.state = {
      selectedIndex
    };
  }

  componentWillReceiveProps(newProps) {
    let selectedIndex = 0;
    if (newProps.userId && newProps.postCreatedByIdFilter === newProps.userId) {
      selectedIndex = 1;
    } else if (newProps.postCreatedByIdFilter) {
      selectedIndex = 2;
    }

    this.setState({
      selectedIndex
    });
  }

  select(index) {
    if (index === 1) {
      if (this.props.userId) {
        browserHistory.push('/posts/' + this.props.userId)
      } else {
        this.props.promptLogin();
        return;  // dont highlight the button if user cancels login dialogue
      }
    } else if (index === 0) {
      browserHistory.push('/posts');
    }

    this.setState({
      selectedIndex: index
    });
  }

  render() {
    return (
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label="posts"
            icon={allIcon}
            onTouchTap={() => this.select(0)}
          />
          <BottomNavigationItem
            label="posts"
            disabled={false}
            icon={myIcon}
            onTouchTap={() => this.select(1)}
          />
        </BottomNavigation>
      </Paper>
    );
  }
}

