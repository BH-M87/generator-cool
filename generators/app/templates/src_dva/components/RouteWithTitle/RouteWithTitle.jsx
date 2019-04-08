import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'dva/router';
import DocumentTitle from 'react-document-title';

const RouteWithTitle = ({
  title, cnName, children, exact, isReverse, ...restProps
}) => {
  const getTitle = _cnName => {
    if (!_cnName) {
      return title;
    }
    const cnNameArr = [title].concat(Array.isArray(_cnName) ? _cnName : [_cnName]);
    return (isReverse ? cnNameArr.reverse() : cnNameArr).join(' - ');
  };

  const joinedTitle = getTitle(cnName);
  return (
    <Route exact={exact} {...restProps}>
      {joinedTitle ? <DocumentTitle title={joinedTitle}>{children}</DocumentTitle> : children}
    </Route>
  );
};

RouteWithTitle.propTypes = {
  title: PropTypes.string,
  cnName: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  exact: PropTypes.bool,
  path: PropTypes.string.isRequired, // Switch component:31: const path = child.props.path || child.props.from;
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  isReverse: PropTypes.bool
};

RouteWithTitle.defaultProps = {
  title: '',
  exact: true,
  isReverse: true
};

export default RouteWithTitle;
