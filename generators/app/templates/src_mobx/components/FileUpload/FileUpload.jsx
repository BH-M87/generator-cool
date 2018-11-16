/* eslint no-param-reassign:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';
import reqwest from 'reqwest';
import utils from 'common/utils';
import http from 'common/http';
import { Upload } from 'antd';
import Button from 'components/Button';
import styles from './FileUpload.less';

const PREFIX = 'file-upload';
const cx = utils.classnames(PREFIX, styles);

const FORM_FILES_NAME = 'file';
const ACTION_URL = '/resourceMgr/alertObjMgr/importData';

/*  file attribute example:
  file = {
    uid: 'rc-upload-1510220017186-2',
    name: 'IMG_9293_resize.jpg',
    lastModified: 1508123568725,
    lastModifiedDate: 'Mon Oct 16 2017 11:12:48 GMT+0800 (CST)',
    webkitRelativePath: '',
    lastModified: 1508123568725,
    lastModifiedDate: 'Mon Oct 16 2017 11:12:48 GMT+0800 (CST) {}',
    name: 'IMG_9293_resize.jpg',
    size: 525633,
    type: 'image/jpeg',
    uid: 'rc-upload-1510220017186-2',
    webkitRelativePath: '',
  }; */

class FileUploadModel {
  @observable fileList = [];
  @observable uploading = false;
}

@observer
class FileUpload extends Component {
  /* eslint react/forbid-prop-types:0 */
  static propTypes = {
    options: PropTypes.object, // options refs to https://www.npmjs.com/package/react-fileupload
    buttonType: PropTypes.oneOf(['primary', 'default']),
    text: PropTypes.string,
    className: PropTypes.string,
    autoUpload: PropTypes.bool,
    formDatas: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })), // change the commit prop if caller wants to handleUpload
    startUploading: PropTypes.bool,
    requestHeaders: PropTypes.object,
    chooseFile: PropTypes.func,
    callback: PropTypes.func, // this callback function will be called when the upload finish, whether success or not
    isFileListDisplay: PropTypes.bool,
    clearFileListTrigger: PropTypes.bool,
    successMessage: PropTypes.string,
    errorMessage: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  };

  static defaultProps = {
    options: {
      action: ACTION_URL,
    },
    buttonType: 'primary',
    text: '浏览文件',
    autoUpload: false,
    formDatas: [],
    chooseFile: file => {
      console.log(file);
    },
    callback: (status, fileNames, message, response) => {},
    isFileListDisplay: false,
    startUploading: false,
    requestHeaders: {},
    successMessage: 'Upload successfully!!!',
    errorMessage: 'Upload fail!!!',
  };

  constructor(props) {
    super();
    this.model = new FileUploadModel();
    this.defaultOptions = {
      action: props.options.action,
      beforeUpload: file => {
        this.model.fileList = [file];
        // callback executed when file choosed
        this.props.chooseFile(file);
        return props.autoUpload;
      },
      customRequest: this.customRequest,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.startUploading && nextProps.startUploading !== this.props.startUploading) {
      const formDatas = toJS(nextProps.formDatas);
      this.handleUpload(formDatas);
    }

    if (nextProps.clearFileListTrigger !== this.props.clearFileListTrigger) {
      this.model.fileList = [];
    }
  }

  customRequest = () => {
    this.handleUpload();
  };

  request = async (url, formData, props, model) => {
    const csrfToken = await http.getCsrfToken();

    reqwest({
      url,
      method: 'post',
      processData: false,
      data: formData,
      type: 'json',
      headers: _.assign(
        {
          'X-CSRF-TOKEN': csrfToken,
        },
        this.props.requestHeaders,
      ),
      success: response => {
        model.uploading = false;
        if (response && response.success) {
          props.callback(true, model.fileList, props.successMessage, response);
        } else {
          props.callback(false, model.fileList, response.errMsg || props.errorMessage, response);
        }
        model.fileList = [];
      },
      error: () => {
        model.uploading = false;
        props.callback(false, model.fileList, props.errorMessage);
      },
    });
  };

  handleUpload = (newFormDatas = []) => {
    const { fileList } = this.model;
    const formData = new FormData();

    const addFormData = (fData, newFData) => {
      newFData.forEach(item => {
        fData.append(item.name, item.value);
      });
    };

    fileList.forEach(file => {
      formData.append(FORM_FILES_NAME, file);
    });

    addFormData(formData, newFormDatas);

    this.model.uploading = true;

    this.request(this.props.options.action, formData, this.props, this.model);
  };

  render() {
    const options = _.assign({}, this.defaultOptions, this.props.options);
    if (!this.props.isFileListDisplay) {
      options.fileList = [];
    } else {
      options.fileList = this.model.fileList;
    }
    return (
      <Upload {...options}>
        {this.props.children || (
          <Button
            type={this.props.buttonType}
            text={this.props.text}
            className={`${cx('button')} ${this.props.className}`}
          />
        )}
      </Upload>
    );
  }
}

export default FileUpload;
