import React from 'react';
import PropTypes from 'prop-types';
import { Button, Result } from 'antd';
import styles from './index.less';

const Error = props => {
  const { returnButtonText, onReturn, message } = props;
  return (
    <Result
      status="error"
      title="出错了"
      subTitle="非常抱歉，请联系管理员"
      extra={
        <Button type="primary" onClick={onReturn}>
          {returnButtonText}
        </Button>
      }
      style={{ marginTop: 48, marginBottom: 16 }}
    >
      <div className={styles.title}>{message}</div>
    </Result>
  );
};

Error.propTypes = {
  returnButtonText: PropTypes.string,
  message: PropTypes.string,
  onReturn: PropTypes.func,
};

Error.defaultProps = {
  returnButtonText: '返回',
};

export default Error;
