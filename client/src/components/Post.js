import React from 'react';
import {Card, CardActions, CardText, CardMedia, CardTitle} from 'material-ui/Card';
import {cyan700} from 'material-ui/styles/colors';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up';
import {connect} from 'react-redux';
import _ from 'lodash';


import '../styles/posts.scss';


@connect(null, null)
export default class Post extends React.Component {
  render() {
    console.log(this.props.likes);
    const likes = _.sum(_.values(this.props.likes).concat(0));  // hacky way to get number of true values
    console.log(likes);

    return (
      <Card className="post">

        <CardMedia className="image" size={30} >
          <img src="http://www.material-ui.com/images/nature-600-337.jpg"/>
        </CardMedia>

        <CardTitle className="title">
          <div>{this.props.title}</div>
        </CardTitle>

        <CardActions>
          <div className="attend" >
            <Badge
              badgeContent={likes}
              secondary={true}
              badgeStyle={{top: 12, right: 12}}
            >
              <IconButton onClick={console.log} tooltip="+1">
                <ActionThumbUp secondary={true}/>
              </IconButton>
            </Badge>
          </div>
        </CardActions>
      </Card>
    );
  }
}
