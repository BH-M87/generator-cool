import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import utils from 'common/utils';
import Button from 'components/Button';
import styles from './InfoContainer.scss';

const PREFIX = 'info-container';
const cx = utils.classnames(PREFIX, styles);

@observer
class InfoContainer extends Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    unBorder: PropTypes.bool,
    extraTitleContent: PropTypes.shape({
      element: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
      text: PropTypes.string,
      onClick: PropTypes.func,
    }),
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.element, PropTypes.string])
      ),
    ]),
  };

  static defaultProps = {
    title: '标题',
    className: '',
    extraTitleContent: {},
  };

  /*eslint comma-dangle:0*/
  render() {
    const {
      title,
      className,
      children,
      unBorder,
      extraTitleContent: { element, text, onClick },
    } = this.props;
    return (
      <div className={`${cx('container')} ${className}`}>
        <div className={cx('title', { 'un-border': unBorder })}>
          <div className={cx('title-left')}>{title}</div>
          {element || text ? (
            <Button className={cx('title-right')} onClick={onClick}>
              {text}
            </Button>
          ) : null}
        </div>
        <div className={cx('children')}>{children}</div>
      </div>
    );
  }
}

export default InfoContainer;
