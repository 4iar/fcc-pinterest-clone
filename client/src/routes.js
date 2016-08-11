import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import Header from './containers/Header';
import HomePage from './containers/HomePage';

export default (
  <Route path="/" component={Header}>
    <IndexRedirect to="/home" />
    <Route path="home" component={HomePage}/>
  </Route>
);
