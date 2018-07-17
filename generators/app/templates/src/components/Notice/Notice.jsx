import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable, computed, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Popconfirm, message } from 'antd';
import http from 'common/http';
import utils from 'common/utils';
import styles from './Notice.scss';

const PREFIX = 'notice';
const cx = utils.classnames(PREFIX, styles);

class NoticeModel {}

@observer
class Notice extends Component {
  static propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    placement: PropTypes.string,
    content: PropTypes.element,
    onConfirm: PropTypes.func,
  };

  static defaultProps = {
    title: '确定删除？',
    okText: '确定',
    cancelText: '取消',
    placement: 'top',
  };

  constructor() {
    super();
    this.model = new NoticeModel();
  }

  render() {
    const {
      id, title, okText, cancelText, placement, content, onConfirm,
    } = this.props;
    return (
      <div id={cx(`card${id}`)} className={cx('card')}>
        <Popconfirm
          title={title}
          okText={okText}
          cancelText={cancelText}
          placement={placement}
          onConfirm={onConfirm}
          getPopupContainer={() => document.getElementById(cx(`card${id}`))}
        >
          {content}
        </Popconfirm>
      </div>
    );
  }
}

export default Notice;
