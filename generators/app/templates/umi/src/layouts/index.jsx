import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { history } from 'cool-utils';
import Error from 'components/Error';

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = { errorMessage: undefined };
  }

  componentDidCatch(error, info) {
    console.error('Layout Catched Error:', error, info);
    this.setState({
      errorMessage: error.message || 'Layout Catched Error with no message.',
    });
  }

  render() {
    const { errorMessage } = this.state;
    const { children } = this.props;
    if (errorMessage) {
      return (
        <Error
          message={errorMessage}
          returnButtonText="返回首页"
          onReturn={() => {
            history.push('/');
            this.setState({
              errorMessage: undefined,
            });
          }}
        />
      );
    }
    return children;
  }
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
