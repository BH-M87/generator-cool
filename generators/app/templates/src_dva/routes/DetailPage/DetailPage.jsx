import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import utils from 'common/utils';
import styles from './DetailPage.less';

// using styles prefix instead of css module
const cx = utils.classnames(styles.prefix, styles);

@connect(({ example }) => ({
  example,
}))
class DetailPage extends Component {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    example: PropTypes.object,
  };
  static defaultProps = {};

  render() {
    return (
      <div className={cx('container')}>
        DetailPage: {this.props.example.text}
      </div>
    );
  }
}

export default DetailPage;
