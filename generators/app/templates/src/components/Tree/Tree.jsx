import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree as TreeAntd } from 'antd';
import { observable, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import utils from 'common/utils';
import styles from './Tree.less';

const PREFIX = 'tree';
const cx = utils.classnames(PREFIX, styles);
const { TreeNode } = TreeAntd;

const ICON_FONT = 'iconfont';

class TreeModel {
  @observable expandedKeys = [];

  @action
  onExpand = expandedKeys => {
    this.expandedKeys = expandedKeys;
  };
}

@observer
class Tree extends Component {
  static propTypes = {
    treeData: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      subTrees: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        iconClassName: PropTypes.string,
      })),
    })),
    selectedKeys: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.number),
    ]),
    isSearchFilter: PropTypes.bool,
    searchValue: PropTypes.string,
    onSelect: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    treeData: [
      {
        name: '服务',
        id: 'intelligence',
        subTrees: [
          {
            id: 'recommend',
            iconClassName: 'icon-shoucang',
            name: '推荐',
          },
          {
            id: 'favorite',
            iconClassName: 'icon-xihuan',
            name: '收藏',
          },
        ],
      },
    ],
    // onSelect: id => {
    //   // console.log(id);
    // },
    className: '',
    isSearchFilter: false,
  };

  constructor() {
    super();
    this.model = new TreeModel();
  }

  componentWillReceiveProps(nextProps) {
    const { searchValue, treeData } = nextProps;
    if (searchValue) {
      const expandedKeys = this.findTreeData(searchValue, treeData);
      if (Array.isArray(expandedKeys) && expandedKeys.length > 0) {
        this.model.expandedKeys = expandedKeys;
      }
    }
  }

  // getParentId = (id, treeData) => {
  //   let parentId;
  //   for (const node of treeData) {
  //     if (node.subTrees) {
  //       if (node.subTrees.some(item => item.id === id)) {
  //         parentId = node.id;
  //       } else if (this.getParentId(id, node.subTrees)) {
  //         parentId = this.getParentId(id, node.subTrees);
  //       }
  //     }
  //   }
  //   return parentId;
  // };

  findTreeData = (name, treeData) => {
    const resultArr = [];

    const findTreeDataRecursion = (findName, findTreeData) => {
      findTreeData.forEach(element => {
        if (element.name.indexOf(findName) > -1) {
          resultArr.push(`${element.id}`);
        }
        if (element.subTrees) {
          findTreeDataRecursion(findName, element.subTrees);
        }
      });
    };

    findTreeDataRecursion(name, treeData);

    return resultArr;
  };

  highlightSearchValue = (name, searchValue) => {
    if (!searchValue) {
      return <span>{name}</span>;
    }

    const index = name.indexOf(searchValue);
    const beforeStr = name.substr(0, index);
    const afterStr = name.substr(index + searchValue.length);
    return index > -1 ? (
      <span>
        {beforeStr}
        <span className={cx('highlight-search-value')}>{searchValue}</span>
        {afterStr}
      </span>
    ) : (
      <span>{name}</span>
    );
  };

  renderTreeNodes = data => {
    const { searchValue, isSearchFilter } = this.props;

    const returnData = [];
    for (const item of data) {
      const { name } = item;

      let title = this.highlightSearchValue(name, searchValue);
      if (item.iconClassName) {
        title = (
          <span>
            <i className={`${ICON_FONT} ${item.iconClassName}`} />
            {title}
          </span>
        );
      }
      if (item.subTrees) {
        const subTreeNodes = this.renderTreeNodes(item.subTrees);
        if (
          (isSearchFilter && subTreeNodes.length > 0) ||
          (!isSearchFilter || name.indexOf(searchValue) > -1)
        ) {
          // if on searchFilter mode, push the parent node when child nodes exist
          returnData.push(<TreeNode key={item.id} title={title}>
            {subTreeNodes}
          </TreeNode>);
        }
      } else if (!isSearchFilter || name.indexOf(searchValue) > -1) {
        // if on searchFilter mode, push the last child node only when the node is match the search value
        // otherwise, push the node anyway
        returnData.push(<TreeNode key={item.id} title={title} />);
      }
    }
    return returnData;
  };

  isParentTree = (id, treeData = []) => {
    for (const item of treeData) {
      if (item.id === Number(id)) {
        if (!item.subTrees || item.subTrees.length === 0) {
          return false;
        } else if (item.subTrees && item.subTrees.length > 0) {
          return true;
        }
      }
    }
  };

  selectedKeys = [];

  onSelect = (selectedKeys, event) => {
    let lSelectedKeys = selectedKeys;
    if (!event.selected) {
      lSelectedKeys = this.selectedKeys;
    } else {
      this.selectedKeys = selectedKeys;
    }

    if (this.isParentTree(lSelectedKeys[0], this.props.treeData)) {
      const expandedKeys = this.model.expandedKeys.concat(lSelectedKeys);
      const expandedKeySets = new Set(expandedKeys);
      this.model.expandedKeys = Array.from(expandedKeySets);
    }

    if (!event.selected) {
      return;
    }

    this.props.onSelect(lSelectedKeys, event);
  };

  render() {
    return (
      <TreeAntd
        autoExpandParent
        onSelect={this.onSelect}
        selectedKeys={this.props.selectedKeys}
        className={this.props.className}
        expandedKeys={toJS(this.model.expandedKeys)}
        onExpand={this.model.onExpand}
      >
        {this.renderTreeNodes(this.props.treeData)}
      </TreeAntd>
    );
  }
}

export default Tree;
