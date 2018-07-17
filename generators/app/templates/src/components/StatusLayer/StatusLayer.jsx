import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import styles from './StatusLayer.scss';

const PREFIX = 'status-layer';
const cx = utils.classnames(PREFIX, styles);

export default class StatusLayer extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
    theme: PropTypes.string,
    status: PropTypes.oneOf(['normal', 'loading', 'empty', 'tip']),
    tipText: PropTypes.string,
  };

  static defaultProps = {
    theme: 'light', // light, dark
    status: 'normal', // normal, loading, empty
  };

  renderLoading() {
    if (this.props.status !== 'loading') return null;
    return (
      <div className={cx('loading', 'content', this.props.theme)}>
        <div className={cx('icon')}>
          <div className={`iconfont icon-loading1 ${cx('loading-icon')}`} />
        </div>
        <div className={cx('font')}>
          <div>数据加载中……</div>
        </div>
      </div>
    );
  }

  renderEmpty() {
    if (this.props.status !== 'empty') return null;
    return (
      <div className={cx('empty', 'content', this.props.theme)}>
        <div className={cx('icon')}>
          <i className="iconfont icon-bukejian1" />
        </div>
        <div className={cx('font')}>
          <div>暂无数据</div>
        </div>
      </div>
    );
  }

  renderTip() {
    if (this.props.status !== 'tip') return null;
    return (
      <div className={cx('disable', 'content', this.props.theme)}>
        <div className={cx('icon')}>
          <i className="iconfont icon-tishi" />
        </div>
        <div className={cx('font')}>
          <div>{this.props.tipText}</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={cx('container')}>
        {this.props.children}
        {this.renderLoading()}
        {this.renderEmpty()}
        {this.renderTip()}
      </div>
    );
  }
}
