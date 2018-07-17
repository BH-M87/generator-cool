import React, { Component } from 'react';
import PropTypes from 'common/PropTypes';
import { Slider as SliderAntd } from 'antd';
import utils from 'common/utils';
import styles from './Slider.scss';

const PREFIX = 'slider';
const cx = utils.classnames(PREFIX, styles);

class Slider extends Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    style: PropTypes.object,
  };

  static defaultProps = {
    min: 0.1,
    max: 2,
    step: 0.1,
    style: {},
  };

  render() {
    return (
      <div className={cx('container')} style={this.props.style}>
        <div
          role="button"
          className={`iconfont icon-fangda ${cx('icon')}`}
          onClick={() => {
            if (this.props.value < this.props.max) {
              const plusValue = this.props.value + this.props.step;
              const returnValue = plusValue > this.props.max ? this.props.max : plusValue;
              this.props.onChange(returnValue);
            }
          }}
        />
        <SliderAntd
          className={cx('slider')}
          vertical
          tipFormatter={null}
          value={this.props.value}
          onChange={this.props.onChange}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
        />
        <div
          role="button"
          className={`iconfont icon-suoxiao ${cx('icon')}`}
          onClick={() => {
            if (this.props.value > this.props.min) {
              const minusValue = this.props.value - this.props.step;
              const returnValue = minusValue < this.props.min ? this.props.min : minusValue;
              this.props.onChange(returnValue);
            }
          }}
        />
      </div>
    );
  }
}

export default Slider;
