/* global _ */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import styles from './HighlightSideBar.scss';

const PREFIX = 'highlight-side-bar';
const cx = utils.classnames(PREFIX, styles);

class HighlightSideBarModel {}

class HighlightSideBar extends Component {
  static propTypes = {
    sideData: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      id: PropTypes.string,
    })),
    offsetAdjustment: PropTypes.number,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    updated: PropTypes.bool,
  };

  static defaultProps = {
    offsetAdjustment: -5,
  };

  constructor() {
    super();
    this.model = new HighlightSideBarModel();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updated) {
      this.handleScrollEvent();
    }
  }

  handleScrollEvent = () => {
    const { sideData } = this.props;
    const anchors = [];
    const anchorsOffset = [];

    for (const item of sideData) {
      const elem = document.getElementById(item.id);
      if (elem) {
        anchors.push({
          id: item.id,
          elem,
        });
      }
    }

    if (anchors.length === 0) return;

    for (const item of anchors) {
      anchorsOffset.push({
        id: item.id,
        // get the offset of each element from the top of page
        offset: item.elem.offsetTop,
      });
    }

    // offsetAdjustment, positive for forward, negative for delay.
    // Adjust according to margin or padding. Default -5
    const { offsetAdjustment } = this.props;

    document.getElementById(`${anchorsOffset[0].id}-menu`).classList.add(cx('current'));
    // add scroll event
    document.getElementsByClassName(cx('children'))[0].addEventListener(
      'scroll',
      _.throttle(() => {
        const CLASSNAME = cx('current');
        for (const item of anchorsOffset) {
          document.getElementById(`${item.id}-menu`).classList.remove(CLASSNAME);
        }
        // get current offset when scroll
        const currentOffset = document.getElementsByClassName(cx('children'))[0].scrollTop;
        if (currentOffset + offsetAdjustment > anchorsOffset[anchorsOffset.length - 1].offset) {
          document
            .getElementById(`${anchorsOffset[anchorsOffset.length - 1].id}-menu`)
            .classList.add(CLASSNAME);
        } else {
          for (const item of anchorsOffset) {
            if (currentOffset + offsetAdjustment < item.offset) {
              document.getElementById(`${item.id}-menu`).classList.add(CLASSNAME);
              break;
            }
          }
        }
      }, 100),
    );
  };

  scrollIntoView = id => () => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  render() {
    return (
      <div className={cx('container')}>
        <div className={cx('side-bar')}>
          {this.props.sideData.map(item => (
            <div
              key={item.id}
              id={`${item.id}-menu`}
              role="button"
              className={cx('side-bar-item')}
              onClick={this.scrollIntoView(item.id)}
            >
              {item.label}
            </div>
          ))}
        </div>
        <div className={cx('children')}>{this.props.children}</div>
      </div>
    );
  }
}

export default HighlightSideBar;
