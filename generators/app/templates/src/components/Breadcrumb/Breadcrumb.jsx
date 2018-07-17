/* eslint react/no-array-index-key:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Breadcrumb as BreadcrumbAntd } from 'antd';
import utils from 'common/utils';
import styles from './Breadcrumb.scss';

const PREFIX = 'bread-crumb';
const cx = utils.classnames(PREFIX, styles);

class Breadcrumb extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      href: PropTypes.string,
      routerPath: PropTypes.string,
    })),
    separator: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    className: PropTypes.string,
    itemClassName: PropTypes.string,
  };
  static defaultProps = {
    data: [
      {
        label: '名单列表',
        routerPath: '/resourceManage',
      },
      {
        label: '全省流动人口',
      },
    ],
    separator: '>',
  };

  renderItem = (item, index, data) => {
    if (!item.href && !item.routerPath) {
      return (
        <span
          className={`${cx('bread-crumb-item', {
            'bread-crumb-highlight-item': index === data.length - 1,
          })} ${this.props.itemClassName}`}
        >
          {item.label}
        </span>
      );
    } else if (item.routerPath) {
      return (
        <Link
          to={item.routerPath}
          className={`${cx('bread-crumb-item', {
            'bread-crumb-highlight-item': index === data.length - 1,
          })} ${this.props.itemClassName}`}
        >
          {item.label}
        </Link>
      );
    } else if (item.href) {
      return (
        <button
          href={item.href}
          className={`${cx('bread-crumb-item', {
            'bread-crumb-highlight-item': index === data.length - 1,
          })} ${this.props.itemClassName}`}
        >
          {item.label}
        </button>
      );
    }
    return '';
  };

  renderItems = () =>
    this.props.data.map((item, index, data) => (
      <BreadcrumbAntd.Item key={index}>{this.renderItem(item, index, data)}</BreadcrumbAntd.Item>
    ));

  render() {
    return (
      <BreadcrumbAntd
        separator={this.props.separator}
        className={`${cx('bread-crumb')} ${this.props.className}`}
      >
        {this.renderItems()}
      </BreadcrumbAntd>
    );
  }
}
export default Breadcrumb;
