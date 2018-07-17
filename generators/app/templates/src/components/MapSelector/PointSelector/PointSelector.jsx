/* eslint jsx-a11y/label-has-for:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable, computed, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Input, Radio, Button } from 'antd';
import utils from 'common/utils';
import { ADMIN_AREA, CIRCLE_AREA, NONE_AREA, CIRCLE_INNER, CIRCLE_OUTER } from '../config';
import styles from './PointSelector.scss';

const PREFIX = 'point-selector';
const cx = utils.classnames(PREFIX, styles);

const RadioGroup = Radio.Group;

class PointSelectorModel {
  direction = CIRCLE_INNER;
}

@observer
class PointSelector extends Component {
  static propTypes = {
    type: PropTypes.oneOf([CIRCLE_AREA, ADMIN_AREA, NONE_AREA]),
    longitude: PropTypes.number,
    latitude: PropTypes.number,
    onSelect: PropTypes.func,
    close: PropTypes.func,
    adname: PropTypes.string,
    disabled: PropTypes.bool,
    displayRadiusValue: PropTypes.number,
    isDirectionShow: PropTypes.bool,
  };

  static defaultProps = {
    type: CIRCLE_AREA,
    onSelect: direction => {
      console.log(direction);
    },
    close: () => {},
    isDirectionShow: true,
  };

  constructor(props) {
    super(props);
    this.model = new PointSelectorModel();
  }

  render() {
    const titleMapping = {
      CIRCLE_AREA: '圈选区域',
      ADMIN_AREA: this.props.adname,
    };
    return (
      <div className={cx('container')}>
        <div className={cx('header')}>
          <div className={cx('header-text')}>{titleMapping[this.props.type]}</div>
          {/* <div className={cx('header-click')}>
            <i className="iconfont icon-guanbi" />
          </div> */}
        </div>
        <div className={cx('body')}>
          {this.props.type === CIRCLE_AREA ? (
            <div className={cx('lonlat')}>
              <div className={cx('label-wrap')}>
                <label htmlFor={cx('lonlat-input')} className={cx('label')}>
                  中心
                </label>
              </div>
              <Input
                id={cx('lonlat-input')}
                className={cx('lonlat-input')}
                defaultValue={`${this.props.longitude}, ${this.props.latitude}`}
                disabled
              />
            </div>
          ) : null}
          {this.props.type === CIRCLE_AREA ? (
            <div className={cx('radius')}>
              <div className={cx('label-wrap')}>
                <label htmlFor={cx('radius-input')} className={cx('label')}>
                  半径
                </label>
              </div>
              <Input
                id={cx('radius-input')}
                className={cx('radius-input')}
                defaultValue={this.props.displayRadiusValue}
                disabled={this.props.disabled}
                addonAfter="km"
              />
            </div>
          ) : null}
          {this.props.isDirectionShow ? (
            <div className={cx('direction')}>
              <div className={cx('label-wrap')}>
                <label htmlFor={cx('radius-input')} className={cx('label')}>
                  方向
                </label>
              </div>
              <RadioGroup
                defaultValue={CIRCLE_INNER}
                onChange={event => {
                  this.model.direction = event.target.value;
                }}
                disabled={this.props.disabled}
              >
                <Radio id={cx('enter')} value={CIRCLE_INNER}>
                  圈内
                </Radio>
                <Radio id={cx('leave')} value={CIRCLE_OUTER}>
                  圈外
                </Radio>
              </RadioGroup>
            </div>
          ) : null}
        </div>
        {this.props.disabled ? null : (
          <div className={cx('footer')}>
            <Button id={cx('cancel')} className={cx('cancel')} onClick={this.props.close}>
              取消圈选
            </Button>
            <Button
              type="primary"
              id={cx('submit')}
              className={cx('confirm')}
              onClick={() => {
                this.props.onSelect(this.model.direction);
              }}
            >
              完成圈选
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default PointSelector;
