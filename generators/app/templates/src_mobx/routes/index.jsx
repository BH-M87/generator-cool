import React, { Suspense, lazy } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router';
import history from 'common/history';
import routeConfig from 'config/routeConfig';

const TopBar = lazy(() => import('components/TopBar'));

export default function RouterConfig() {
  return (
    <Router history={history}>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path={routeConfig.home.path} exact>
            <TopBar />
          </Route>
          <Route path={routeConfig.testPage.path} exact>
            <TopBar />
          </Route>
          <Redirect to={routeConfig.home} />
        </Switch>
      </Suspense>
    </Router>
  );
}
