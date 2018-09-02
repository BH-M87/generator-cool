import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';

import utils from 'common/utils';
import DatePicker from 'components/DatePicker';
import styles from './OpenMonitor.less';

const PREFIX = 'open-monitor';
const cx = utils.classnames(PREFIX, styles);

class OpenMonitorModel {
  @observable startDate = moment().format('YYYY-MM-DD');
  @observable endDate = moment().format('YYYY-MM-DD');

  @action
  onChange = (momentValue, stringValue) => {
    [this.startDate, this.endDate] = stringValue;
  };
}

@observer
class OpenMonitor extends Component {
  constructor() {
    super();
    this.model = new OpenMonitorModel();
  }

  render() {
    return (
      <Modal
        title="开启布控"
        maskClosable={false}
        visible={this.props.visible}
        onOk={() => {
          this.props.onOk(this.model.startDate, this.model.endDate);
        }}
        onCancel={this.props.close}
        className={cx('open-monitor')}
      >
        <span>有效时间</span>
        <DatePicker
          startDate={this.model.startDate}
          endDate={this.model.endDate}
          className={cx('datepicker')}
          onChange={this.model.onChange}
        />
      </Modal>
    );
  }
}

OpenMonitor.propTypes = {
  visible: PropTypes.bool,
  close: PropTypes.func,
  onOk: PropTypes.func,
};

OpenMonitor.defaultProps = {
  visible: true,
  onOk: (startDate, endDate) => {
    console.log(startDate, endDate);
  },
};

export default OpenMonitor;
