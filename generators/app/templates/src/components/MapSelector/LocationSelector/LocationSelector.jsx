import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import { Button, Cascader } from 'antd';
import utils from 'common/utils';
import territoryOptions from 'config/territoryOptions';
import { ADMIN_AREA, CIRCLE_AREA, NONE_AREA, BOTH_AREA } from '../config';
import styles from './LocationSelector.less';

const PREFIX = 'location-selector';
const cx = utils.classnames(PREFIX, styles);

class LocationSelector extends Component {
  static propTypes = {
    territory: PropTypes.arrayOf(PropTypes.string),
    onTerritoryChange: PropTypes.func,
    getTerritory: PropTypes.func,
    getPoint: PropTypes.func,
    cancelPoint: PropTypes.func,
    pointSelecting: PropTypes.bool,
    setPointSelecting: PropTypes.func,
    onReturn: PropTypes.func,
    type: PropTypes.oneOf([CIRCLE_AREA, ADMIN_AREA, BOTH_AREA, NONE_AREA]),
  };

  static defaultProps = {};

  onPointSelectClick = () => {
    if (this.props.pointSelecting) {
      this.props.setPointSelecting(false);
      this.props.cancelPoint();
      return;
    }
    this.props.getPoint();
    this.props.setPointSelecting(true);
  };

  render() {
    return (
      <div className={cx('container')}>
        {this.props.onReturn ? (
          <Button className={cx('return')} onClick={this.props.onReturn}>
            <i className="iconfont icon-fanhui" />
            &nbsp;&nbsp;返回
          </Button>
        ) : null}
        {this.props.type === NONE_AREA ? null : (
          <div className={cx('selector')}>
            {[ADMIN_AREA, BOTH_AREA].includes(this.props.type) ? (
              <div className={cx('selector-admin')}>
                <Cascader
                  options={territoryOptions}
                  onChange={value => {
                    this.props.onTerritoryChange(value);
                    this.props.getTerritory(value);
                  }}
                  placeholder="请选择行政区域"
                  changeOnSelect
                  expandTrigger="hover"
                  value={toJS(this.props.territory)}
                  getPopupContainer={() => document.getElementsByClassName(cx('selector-admin'))[0]}
                />
              </div>
            ) : null}
            {this.props.type === BOTH_AREA ? (
              <div className={cx('selector-text')}>或者点击</div>
            ) : null}
            {[CIRCLE_AREA, BOTH_AREA].includes(this.props.type) ? (
              <Button
                type={this.props.pointSelecting ? 'dashed' : 'primary'}
                className={cx('selector-point')}
                onClick={this.onPointSelectClick}
              >
                {this.props.pointSelecting ? '取消圈选' : '圈选区域'}
              </Button>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

export default LocationSelector;
