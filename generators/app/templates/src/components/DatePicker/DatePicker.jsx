import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker as DatePickerAntd } from 'antd';
import { observable, computed, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import utils from 'common/utils';
import moment from 'moment';
import styles from './DatePicker.scss';

const PREFIX = 'date-picker';
const cx = utils.classnames(PREFIX, styles);

const { RangePicker } = DatePickerAntd;
const DATE_FORMATTER = 'YYYY/MM/DD';

class DateModel {
  @observable id = Math.random();
}

@observer
class DatePicker extends Component {
  static propTypes = {
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    onChange: PropTypes.func,
    onChangeString: PropTypes.func,
    open: PropTypes.bool,
    onOpenChange: PropTypes.func,
    defaultValue: PropTypes.arrayOf(PropTypes.object),
  };
  static defaultProps = {
    onChange: () => {},
    onChangeString: () => {},
  };

  constructor() {
    super();
    this.model = new DateModel();
  }
  render() {
    const attrObj = {};
    const {
      startDate,
      endDate,
      onChange,
      onChangeString,
      defaultValue,
      open,
      onOpenChange,
    } = this.props;

    if (startDate && endDate) {
      attrObj.value = [moment(startDate), moment(endDate)];
    } else if (startDate !== undefined && endDate !== undefined) {
      attrObj.value = [];
    }

    if (defaultValue) {
      attrObj.defaultValue = defaultValue;
    }
    if (open !== undefined) {
      attrObj.open = open;
    }
    if (onOpenChange !== undefined) {
      attrObj.onOpenChange = onOpenChange;
    }
    return (
      <div id={cx(`container${this.model.id}`)} className={cx('container')}>
        <RangePicker
          className={cx('range-picker')}
          format={DATE_FORMATTER}
          onChange={(momentValue, stringValue) => {
            onChange(momentValue, stringValue);
            onChangeString(stringValue[0], stringValue[1]);
          }}
          getCalendarContainer={() => document.getElementById(cx(`container${this.model.id}`))}
          {...attrObj}
        />
      </div>
    );
  }
}

export default DatePicker;
