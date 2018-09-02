import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Carousel as CarouselAntd } from 'antd';
import utils from 'common/utils';
import styles from './Carousel.less';

const PREFIX = 'carousel';
const cx = utils.classnames(PREFIX, styles);

class Carousel extends Component {
  static propTypes = {
    autoplay: PropTypes.bool,
    autoplaySpeed: PropTypes.number,
    dots: PropTypes.bool,
    dotsClass: PropTypes.string,
    imgClass: PropTypes.string,
    onClick: PropTypes.func,
    content: PropTypes.arrayOf(PropTypes.shape({
      picUrl: PropTypes.string,
      title: PropTypes.string,
      riskDegree: PropTypes.number,
      riskType: PropTypes.string,
      emotionDegree: PropTypes.number,
      emotionType: PropTypes.string,
      volume: PropTypes.number,
    })),
  };

  static defaultProps = {
    autoplay: true,
    autoplaySpeed: 2000, // ms
    dots: true,
    dotsClass: 'slick-dots',
    imgClass: '',
  };

  renderSliders = () => {
    const sliders = [];
    this.props.content.forEach(item => {
      const text = (
        <div className={cx('text')}>
          <div className={cx('text-title')}>{item.title}</div>
          <div className={cx('text-detail')}>
            <div>
              <span>危险指数：</span>
              <span
                className={cx({
                  'high-risk': item.riskType === 'HIGH_RISK',
                  risk: item.riskType === 'RISK',
                  normal: item.riskType === 'NORMAL',
                })}
              >
                {item.riskDegree}
              </span>
            </div>
            <div>
              <span>情感指数：</span>
              <span
                className={cx({
                  positive: item.emotionType === 'POSITIVE',
                  neutral: item.emotionType === 'NEUTRAL',
                  negative: item.emotionType === 'NEGATIVE',
                })}
              >
                {item.emotionDegree}
              </span>
            </div>
            <div>声量：{utils.number.localize(item.volume)}</div>
          </div>
        </div>
      );
      sliders.push(<div key={item.id} role="button" className={cx('slider')}>
        <img
          alt="picture"
          role="presentation"
          src={item.picUrl}
          className={this.props.imgClass}
          onClick={() => {
              this.props.onClick(item.id, item.publicopinionType, item.sourceMediaUrl);
            }}
        />
        {text}
      </div>);
    });
    return sliders;
  };

  render() {
    return (
      <CarouselAntd
        autoplay={this.props.autoplay}
        autoplaySpeed={this.props.autoplaySpeed}
        dots={this.props.dots}
        dotsClass={`${this.props.dotsClass} ${cx('dots')}`}
      >
        {this.renderSliders()}
      </CarouselAntd>
    );
  }
}

export default Carousel;
