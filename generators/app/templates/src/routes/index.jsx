import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router';
import history from 'common/history';

export default function RouterConfig() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/home" exact />
        <Redirect to="/home" />
      </Switch>
    </Router>
  );
}
