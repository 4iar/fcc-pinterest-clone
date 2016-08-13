import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import axios from 'axios';
import {connect} from 'react-redux';

import {promptLogin} from '../actions/userActions';
import {sendNotification} from '../actions/notificationActions';
import {fetchPosts} from '../actions/postsActions';
import {API_POSTS_ENDPOINT} from '../constants/endpoints';
import '../styles/addpost.scss';


@connect(null, {promptLogin, sendNotification, fetchPosts})
export default class AddPost extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;
    this.postToAdd = {
      title: '',
      imageUrl: ''
    };

    this.state = {
      error: '',
      open: false,
      waiting: false,
      imageUrl: ''
    };
  }

  handleSubmit() {
    this.setState({
      waiting: true
    });

    axios.post(API_POSTS_ENDPOINT, this.postToAdd)
      .then((data) => {
        this.setState({
          waiting: false,
          open: false
        });
        this.props.sendNotification(data.data.status, data.data.message);
        if (data.data.status === 'error' && data.data.message === 'not logged in') {
          this.props.promptLogin();
        } else {
          this.props.fetchPosts();
        }
      });
  }

  handleChange(field, e) {
    if (field === 'imageUrl') {
      this.setState({
        imageUrl: e.target.value
      });
    }
    this.postToAdd[field] = e.target.value;
  }

  handleOpen = () => {
    this.setState({
      open: true,
      imageUrl: '',
      error: ''
    });

    this.postToAdd = {
      title: '',
      imageUrl: ''
    };
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleImgError() {
    this.setState({
      imageUrl: 'https://i.imgur.com/IjNz9bj.png',
      error: 'broken image'
    });
  }
  render() {
    return (
      <div>
        <Dialog
          title="Add a new post"
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          disabled={this.state.waiting}
        >

          {this.state.imageUrl &&
          <img
            className={"image-preview"}
            src={this.state.imageUrl}
            onError={this.handleImgError.bind(this)}
          />
          }

          <TextField
            className="input"
            floatingLabelText="Title"
            onChange={this.handleChange.bind(this, 'title')}
            fullWidth={true}
          />
          <TextField
            className="input"
            onChange={this.handleChange.bind(this, 'imageUrl')}
            floatingLabelText="Image source url"
            fullWidth={true}
          />
          <br/>
          <RaisedButton
            label="Post"
            labelPosition="before"
            disabled={this.state.waiting || this.state.error}
            primary={true}
            onClick={this.handleSubmit.bind(this)}
          />

        </Dialog>

        <FloatingActionButton className="fab" secondary={true} mini={true} onClick={this.handleOpen}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}
