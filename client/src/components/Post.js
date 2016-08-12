import React from 'react';
import {Card, CardActions, CardText, CardMedia, CardTitle} from 'material-ui/Card';
import {cyan700} from 'material-ui/styles/colors';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import {connect} from 'react-redux';
import _ from 'lodash';


import '../styles/posts.scss';

function getState(state) {
  return {
    userId: state.user.id
  };
}


@connect(getState, null)
export default class Post extends React.Component {
  render() {
    const likes = _.sum(_.values(this.props.likes).concat(0));  // hacky way to get number of true values
    const liked = !!this.props.post.likes[this.props.userId];
    const isOwner = this.props.post.createdByUserId === this.props.userId;

    return (
      <Card className="post">

        <CardMedia className="image" size={30} >
          <img src="http://www.material-ui.com/images/nature-600-337.jpg"/>
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
              <IconButton tooltip="+1" disabled={!this.props.userId}>
                <ActionThumbUp color={liked ? cyan700 : null} primary={true}/>
              </IconButton>
            </Badge>

            {isOwner &&
            <IconButton tooltip="delete post">
              <ActionDelete color={liked ? cyan700 : null} primary={true}/>
            </IconButton>
            }
          </div>
        </CardActions>
      </Card>
    );
  }
}
