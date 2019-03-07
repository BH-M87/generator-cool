import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Switch } from 'dva/router';
import routeConfig from 'config/routeConfig';

const IndexPage = lazy(() => import('routes/IndexPage'));
const DetailPage = lazy(() => import('routes/DetailPage'));

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path={routeConfig.home.path} exact>
            <IndexPage />
          </Route>
          <Route path={routeConfig.detail.path} exact>
            <DetailPage />
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
}

RouterConfig.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object
};

export default RouterConfig;
