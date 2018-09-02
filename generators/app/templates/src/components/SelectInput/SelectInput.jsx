import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable, computed, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Select, Input, DatePicker, Cascader } from 'antd';
import http from 'common/http';
import utils from 'common/utils';
import styles from './SelectInput.less';

const PREFIX = 'select-input';
const cx = utils.classnames(PREFIX, styles);
const { Option } = Select;
const { TextArea } = Input;

class SelectInputModel {}

@observer
class SelectInput extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    type: PropTypes.oneOf([
      'SINGLE_SELECT_BOX',
      'MULTI_SELECT_BOX',
      'INPUT_BOX',
      'INPUT_NUM_BOX',
      'TEXTAREA_BOX',
      'DATE_TIME_BOX',
      'DATE_BOX',
      'SINGLE_SELECT_SEARCH_BOX',
      'MULTI_SELECT_SEARCH_BOX',
      'CASCADER',
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.bool,
    ]),
    options: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
      children: PropTypes.array,
    })),
    /* eslint react/forbid-prop-types:0 */
    params: PropTypes.object,
    onChange: PropTypes.func,
    labelText: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    type: 'SINGLE_SELECT_BOX',
    options: [],
    labelText: '12345',
    onChange: value => {
      console.log(value);
    },
  };

  constructor() {
    super();
    this.model = new SelectInputModel();
  }

  componentWillMount() {
    this.id = Math.random();
  }

  renderOptions = options =>
    options.map(item => (
      <Option key={item.value} value={item.value}>
        {item.name}
      </Option>
    ));

  renderSelectInput = (type, value, onChange, options, customParams) => {
    const defaultParams = {
      size: 'small',
      value,
      placeholder: '请输入',
      onChange,
      disabled: this.props.disabled,
    };

    const params = Object.assign({}, defaultParams, customParams);

    switch (type) {
      case 'SINGLE_SELECT_BOX':
      case 'MULTI_SELECT_BOX':
      case 'SINGLE_SELECT_SEARCH_BOX':
      case 'MULTI_SELECT_SEARCH_BOX': {
        params.filterOption = (input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

        if (type === 'MULTI_SELECT_BOX') {
          params.mode = 'multiple';
        } else if (type === 'SINGLE_SELECT_SEARCH_BOX') {
          params.showSearch = true;
        } else if (type === 'MULTI_SELECT_SEARCH_BOX') {
          params.mode = 'tags';
        }
        return (
          <Select
            className={cx('select-input')}
            {...params}
            getPopupContainer={() => document.getElementById(cx(`container${this.id}`))}
          >
            {this.renderOptions(options)}
          </Select>
        );
      }
      case 'INPUT_BOX':
      case 'INPUT_NUM_BOX': {
        params.onChange = e => {
          onChange(e.target.value);
        };

        if (type === 'INPUT_NUM_BOX') {
          params.type = 'number';
        }

        return <Input className={cx('select-input')} {...params} />;
      }
      case 'TEXTAREA_BOX': {
        params.onChange = e => {
          onChange(e.target.value);
        };
        return <TextArea className={cx('select-input')} {...params} />;
      }

      case 'DATE_TIME_BOX':
      case 'DATE_BOX': {
        if (type === 'DATE_TIME_BOX') {
          params.showTime = true;
        }
        return (
          <DatePicker
            className={cx('select-input')}
            {...params}
            getCalendarContainer={() => document.getElementById(cx(`container${this.id}`))}
          />
        );
      }
      case 'CASCADER': {
        const refactor = optionsData => {
          return (optionsData || []).map(item => ({
            label: item.name,
            value: item.value,
            children: item.children ? refactor(item.children) : undefined,
          }));
        };
        return <Cascader className={cx('select-input')} options={refactor(options)} {...params} />;
      }
      default:
        return null;
    }
  };

  render() {
    const {
      type, value, options, onChange, labelText, className, params,
    } = this.props;

    return (
      <div className={`${cx('container')} ${className}`} id={cx(`container${this.id}`)}>
        <div className={cx('label')}>{labelText}</div>
        {this.renderSelectInput(type, value, onChange, options, params)}
      </div>
    );
  }
}

export default SelectInput;
