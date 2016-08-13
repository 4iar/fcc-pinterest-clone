import React from 'react';
import {connect} from 'react-redux';
import Masonry from 'react-masonry-component';

import Post from '../components/Post';
import '../styles/posts.scss';



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
      posts: props.posts,
      postCreatedByIdFilter: props.postCreatedByIdFilter ? props.postCreatedByIdFilter : null
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      posts: newProps.posts,
      postCreatedByIdFilter: newProps.postCreatedByIdFilter ? newProps.postCreatedByIdFilter : null
    });
  }

  render() {
    if (!this.state.posts) {
      return (<div>no posts loaded</div>);
    }

    return (
      <div>
        <Masonry
          className={'posts'} // default ''
          elementType={'div'} // default 'div'
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
          {this.state.posts && this.state.posts.length > 0 &&
          this.state.posts.map((b) => {
            const post = (<Post key={b.id} post={b} />)
            if (this.state.postCreatedByIdFilter) {
              if (this.state.postCreatedByIdFilter === b.createdByUserId) {
                return post;
              }
            } else {
              return post;
            }
          })}
        </Masonry>
        }
      </div>
    );
  }
}
