import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import routeConfig from 'config/routeConfig';
import IndexPage from 'routes/IndexPage';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path={routeConfig.home.path} exact>
          <IndexPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
