import React, { Component } from 'react';
import _ from 'lodash';
import utils from 'common/utils';
import history from 'common/history';
import routeConfig from 'config/routeConfig';

export default Comp =>
  class CheckAuth extends Component {
    componentWillMount() {
      const { pathname } = history.location;
      // role: all or admin
      const routeItem = _.values(routeConfig).find(value => value.path === pathname);
      if (!routeItem) {
        utils.navTo('/');
      }
      const { role = [] } = routeItem;

      if (role.indexOf('common') === -1) {
        utils.navTo('/');
      }
    }
    render() {
      return <Comp {...this.props} />;
    }
  };
