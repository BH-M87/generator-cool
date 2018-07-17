/* global IMAP */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import styles from './Map.scss';

const PREFIX = 'map';
const cx = utils.classnames(PREFIX, styles);

class Map extends Component {
  static propTypes = {
    minZoom: PropTypes.number,
    maxZoom: PropTypes.number,
    zoom: PropTypes.number,
    center: PropTypes.arrayOf(PropTypes.number),
    animation: PropTypes.bool,
    processMap: PropTypes.func,
    cursorType: PropTypes.oneOf(['crosshair', 'grab', '']),
  };

  static defaultProps = {
    minZoom: 3,
    maxZoom: 23,
    zoom: 12,
    center: [120.153576, 30.287459], // Hangzhou
    animation: true,
    processMap: map => {
      console.log(map);
    },
    cursorType: '',
  };

  componentDidMount() {
    this.initMap();
  }

  initMap = () => {
    const {
      minZoom, maxZoom, zoom, center, animation,
    } = this.props;
    const map = new IMAP.Map(cx('map'), {
      minZoom,
      maxZoom,
      zoom, //设置地图初始化级别
      center: new IMAP.LngLat(center[0], center[1]), //设置地图中心点坐标
      animation, //设置地图缩放动画效果
    });
    this.props.processMap(map);
  };

  render() {
    return (
      <div id={cx('map')} className={cx('container', `cursor-${this.props.cursorType}`)}>
        Map
      </div>
    );
  }
}

export default Map;
