import React from 'react';
import {connect} from 'react-redux';


function getState(state) {
  return {
    posts: state.posts.posts
  };
}

@connect(getState)
export default class Posts extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      posts: props.posts
    };
  }
  
  componentWillReceiveProps(newProps) {
    console.log(newProps);
    this.setState({
      posts: newProps.posts
    });
  }
  
  render() {
    if (!this.state.posts) {
      return (<div>no posts loaded</div>);
    }
    
    return (
      <div>
        {this.state.posts.map((p) => {
          return p.id;
        })
        }
      </div>
    );
  }
}
