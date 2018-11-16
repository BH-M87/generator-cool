import React from 'react';
import { connect } from 'dva';
import utils from 'common/utils';
import styles from './IndexPage.less';

// using styles prefix instead of css module
const cx = utils.classnames(styles.prefix, styles);

function IndexPage() {
  return (
    <div className={cx('normal')}>
      <h1 className={cx('title')}>Yay! Welcome to dva!</h1>
      <div className={cx('welcome')} />
      <ul className={cx('list')}>
        <li>
          To get started, edit <code>src/index.js</code> and save to reload.
        </li>
        <li>
          <a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">
            Getting Started
          </a>
        </li>
      </ul>
    </div>
  );
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
