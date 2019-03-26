import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { Router, Switch } from 'dva/router';
import Route from 'components/RouteWithTitle';
import routeConfig from 'config/routeConfig';

const IndexPage = lazy(() => import('routes/IndexPage'));
const DetailPage = lazy(() => import('routes/DetailPage'));

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path={routeConfig.home.path} cnName={routeConfig.home.cnName} exact>
            <IndexPage />
          </Route>
          <Route path={routeConfig.detail.path} cnName={routeConfig.detail.cnName} exact>
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
