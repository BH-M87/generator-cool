/** global _ */
/* eslint no-restricted-globals:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import { NavLink, Link } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'antd';
import { observable, action } from 'mobx';
import history from 'common/history';
import { observer } from 'mobx-react';
import http from 'common/http';
import routeConfig from 'config/routeConfig';
import styles from './TopBar.less';

const PREFIX = 'top-bar';
const cx = utils.classnames(PREFIX, styles);

const { navTo } = utils;
// const urlParse = utils.url.parse;

class Model {
  @observable logoutVisible = false;
  @observable isVisibleMenu = false;

  @action
  setLogoutVisible = flag => {
    this.logoutVisible = flag;
  };

  logout = async () => {
    await http.post('/auth/logout');
    navTo(`/login?recirectUrl=${location.href}`);
  };

  @action
  onVisibleChange = visible => {
    this.isVisibleMenu = visible;
  };
}

@observer
class TopBar extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.model = new Model();
  }

  renderNav() {
    return (
      <div className={cx('model')}>
        <Link to={routeConfig.home.path}>
          <div className={cx('logo')}>
            <img src={''} alt="" />
            <span className={cx('logo-text')}>&nbsp;&nbsp;名称</span>
          </div>
        </Link>
        <div className={cx('selectd')}>
          <Dropdown overlay={<div />}>
            <a className="ant-dropdown-link" href="#">
              <span>下拉框</span> <Icon type="down" />
            </a>
          </Dropdown>
        </div>
        <div className={cx('main-button')}>
          <NavLink
            to={routeConfig.home.path}
            activeClassName={cx('selected')}
          >
            <div className={cx('nav-item')}>目录1</div>
          </NavLink>
          <NavLink
            to={routeConfig.home.path}
            activeClassName={cx('selected')}
          >
            <div className={cx('nav-item')}>目录2</div>
          </NavLink>
          <NavLink to={routeConfig.home.path} activeClassName={cx('selected')}>
            <div className={cx('nav-item')}>目录3</div>
          </NavLink>
          <NavLink
            to={routeConfig.home.path}
            activeClassName={cx('selected')}
          >
            <div className={cx('nav-item')}>目录4</div>
          </NavLink>
          <Link
            to={routeConfig.home.path}
            className={cx({
              selected: history.location.pathname.startsWith(routeConfig.home.path),
            })}
          >
            <div className={cx('nav-item')}>目录5</div>
          </Link>
          <NavLink
            to={routeConfig.home.path}
            activeClassName={cx('selected')}
          >
            <div className={cx('nav-item')}>目录6</div>
          </NavLink>
        </div>
      </div>
    );
  }

  renderUserInfo() {
    const menu = (
      <Menu className={cx('menu')}>
        {/* <Menu.Item className={cx('menu-item')}>
          <i className="iconfont icon-xinyonghu" />
          <span>1st menu item</span>
        </Menu.Item> */}
        <Menu.Item className={cx('menu-item')}>
          <i className="iconfont icon-shezhi" />
          <span>设置</span>
        </Menu.Item>
        <Menu.Item className={cx('menu-item')} onClick={this.model.logout}>
          <i className="iconfont icon-dianyuan" />
          <span role="button">退出</span>
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={cx('right-part', 'userDropdown')}>
        <Dropdown overlay={menu} onVisibleChange={this.model.onVisibleChange}>
          <a className="ant-dropdown-link" href="#">
            <i className={`iconfont icon-yonghu ${cx('user')}`} />{' '}
            <Icon
              type="down"
              className={cx(this.model.isVisibleMenu ? 'down' : 'reverse')}
            />
          </a>
        </Dropdown>
      </div>
    );
  }

  renderTopBar = () => (
    <div id={cx('top-bar')} className={cx('top-bar')}>
      <div className={cx('left-part')}>{this.renderNav()}</div>
      {this.renderUserInfo()}
    </div>
  );

  render() {
    return (
      <div className={cx('container')}>
        {this.renderTopBar()}
        <div className={cx('children')}>
          <div className={cx('background')}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default TopBar;
