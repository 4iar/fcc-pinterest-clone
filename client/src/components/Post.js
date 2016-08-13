import React from 'react';
import {Card, CardActions, CardMedia, CardTitle} from 'material-ui/Card';
import {cyan700} from 'material-ui/styles/colors';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import SocialPerson from 'material-ui/svg-icons/social/person';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import _ from 'lodash';
import axios from 'axios';


import {sendNotification} from '../actions/notificationActions';
import {fetchPosts} from '../actions/postsActions';
import {promptLogin} from '../actions/userActions';
import {API_POST_ENDPOINT} from '../constants/endpoints';
import '../styles/posts.scss';

function getState(state) {
  return {
    userId: state.user.id
  };
}


@connect(getState, {sendNotification, fetchPosts, promptLogin})
export default class Post extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      errorImageUrl: null
    };
  }

  onDeleteClick() {
    const endpoint = API_POST_ENDPOINT + this.props.post.id;
    axios.delete(endpoint)
      .then((response) => {
        if (response.data.status === 'success') {
          console.log(response);
          this.props.sendNotification(response.data.status, response.data.message);
          this.props.fetchPosts();
        } else if (response.data.success === 'error') {
          this.props.sendNotification(response.data.status, response.data.message);
        }
      })
  }

  onThumbsUpClick(liked) {
    let choice = liked ? 'unlike' : 'like';
    
    if (!this.props.userId) {
      this.props.promptLogin();
      return;
    }

    const endpoint = API_POST_ENDPOINT + this.props.post.id;
    axios.patch(endpoint, {choice})
      .then((response) => {
        if (response.data.status === 'success') {
          console.log(response);
          this.props.sendNotification(response.data.status, response.data.message);
          this.props.fetchPosts();
        } else if (response.data.success === 'error') {
          this.props.sendNotification(response.data.status, response.data.message);
        }
      })
  }


  handleImgError() {
    this.setState({
      errorImageUrl: 'https://i.imgur.com/IjNz9bj.png'
    });
  }

  render() {
    const likes = _.sum(_.values(this.props.post.likes).concat(0));  // hacky way to get number of true values
    console.log(this.props.post.likes)
    console.log(this.props.userId)
    const liked = !!this.props.post.likes[this.props.userId];
    const isOwner = this.props.post.createdByUserId === this.props.userId;

    return (
      <Card className="post">

        <CardMedia className="image" size={30} >
          <img
            src={this.state.errorImageUrl || this.props.post.imageUrl}
            onError={this.handleImgError.bind(this)}
          />
        </CardMedia>

        <CardTitle className="title">
          <div>{this.props.post.title}</div>
        </CardTitle>

        <CardActions>
          <div className="attend" >
            <Badge
              badgeContent={likes}
              secondary={true}
              badgeStyle={{top: 12, right: 12}}
            >
              <IconButton tooltip={liked ? "-1" : "+1"} onClick={this.onThumbsUpClick.bind(this, liked)}>
                <ActionThumbUp color={liked ? cyan700 : null} primary={true}/>
              </IconButton>
            </Badge>

            {isOwner &&
            <IconButton onClick={this.onDeleteClick.bind(this)} tooltip="delete post">
              <ActionDelete primary={true}/>
            </IconButton>
            }

           <IconButton containerElement={<Link to={"/posts/" + this.props.post.createdByUserId}/>} tooltip="view other posts by this user">
              <SocialPerson primary={true}/>
            </IconButton>

          </div>
        </CardActions>
      </Card>
    );
  }
}
