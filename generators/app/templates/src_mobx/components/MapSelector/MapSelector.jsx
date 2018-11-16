/* eslint no-underscore-dangle:0, prefer-arrow-callback:0, func-names:0 */
/* global IMAP */
import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import PropTypes from 'prop-types';
import { observable, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Modal } from 'antd';
import _ from 'lodash';
import utils from 'common/utils';
import calculateLonLatInSameLongitude from 'common/calculateLonLatInSameLongitude';
import Map from 'components/Map';
import {
  ADMIN_AREA,
  CIRCLE_AREA,
  BOTH_AREA,
  NONE_AREA,
  CIRCLE_INNER,
  CIRCLE_OUTER,
} from './config';
import LocationSelector from './LocationSelector';
import PointSelector from './PointSelector';
import styles from './MapSelector.less';

const PREFIX = 'map-selector';
const cx = utils.classnames(PREFIX, styles);
const { numberFormatter } = utils.number;

const DEFAULT_CIRCLE_RADIUS = 5000; // m
const DEFAULT_DIRECTION = CIRCLE_INNER;
const CIRCLE_INFO_WINDOW_SIZE = [360, 230];
const ADMIN_AREA_INFO_WINDOW_SIZE = [360, 130];
const ANTD_RADIO_CHECKED_CLASSNAME = 'ant-radio ant-radio-checked';
const ANTD_RADIO_DISABLED_CLASSNAME = 'ant-radio-disabled';

class MapSelectorModel {
  type = '';

  @observable territory = [];

  @action
  onTerritoryChange = value => {
    this.territory = value;
  };

  adcode = null;

  adname = null;

  map = null;

  circle = {};

  circleInfoWindow = {};

  circleOverlays = [];

  eventListener = null;

  longitude = null;

  latitude = null;

  radius = DEFAULT_CIRCLE_RADIUS;

  displayRadiusValue = null;

  @observable pointSelecting = false;

  setPointSelecting = value => {
    this.pointSelecting = value;
  };

  direction = DEFAULT_DIRECTION;

  @action
  setDirection = direction => {
    this.direction = direction;
  };

  @action
  clearTerritoryData = () => {
    this.territory = [];
    this.adcode = null;
    this.adname = null;
  };

  @action
  clearCircleData = () => {
    this.latitude = null;
    this.longitude = null;
    this.radius = null;
  };

  @action
  clearAllData = () => {
    this.clearCircleData();
    this.clearTerritoryData();
    this.territory = [];
    this.pointSelecting = false;
  };
}

