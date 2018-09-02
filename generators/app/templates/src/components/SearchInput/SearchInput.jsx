import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';
import utils from 'common/utils';
import styles from './SearchInput.less';

const PREFIX = 'search-input';
const cx = utils.classnames(PREFIX, styles);

class SearchInput extends Component {
  inputValue = null;

  render() {
    const attrObj = {};
    if (this.props.value !== undefined) {
      attrObj.value = this.props.value;
      this.inputValue = this.props.value;
    }
    const searchIcon = (
      <Icon
        className={cx('search-icon')}
        onClick={() => {
          this.props.onSearch(this.inputValue);
        }}
        type="search"
        key="searchIcon"
      />
    );
    return (
      <Input
        className={`${cx('search')} ${this.props.className}`}
        placeholder={this.props.placeholder}
        style={this.props.style}
        suffix={searchIcon}
        onPressEnter={this.props.onSearch}
        defaultValue={this.props.defaultValue}
        onChange={e => {
          const { value } = e.target;
          this.inputValue = value;
          if (this.props.onChange !== undefined) {
            this.props.onChange(value);
          }
        }}
        {...attrObj}
      />
    );
  }
}
SearchInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  /* eslint react/forbid-prop-types:0 */
  style: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  defaultValue: PropTypes.string,
};

SearchInput.defaultProps = {
  placeholder: '请输入要搜索的内容',
  className: '',
};

export default SearchInput;
