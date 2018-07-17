import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Menu, Input, Button } from 'antd';
import { NavLink, Link } from 'react-router-dom';
import { observable, computed, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import SearchInput from 'components/SearchInput';
import _ from 'lodash';
import utils from 'common/utils';
import styles from './SideMenu.scss';

const PREFIX = 'side-menu';
const cx = utils.classnames(PREFIX, styles);

const ICON_FONT = 'iconfont';
const { SubMenu } = Menu;

const SEPARATOR = '----';

class SideMenuModel {
  @observable collapsed = false;

  @action
  toggleCollapsed = () => {
    this.collapsed = !this.collapsed;
  };
}

@observer
class SideMenu extends Component {
  static propTypes = {
    theme: PropTypes.oneOf(['light', 'dark']),
    openKeys: PropTypes.arrayOf(PropTypes.string),
    sideMenuData: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      subMenus: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        iconClassName: PropTypes.string,
      })),
    })),
    highlightMenuId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    highlightMenuParentId: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    isIdUnionWithParentId: PropTypes.bool,
    isIdNumber: PropTypes.bool,
    onMenuClick: PropTypes.func,
    className: PropTypes.string,
    sideMenuSearchWord: PropTypes.string,
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    onContextMenu: PropTypes.func,
    editable: PropTypes.bool,
    inputValue: PropTypes.string,
    inputChange: PropTypes.func,
    okButtonVisible: PropTypes.bool,
    onOk: PropTypes.func,
    onItemClick: PropTypes.func,
    onOpenKeysChange: PropTypes.func,
    collapsedParentNameVisible: PropTypes.bool,
  };

  static defaultProps = {
    sideMenuData: [
      {
        name: '智能数据',
        id: 'intelligence',
        subMenus: [
          {
            id: 'intelligenceRecommend',
            iconClassName: 'icon-shoucang',
            name: '推荐',
          },
          {
            id: 'intelligenceFavorite',
            iconClassName: 'icon-xihuan',
            name: '收藏',
          },
          {
            id: 'intelligencePoliceType',
            iconClassName: 'icon-yujing',
            name: '警种',
          },
          {
            id: 'intelligenceType',
            iconClassName: 'icon-jihe',
            name: '类型',
          },
        ],
      },
      {
        name: '引擎服务',
        id: 'engine',
        subMenus: [
          {
            id: 'engineRecommendation',
            iconClassName: 'icon-shoucang',
            name: '推荐',
          },
          {
            id: 'engineCollection',
            iconClassName: 'icon-xihuan',
            name: '收藏',
          },
          {
            id: 'businessEngine',
            iconClassName: 'icon-yewu',
            name: '业务引擎',
          },
          {
            id: 'toolEngine',
            iconClassName: 'icon-shuju',
            name: '工具引擎',
          },
        ],
      },
      {
        name: '流程组件',
        id: 'process',
        subMenus: [
          {
            id: 'processScorecard',
            iconClassName: 'icon-yewu',
            name: '计分卡',
          },
          {
            id: 'processAndOrNot',
            iconClassName: 'icon-guanxitu',
            name: '与/或/非',
          },
          {
            id: 'processBranch',
            iconClassName: 'icon-chuizhijuzhong',
            name: '分支组件',
          },
        ],
      },
    ],
    onMenuClick: (id, parentId) => {},
    className: '',
    isIdUnionWithParentId: false,
    isIdNumber: false,
    theme: 'light',
    sideMenuSearchWord: null,
    collapsedParentNameVisible: true,
  };

  constructor() {
    super();
    this.model = new SideMenuModel();
  }

  onEventBind = (target, idValue, callback) => {
    const { isIdUnionWithParentId, isIdNumber } = this.props;
    const { classList } = target;
    if (classList.contains('ant-input') || classList.contains('ant-btn')) {
      return false;
    }
    let id = idValue;
    let idGroup = [];
    if (isIdUnionWithParentId) {
      idGroup = idValue.split(SEPARATOR);
      id = idGroup.pop();
    }
    if (isIdNumber) {
      id = Number(id);
    }
    if (callback) {
      callback(id, idGroup, idValue);
    }
  };

  processSideMenuData = data => {
    const processSideMenu = (sideMenuData = []) =>
      _.cloneDeep(sideMenuData).map(item => {
        const returnElement = item;
        const { id, subMenus } = item;
        if (Array.isArray(subMenus) && subMenus.length > 0) {
          returnElement.subMenus = subMenus.map(subMenu => {
            const returnSubMenu = subMenu;
            returnSubMenu.id = `${id}${SEPARATOR}${subMenu.id}`;
            return returnSubMenu;
          });
        }
        returnElement.id = `${returnElement.id}`;
        returnElement.subMenus = processSideMenu(returnElement.subMenus);
        return returnElement;
      });
    return processSideMenu(data);
  };

  dataIdToString = data => {
    const processSideMenu = (sideMenuData = []) =>
      _.cloneDeep(sideMenuData).map(item => {
        const returnElement = item;
        const { subMenus } = item;
        if (Array.isArray(subMenus) && subMenus.length > 0) {
          returnElement.subMenus = processSideMenu(subMenus);
        }
        returnElement.id = `${returnElement.id}`;
        return returnElement;
      });
    return processSideMenu(data);
  };

  renderMenuItems = data => {
    const returnData = [];
    const {
      onContextMenu,
      onItemClick,
      isIdUnionWithParentId,
      highlightMenuParentId,
      highlightMenuId,
      isIdNumber,
      inputValue,
      inputChange,
      okButtonVisible,
      onOk,
      editable,
      collapsedParentNameVisible,
      onOpenKeysChange,
    } = this.props;
    for (const item of data) {
      const itemAttrObj = {};
      const iconAttrObj = {};
      if (onContextMenu && !this.model.collapsed) {
        itemAttrObj.onContextMenu = e => {
          let { id } = item;
          let idGroup = [];
          if (isIdUnionWithParentId) {
            idGroup = id.split(SEPARATOR);
            id = idGroup.pop();
          }
          if (isIdNumber) {
            id = Number(id);
          }
          onContextMenu(e, id, idGroup);
        };
      }
      if (onItemClick) {
        itemAttrObj.onClick = e => {
          this.onEventBind(e.target, item.id, onItemClick);
        };
      }
      if (onOpenKeysChange && !this.model.collapsed) {
        iconAttrObj.onClick = e => {
          if (e && e.stopPropagation) {
            e.stopPropagation();
          } else {
            window.event.cancelBubble = true;
          }
          this.onEventBind(e.target, item.id, onOpenKeysChange);
        };
      }
      const editElement = (
        <div className={cx('edit-item')}>
          <Input
            size="small"
            value={inputValue}
            onChange={ev => {
              inputChange(ev.target.value);
            }}
            autoFocus
            onPressEnter={onOk}
          />
          {okButtonVisible ? (
            <Button size="small" type="primary" onClick={onOk}>
              确定
            </Button>
          ) : null}
        </div>
      );
      const selectedStatus =
        `${
          isIdUnionWithParentId
            ? `${highlightMenuParentId.join(SEPARATOR)}${
              highlightMenuParentId && highlightMenuParentId.length > 0 ? SEPARATOR : ''
            }`
            : ''
        }${highlightMenuId}` === `${item.id}`;
      if (Array.isArray(item.subMenus) && item.subMenus.length > 0) {
        const subMenuItems = this.renderMenuItems(item.subMenus);
        returnData.push(<SubMenu
          className={cx('sub-menu')}
          key={item.id}
          title={
              editable && (selectedStatus || item.id.indexOf('null') > -1) ? (
                editElement
              ) : (
                <div
                  className={cx('title', {
                    'icon-exist': item.iconClassName,
                    'title-selected': selectedStatus,
                  })}
                  {...itemAttrObj}
                >
                  {item.iconClassName ? (
                    <i
                      className={`${ICON_FONT} ${item.iconClassName || ''} ${cx('icons', {
                        'enlarget-icon': !collapsedParentNameVisible && this.model.collapsed,
                      })}`}
                      {...iconAttrObj}
                    />
                  ) : (
                    <div className={cx('arrow-wrap')} {...iconAttrObj}>
                      <i className={`${ICON_FONT} ant-menu-submenu-arrow`} />
                    </div>
                  )}
                  {!collapsedParentNameVisible &&
                  this.model.collapsed &&
                  item.id.indexOf(SEPARATOR) === -1
                    ? null
                    : item.name}
                  {item.sceneCount !== undefined ? `（${item.sceneCount}）` : null}
                </div>
              )
            }
        >
          {subMenuItems}
        </SubMenu>);
      } else {
        returnData.push(<Menu.Item key={item.id}>
          {editable && (selectedStatus || item.id.indexOf('null') > -1) ? (
              editElement
            ) : (
              <div className={cx('menu-item')} {...itemAttrObj}>
                {item.iconClassName ? (
                  <i
                    className={`${ICON_FONT} ${item.iconClassName || ''} ${cx('icons', {
                      'enlarget-icon': !collapsedParentNameVisible && this.model.collapsed,
                    })}`}
                  />
                ) : (
                  ''
                )}
                {!collapsedParentNameVisible &&
                this.model.collapsed &&
                item.id.indexOf(SEPARATOR) === -1
                  ? null
                  : item.name}
                {item.sceneCount !== undefined ? `（${item.sceneCount}）` : null}
              </div>
            )}
        </Menu.Item>);
      }
    }
    return returnData;
  };

  renderMenu = sideMenuData => {
    const {
      theme,
      isIdUnionWithParentId,
      highlightMenuParentId,
      highlightMenuId,
      openKeys,
      onMenuClick,
    } = this.props;
    const defaultOpenKeys = sideMenuData.map(element => element.id);
    const attrObj = {
      theme,
      defaultOpenKeys,
    };
    attrObj.selectedKeys = [
      `${
        isIdUnionWithParentId
          ? `${highlightMenuParentId.join(SEPARATOR)}${
            highlightMenuParentId && highlightMenuParentId.length > 0 ? SEPARATOR : ''
          }`
          : ''
      }${highlightMenuId}`,
    ];
    if (openKeys && !this.model.collapsed) {
      attrObj.openKeys = openKeys;
    }
    if (onMenuClick) {
      attrObj.onClick = e => {
        this.onEventBind(e.domEvent.target, e.key, onMenuClick);
      };
    }
    return (
      <Menu
        id={cx('menu-container')}
        defaultOpenKeys={defaultOpenKeys}
        mode="inline"
        inlineCollapsed={this.model.collapsed}
        {...attrObj}
      >
        {this.renderMenuItems(sideMenuData)}
      </Menu>
    );
  };

  render() {
    const {
      isIdUnionWithParentId,
      sideMenuData,
      isIdNumber,
      theme,
      className,
      onSearch,
      sideMenuSearchWord,
      onChange,
    } = this.props;

    let data =
      (isIdUnionWithParentId ? this.processSideMenuData(sideMenuData) : sideMenuData) || [];

    if (isIdNumber) {
      data = this.dataIdToString(sideMenuData);
    }

    return (
      <div
        id={cx('container')}
        className={`${cx('container', {
          'collapsed-container': this.model.collapsed,
          'dark-container': theme === 'dark',
        })} ${className}`}
      >
        <div role="button" className={cx('button-wrap')} onClick={this.model.toggleCollapsed}>
          <div
            role="button"
            className={cx('icon-retract', { 'icon-collapsed': this.model.collapsed })}
          >
            {this.model.collapsed ? (
              <i className={`${ICON_FONT} icon-dakai1`} />
            ) : (
              <i className={`${ICON_FONT} icon-shouqi1 side-menu-topi`} />
            )}
          </div>
        </div>
        {onSearch ? (
          <div className={cx('search-wrap')}>
            <SearchInput
              className={cx('search')}
              value={sideMenuSearchWord}
              onChange={onChange}
              onSearch={onSearch}
            />
          </div>
        ) : (
          ''
        )}

        {this.renderMenu(data)}
      </div>
    );
  }
}

export default SideMenu;