@observer
class MapSelector extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    className: PropTypes.string,
    isEmbed: PropTypes.bool,
    isInfoWindowHide: PropTypes.bool,
    onSelect: PropTypes.func,
    close: PropTypes.func,
    type: PropTypes.oneOf([CIRCLE_AREA, ADMIN_AREA, BOTH_AREA, NONE_AREA]),
    /* eslint react/no-unused-prop-types:0 */
    isDirectionShow: PropTypes.bool,
    direction: PropTypes.oneOf([CIRCLE_INNER, CIRCLE_OUTER]),
    adcode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    longitude: PropTypes.number,
    latitude: PropTypes.number,
    radius: PropTypes.number,
  };

  static defaultProps = {
    visible: false,
    isEmbed: false,
    isInfoWindowHide: false,
    className: '',
    onSelect: (type, territory, adcode, longitude, latitude, radius, direction) => {
      console.log(type, territory, adcode, longitude, latitude, radius, direction);
    },
    type: BOTH_AREA,
    // longitude: 120.153576,
    // latitude: 30.287459,
    // radius: 5000,
    // adcode: 420100,
    isDirectionShow: true,
  };

  constructor() {
    super();
    this.model = new MapSelectorModel();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.model.map && !_.isEqual(this.props, prevProps) && this.props.visible) {
      this.model.clearAllData();
      this.removeOverlays(this.model.map);
      this.showInitMapData(this.props);
    }
  }

  getTerritory = value => {
    this.model.clearCircleData();

    this.model.type = ADMIN_AREA;
    this.removerClickListener();
    this.model.territory = value;
    this.boundary(this.model.map, value[value.length - 1]);
    this.model.pointSelecting = false;
  };

  getPoint = () => {
    this.model.clearTerritoryData();

    this.model.type = CIRCLE_AREA;
    this.model.pointSelecting = true;
    this.removeOverlays(this.model.map);
    this.model.eventListener = this.model.map.addEventListener(
      IMAP.Constants.CLICK,
      this.clickEvent,
      this.model.map,
    );
    this.model.pointSelecting = true;
  };

  cancelPoint = () => {
    this.removeOverlays(this.model.map);
    this.removerClickListener();
    this.model.pointSelecting = false;
  };

  clickEvent = event => {
    const { lnglat } = event;
    const longitude = lnglat.lng;
    const latitude = lnglat.lat;
    this.circle(this.model.map, longitude, latitude, DEFAULT_CIRCLE_RADIUS);
  };

  circleEditedEvent = () => {
    const lngLat = this.model.circle.getCenter();
    this.model.longitude = lngLat.lng;
    this.model.latitude = lngLat.lat;
    this.model.radius = this.model.circle.d._mRadius;

    const lnglat = new IMAP.LngLat(this.model.longitude, this.model.latitude);

    this.model.circleInfoWindow = this.createInfoWindow(
      CIRCLE_AREA,
      lnglat,
      CIRCLE_INFO_WINDOW_SIZE,
      this.model.longitude,
      this.model.latitude,
      this.model.radius,
    );

    this.model.map.getOverlayLayer().addOverlay(this.model.circleInfoWindow, false);

    this.addOverlayEvents();
  };

  allMouseUpEvent = event => {
    // target className:
    // 'imap-marker-icon imap-div-icon imap-editing-icon imap-edit-resize imap-interactive imap-marker-draggable imap-drag-target'
    const { classList } = event.target;

    // doing this because drag the marker won't raise any event in original IMAP API
    if (
      classList.contains('imap-marker-draggable') &&
      classList.contains('imap-editing-icon') &&
      classList.contains('imap-marker-icon')
    ) {
      this.circleEditedEvent();
    }
  };

  allMouseDownEvent = event => {
    // target className:
    // 'imap-marker-icon imap-div-icon imap-editing-icon imap-edit-resize imap-interactive imap-marker-draggable imap-drag-target'
    const { classList } = event.target;

    // doing this because drag the marker won't raise any event in original IMAP API
    if (
      classList.contains('imap-marker-draggable') &&
      classList.contains('imap-editing-icon') &&
      classList.contains('imap-marker-icon') &&
      this.model.circleInfoWindow
    ) {
      this.removeCircleInfoWindow();
    }
  };

  circle = (map, longitude, latitude, radius) => {
    this.removeOverlays(map);
    this.removerClickListener();

    // the unit of radius is meter
    const centerlnglat = new IMAP.LngLat(longitude, latitude);

    this.model.circle = new IMAP.Circle(centerlnglat, radius, {
      strokeOpacity: 1,
      editabled: this.props.type !== NONE_AREA,
    });

    this.model.circleOverlays = [this.model.circle];

    this.model.longitude = longitude;
    this.model.latitude = latitude;
    this.model.radius = radius;
    if (!this.props.isInfoWindowHide) {
      this.model.circleInfoWindow = this.createInfoWindow(
        CIRCLE_AREA,
        centerlnglat,
        CIRCLE_INFO_WINDOW_SIZE,
        longitude,
        latitude,
        radius,
      );

      this.model.circleOverlays.push(this.model.circleInfoWindow);
    }

    map.getOverlayLayer().addOverlays(this.model.circleOverlays, false);

    this.addCircleEvents();

    setTimeout(() => {
      this.addOverlayEvents();
    }, 500);
  };

  addCircleEvents = () => {
    if (this.props.type === NONE_AREA) {
      return;
    }

    // circle.addEventListener(IMAP.Constants.MOUSE_UP, this.circleEditedEvent, circle);
    this.model.circle.addEventListener(
      IMAP.Constants.DRAG_END,
      this.circleEditedEvent,
      this.model.circle,
    );

    this.model.circle.addEventListener(
      IMAP.Constants.DRAG_START,
      this.removeCircleInfoWindow,
      this.model.circle,
    );

    // add event listener to the draggable marker on IMAP when drag the circle radius size
    document.getElementById(cx('container')).onmouseup = this.allMouseUpEvent;
    document.getElementById(cx('container')).onmousedown = this.allMouseDownEvent;
  };

  removeCircleInfoWindow = () => {
    this.removeOverlays(this.model.map, this.model.circleInfoWindow);
    this.circleInfoWindow = null;
  };

  // remove all existed overlays or single overlay
  removeOverlays = (map, overlay) => {
    if (Object.getOwnPropertyNames(map.getOverlayLayer().getOverlays()).length > 0) {
      if (overlay) {
        map.getOverlayLayer().removeOverlay(overlay);
      } else {
        map.getOverlayLayer().clear();
      }
    }
  };

  // remove circle click listener
  removerClickListener = () => {
    if (this.model.eventListener) {
      this.model.map.removeEventListener(this.model.eventListener);
      this.model.eventListener = null;
    }
  };

  calculateInfoWindowPosition = (longitude, latitude, radius) => {
    const position = calculateLonLatInSameLongitude(longitude, latitude, radius);
    return new IMAP.LngLat(position.longitude, position.latitude);
  };

  createInfoWindow = (type, position, size, longitude, latitude, radius, autoPan = true) => {
    // position: {lng: "120.153575", lat: "30.287458"}

    const windowPosition =
      type === CIRCLE_AREA
        ? radius && this.calculateInfoWindowPosition(position.lng, position.lat, radius)
        : position;

    // renderToString can not pass event listner
    const content = renderToString(<PointSelector
      type={type}
      longitude={longitude}
      latitude={latitude}
      displayRadiusValue={this.model.displayRadiusValue || radius / 1000}
      adname={this.model.adname}
      disabled={this.props.type === NONE_AREA}
      isDirectionShow={this.props.isDirectionShow}
    />);

    const infoWindow = new IMAP.InfoWindow(content, {
      size: new IMAP.Size(size[0], size[1]),
      position: windowPosition,
      autoPan,
      type: IMAP.Constants.OVERLAY_INFOWINDOW_DEFAULT,
    });

    // reset this.model.displayRadiusValue
    this.model.displayRadiusValue = null;

    return infoWindow;
  };

  boundary = (map, keyword, callback) => {
    this.removeOverlays(map);

    if (map) {
      const overlays = [];
      map.plugin(['IMAP.DistrictSearch'], () => {
        const boundarySearch = new IMAP.DistrictSearch();

        boundarySearch.search(keyword, (status, result) => {
          // return status is string 0, WTF!!!!!!
          if (status === '0') {
            const paths = result.results;

            const resultPath = paths[0];

            // let pathArray;
            // for (let i = 0, l = paths.length; i < l; ++i) {
            //   if (paths[i]) {
            const pathArray = resultPath.polyline.split('|');
            let path;
            for (let j = 0, jl = pathArray.length; j < jl; ++j) {
              const lnglats = [];
              path = pathArray[j].split(';');
              for (let n = 0, nl = path.length; n < nl; ++n) {
                let lnglat = path[n].split(',');
                lnglat = new IMAP.LngLat(lnglat[0], lnglat[1]);
                lnglats.push(lnglat);
              }
              const polygon = new IMAP.Polygon(lnglats, {
                fillOpacity: 0.5,
                strokeStyle: IMAP.Constants.OVERLAY_LINE_DASHED,
                strokeWeight: 2,
              });
              overlays.push(polygon);
            }
            //   }
            // }

            this.model.adcode = resultPath.adcode;
            this.model.adname = resultPath.name;

            if (!this.props.isInfoWindowHide) {
              const infoWindow = this.createInfoWindow(
                ADMIN_AREA,
                resultPath.center,
                ADMIN_AREA_INFO_WINDOW_SIZE,
              );

              overlays.push(infoWindow);
            }

            map.getOverlayLayer().addOverlays(overlays, true);

            // when user select the area twice without remove overlay, addOverlayEvents after 500ms to wait the browser change dom tree
            setTimeout(() => {
              this.addOverlayEvents();
              if (callback) {
                callback();
              }
            }, 500);
          }
        });
      });
    }
  };

  showDirection = direction => {
    if (direction === CIRCLE_INNER) {
      this.enter();
    } else if (direction === CIRCLE_OUTER) {
      this.leave();
    }
  };

  showInitMapData = props => {
    const { direction, adcode, longitude, latitude, radius } = props;

    if (longitude && latitude && radius) {
      this.circle(this.model.map, longitude, latitude, radius);
      if (this.props.isDirectionShow) {
        this.showDirection(direction);
      }
    } else if (adcode) {
      this.model.adcode = null;
      this.boundary(this.model.map, adcode, () => {
        if (this.model.adcode) {
          if (this.props.isDirectionShow) {
            this.showDirection(direction);
          }
        }
      });
    }
  };

  processMap = map => {
    this.model.map = map;
    this.showInitMapData(this.props);
  };

  clearRadioSelection = () => {
    document.getElementsByClassName('ant-radio-checked')[0].className = `ant-radio ${
      this.props.type === NONE_AREA ? ANTD_RADIO_DISABLED_CLASSNAME : ''
    }`;
  };

  enter = () => {
    this.model.setDirection(CIRCLE_INNER);
    this.clearRadioSelection();
    document.getElementsByClassName('ant-radio')[0].className = `${ANTD_RADIO_CHECKED_CLASSNAME} ${
      this.props.type === NONE_AREA ? ANTD_RADIO_DISABLED_CLASSNAME : ''
    }`;
  };

  leave = () => {
    this.model.setDirection(CIRCLE_OUTER);
    this.clearRadioSelection();

    document.getElementsByClassName('ant-radio')[1].className = `${ANTD_RADIO_CHECKED_CLASSNAME} ${
      this.props.type === NONE_AREA ? ANTD_RADIO_DISABLED_CLASSNAME : ''
    }`;
  };

  onRadiusInputChange = e => {
    const {
      target: { value },
    } = e;

    let formatedValue = numberFormatter(value);

    this.model.displayRadiusValue = formatedValue;

    if (Number(formatedValue) <= 0) {
      formatedValue = '1';
      this.model.displayRadiusValue = '';
    }

    document.getElementById('point-selector-radius-input').value = this.model.displayRadiusValue;

    if (this.model.radius === Number(formatedValue) * 1000) {
      return;
    }

    this.model.radius = Number(formatedValue) * 1000;
    this.circle(this.model.map, this.model.longitude, this.model.latitude, this.model.radius);
    if (this.props.isDirectionShow) {
      this.showDirection(this.model.direction);
    }
  }; /*eslint react/sort-comp:0 */

  addOverlayEvents = () => {
    if (this.props.type === NONE_AREA) {
      return;
    }

    // move cursor to last letter
    if (document.getElementById('point-selector-radius-input')) {
      const radiusValue = document.getElementById('point-selector-radius-input').value;
      document.getElementById('point-selector-radius-input').value = '';
      document.getElementById('point-selector-radius-input').focus();
      document.getElementById('point-selector-radius-input').value = radiusValue;
      document.getElementById('point-selector-radius-input').oninput = this.onRadiusInputChange;
    }

    if (this.props.isDirectionShow) {
      document.getElementsByClassName('ant-radio')[0].addEventListener('click', this.enter);
      document.getElementsByClassName('ant-radio')[1].addEventListener('click', this.leave);
    }

    if (document.getElementById('point-selector-cancel')) {
      document.getElementById('point-selector-cancel').addEventListener(
        'click',
        // Arrow function can not work here
        function cancel() {
          this.model.setDirection(DEFAULT_DIRECTION); //Set to default direction value
          this.removeOverlays(this.model.map);
          if (this.model.type === CIRCLE_AREA) {
            this.model.pointSelecting = false;
          }
        }.bind(this),
      );
    }

    if (document.getElementById('point-selector-submit')) {
      document.getElementById('point-selector-submit').addEventListener(
        'click',
        function submit() {
          this.removeOverlays(this.model.map);
          this.props.onSelect(
            this.model.type,
            this.model.adname,
            this.model.adcode,
            this.model.longitude,
            this.model.latitude,
            this.model.radius,
            this.model.direction,
          );
          this.model.pointSelecting = false;
        }.bind(this),
      );
    }
  };

  renderContent() {
    return (
      <div id={cx('container')} className={`${cx('container')} ${this.props.className}`}>
        <div className={cx('map-selector')}>
          <LocationSelector
            territory={toJS(this.model.territory)}
            onTerritoryChange={this.model.onTerritoryChange}
            pointSelecting={this.model.pointSelecting}
            setPointSelecting={this.model.setPointSelecting}
            getTerritory={this.getTerritory}
            getPoint={this.getPoint}
            cancelPoint={this.cancelPoint}
            onReturn={this.props.close}
            type={this.props.type}
          />
        </div>
        <Map
          cursorType={this.model.pointSelecting ? 'crosshair' : 'grab'}
          processMap={this.processMap}
        />
      </div>
    );
  }

  render() {
    if (this.props.isEmbed) {
      return this.renderContent();
    }

    return (
      <Modal
        visible={this.props.visible}
        wrapClassName={cx('modal-wrap')}
        maskStyle={{
          backgroundColor: 'rgba(55, 55, 55, 0.9)',
        }}
        className={cx('modal')}
        footer={null}
        width="100%"
        closable={false}
        maskClosable={false}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}

export default MapSelector;
