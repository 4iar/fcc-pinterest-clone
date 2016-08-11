import { combineReducers } from 'redux';
import posts from './postsReducer';
import user from './userReducer';
import notification from './notificationReducer';
import {routerReducer} from 'react-router-redux';


const rootReducer = combineReducers({
  user,
  posts,
  notification,
  routing: routerReducer,
});

export default rootReducer;
