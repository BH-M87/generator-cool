import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import styles from './QuickAction.less';

const PREFIX = 'quick-action';
const cx = utils.classnames(PREFIX, styles);

const CONTAINER_WIDTH = 240;
const CONTAINER_HEIGHT = 240;
const START_NODE_CODE = 'START_NODE';

class QuickAction extends Component {
  static propTypes = {
    dagId: PropTypes.string,
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    onDelete: PropTypes.func,
    onCancel: PropTypes.func,
    onResult: PropTypes.func,
  };

  static defaultProps = {};

  componentDidMount() {
    this.bindEvents();
  }

  componentWillUpdate(nextProps, nextState) {
    this.unBindEvents();
  }

  componentDidUpdate(prevProps, prevState) {
    this.bindEvents();
  }

  containerClickEvent = null;

  bindEvents = () => {
    if (document.getElementById(cx('container'))) {
      const { dagId, onDelete, onResult } = this.props;

      this.containerClickEvent = document
        .getElementById(cx('container'))
        .addEventListener('click', e => {
          if (e.target.classList.contains(cx('onResult'))) {
            onResult(dagId);
          } else if (e.target.classList.contains(cx('onDelete'))) {
            onDelete(dagId);
          }

          e.preventDefault();
          e.stopPropagation();
        });
    }
  };

  unBindEvents = () => {
    if (document.getElementById(cx('container')) && this.containerClickEvent) {
      document
        .getElementById(cx('container'))
        .removeEventListener('click', this.containerClickEvent);
      this.containerClickEvent = null;
    }
  };

  render() {
    const {
      dagId, position, onDelete, /* onCancel, */ onResult,
    } = this.props;

    // if no position , no show
    if (!position || !position.x || !position.y) {
      return null;
    }

    const { x, y } = position;
    const top = y - CONTAINER_HEIGHT / 2;
    const left = x - CONTAINER_WIDTH / 2;

    return (
      <div id={cx('container')} className={cx('container')} style={{ top, left }}>
        <div className={cx('circle')} />
        {dagId === START_NODE_CODE ? null : (
          <div
            role="button"
            className={cx('button', 'delete', 'onDelete')}
            onClick={() => {
              onDelete(dagId);
            }}
          >
            <div className={`iconfont icon-shanchu ${cx('onDelete')}`} />
            <div className={cx('onDelete', 'text')}>删除</div>
          </div>
        )}
        <div
          role="button"
          className={cx('button', 'result', 'onResult')}
          onClick={() => {
            onResult(dagId);
          }}
        >
          <div className={`iconfont icon-shujuji ${cx('onResult')}`} />
          <div className={cx('onResult', 'text')}>结果集</div>
        </div>
        {/* <div role="button" className={cx('button', 'cancel')} onClick={onCancel}>
          <i className="iconfont icon-guanbi" />
        </div> */}
      </div>
    );
  }
}

export default QuickAction;
