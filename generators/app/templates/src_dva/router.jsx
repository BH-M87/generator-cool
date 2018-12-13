import React from 'react';
import PropTypes from 'prop-types';
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

RouterConfig.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object,
};

export default RouterConfig;