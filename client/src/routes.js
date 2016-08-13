import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import Header from './containers/Header';
import HomePage from './containers/HomePage';

export default (
  <Route path="/" component={Header}>
    <IndexRedirect to="/posts" />
    <Route path="/posts" component={HomePage}/>
    <Route path="/posts/:id" component={HomePage}/>
  </Route>
);
