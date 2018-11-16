import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shapeSizeMapping from 'config/shapeSizeMapping';
import utils from 'common/utils';
import styles from './Node.less';

const PREFIX = 'node';
const cx = utils.classnames(PREFIX, styles);
const animationRange = 20;

class Node extends Component {
  static propTypes = {
    id: PropTypes.string,
    shape: PropTypes.oneOf(['CIRCLE', 'SQUARE', 'RHOMBUS']),
    icon: PropTypes.string,
    isStartNode: PropTypes.bool,
    text: PropTypes.string,
    className: PropTypes.string,
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  };

  static defaultProps = {
    shape: 'CIRCLE',
    className: '',
  };

  render() {
    const {
      id, className, position, shape, icon, text, isStartNode,
    } = this.props;
    return (
      <div
        id={id}
        className={`${cx('container')} ${className}`}
        style={{
          left: `${position.x - shapeSizeMapping[shape].width / 2}px`,
          top: `${position.y - shapeSizeMapping[shape].height / 2}px`,
        }}
      >
        <div
          className={cx('hover-wrap')}
          style={{
            width: `${shapeSizeMapping[shape].width + animationRange * 2}px`,
            height: `${shapeSizeMapping[shape].height + animationRange * 2}px`,
          }}
        />
        <div
          className={`${cx('icon-wrap', shape.toLowerCase(), { 'start-node': isStartNode })} ${
            isStartNode ? 'iconfont icon-bofang' : ''
          }`}
          style={isStartNode ? {} : { backgroundImage: `url(${icon})` }}
        >
          <div className={cx('picker', 'top-picker')} />
          <div className={cx('picker', 'bottom-picker')} />
          <div className={cx('node-status')} />
        </div>
        <div className={cx('text-wrap')}>
          <span className={cx('text')}>{text}</span>
        </div>
      </div>
    );
  }
}

export default Node;
