import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router';
import history from 'common/history';
import TopBar from 'components/TopBar';
import routeConfig from 'config/routeConfig';

export default function RouterConfig() {
  return (
    <Router history={history}>
      <Switch>
        <Route path={routeConfig.home} exact>
          <TopBar />
        </Route>
        <Route path={routeConfig.testPage} exact>
          <TopBar />
        </Route>
        <Redirect to={routeConfig.home} />
      </Switch>
    </Router>
  );
}
