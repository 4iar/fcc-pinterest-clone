import initialState from './initialState';


export default function posts(state = initialState.posts, action) {
  switch (action.type) {
    case 'RECEIVE_POSTS': {
      return {
        ...state,
        posts: action.payload.posts,
        loading: false
      };
    }
    case 'REQUEST_POSTS': {
      return {
        ...state,
        loading: true
      };
    }
    default:
      return state;
  }
}
