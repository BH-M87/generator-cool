/* global _ */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Avatar as AvatarAntd } from 'antd';
import utils from 'common/utils';
import styles from './Avatar.scss';

const PREFIX = 'avatar';
const cx = utils.classnames(PREFIX, styles);

const sizeMapping = {
  large: 48,
  normal: 40,
  small: 32,
};

class Avatar extends Component {
  static propTypes = {
    url: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.oneOf(['large', 'normal', 'small']), PropTypes.number]),
    style: PropTypes.object,
    onClick: PropTypes.func,
  };
  static defaultProps = {
    size: 'large',
    onClick: () => {},
  };
  render = () => {
    const size = isNaN(this.props.size) ? sizeMapping[this.props.size] : this.props.size;
    return (
      <div className={cx('avatar')}>
        <AvatarAntd
          src={this.props.url}
          style={_.assign(
            {
              backgroundColor: this.props.url ? undefined : '#F0C425',
              lineHeight: `${size}px`,
              fontSize: size,
              width: size,
              height: size,
              borderRadius: size / 2,
            },
            this.props.style,
          )}
          onClick={this.props.onClick}
        >
          {this.props.url ? null : <i className={`BPO BPO-yonghu ${cx('icon')}`} />}
        </AvatarAntd>
      </div>
    );
  };
}

export default Avatar;
