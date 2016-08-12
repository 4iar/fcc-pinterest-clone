import axios from 'axios';
import {API_POSTS_ENDPOINT} from '../constants/endpoints';


export function requestPosts() {
  return {
    type: 'REQUEST_POSTS'
  };
}

export function receivePosts(posts) {
  return {
    type: 'RECEIVE_POSTS',
    payload: {
      posts
    }
  };
}

export function fetchPosts() {
  return function (dispatch) {
    console.log("fetching")
    dispatch(requestPosts());
    const endpoint = API_POSTS_ENDPOINT;
    axios.get(endpoint)
      .then((response) => {
        dispatch(receivePosts(response.data.posts));
      });
  };
}
