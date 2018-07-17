import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Popover } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import utils from 'common/utils';
import styles from './Tips.scss';

const PREFIX = 'tips';
const cx = utils.classnames(PREFIX, styles);

class TipsModel {
  @observable id = null;
  @observable isPopover = false;
}

@observer
class Tips extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['single', 'multiple']),
    className: PropTypes.string,
    textClassName: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.number,
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.object),
    ]),
  };

  static defaultProps = {
    className: '',
    textClassName: '',
    type: 'single',
  };

  constructor() {
    super();
    this.model = new TipsModel();
    this.model.id = Math.random().toString();
  }

  componentDidMount() {
    this.handleJudge();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevProps.children, this.props.children)) {
      this.handleJudge();
    }
  }

  handleJudge() {
    const {
      clientWidth, scrollWidth, clientHeight, scrollHeight,
    } = document.getElementById(cx(this.model.id));

    if (clientWidth < scrollWidth || clientHeight < scrollHeight) {
      this.model.isPopover = true;
    } else {
      this.model.isPopover = false;
    }
  }

  render() {
    return (
      <div
        id={cx(`container-wrap-${this.model.id}`)}
        className={`${cx('container-wrap')} ${this.props.className}`}
      >
        <div
          id={cx(this.model.id)}
          className={`${cx('container', { multiple: this.props.type === 'multiple' })} ${
            this.props.className
          }`}
        >
          {this.model.isPopover ? (
            <Popover
              content={this.props.children}
              overlayClassName={cx('popover')}
              className={cx('tips')}
              getPopupContainer={() =>
                document.getElementById(cx(`container-wrap-${this.model.id}`))
              }
              placement="topLeft"
            >
              <span className={`${cx('text')} ${this.props.textClassName}`}>
                {this.props.children}
              </span>
            </Popover>
          ) : (
            <span className={`${cx('text')} ${this.props.textClassName}`}>
              {this.props.children}
            </span>
          )}
        </div>
      </div>
    );
  }
}

export default Tips;
