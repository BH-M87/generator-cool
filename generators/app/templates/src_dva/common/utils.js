import _ from 'lodash';
import classnames from 'classnames';
import history from 'common/history';

export default {
  classnames: (prefix, styles) => {
    const cx = classnames.bind(styles);
    return (...names) =>
      cx(_.map(names, name => {
        if (typeof name === 'string') {
          return `${prefix}-${name}`;
        } else if (typeof name === 'object') {
          const returnObj = {};
          for (const key in name) {
            if (Object.prototype.hasOwnProperty.call(name, key)) {
              const element = name[key];
              returnObj[`${prefix}-${key}`] = element;
            }
          }
          return returnObj;
        }
        return '';
      }));
  },
  number: {
    localize(num, precision = 2) {
      if (!_.isFinite(num)) {
        return '--';
      }
      const flag = num < 0 ? '-' : '';
      const number = Math.abs(num);
      if (number > 100000000) {
        return `${flag}${(number / 100000000).toFixed(precision)}亿`;
      } else if (number > 10000) {
        return `${flag}${(number / 10000).toFixed(precision)}万`;
      }
      return num;
    },
    comma(num) {
      if (_.isNil(num)) {
        return '--';
      }
      const nStr = `${num}`;
      const x = nStr.split('.');
      let x1 = x[0];
      const x2 = x.length > 1 ? `.${x[1]}` : '';
      const rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1,$2');
      }
      return x1 + x2;
    },
    toPercent(value, precision = 2) {
      if (_.isNumber(value) && _.isFinite(value)) {
        const percentValue = (Math.abs(value) * 100).toFixed(precision);
        return `${percentValue}%`;
      }
      return '--';
    },
    numberFormatter(value) {
      const reg = /^(-)*(\d+)\.(\d*).*$/;
      return !isNaN(parseFloat(value))
        ? value.toString().replace(reg, '$1$2.$3')
        : ''; /* eslint no-restricted-globals:0 */
    },
  },
  url: {
    parse(realurl) {
      const url = realurl.replace('#', '');
      const arr = url.split('?');
      if (arr.length === 1) {
        return {};
      }
      const kvStr = arr[1];
      const kv = kvStr.split('&');
      return kv.reduce((params, item) => {
        const kvArr = item.split('=');
        const newParams = params;
        if (kvArr.length === 2) {
          /* eslint prefer-destructuring:0 */
          newParams[kvArr[0]] = kvArr[1];
        }
        return newParams;
      }, {});
    },
  },
  highlight: {
    escape(escapeText) {
      return escapeText
        .replace(/&lt;em&gt;/g, '<em>')
        .replace(/&lt;\/em&gt;/g, '</em>')
        .replace(/<em>/g, '<em>')
        .replace(/<\/em>/g, '</em>');
    },
    removeHighlight(escapeText) {
      return escapeText
        .replace(/&lt;em&gt;/g, '')
        .replace(/&lt;\/em&gt;/g, '')
        .replace(/<em>/g, '')
        .replace(/<\/em>/g, '');
    },
  },
  cutstr: (str, num, suffix = '...') => {
    const len = str.length;
    const result = str.slice(0, num) + (num < len ? suffix : '');
    return result;
  },
  navTo: path => {
    history.push(path);
  },
  // An util for antd cascader component
  // Use it to get the whole array when only the last unique value in the array could be get
  getCascaderValue: (lastValue, cascaderOptions) => {
    const cascaderValue = [];
    let findedCascaderValue = [];

    let level = 0;
    const findLastValue = cascaderOptionArr => {
      for (const item of cascaderOptionArr) {
        if (item.value === lastValue) {
          cascaderValue[level] = item.value;
          findedCascaderValue = cascaderValue.slice(0, level + 1);
          return true;
        } else if (item.children) {
          cascaderValue[level] = item.value;
          level += 1;
          if (findLastValue(item.children)) {
            return true;
          }
        }
      }

      level -= 1;
      return false;
    };
    findLastValue(cascaderOptions || []);
    return findedCascaderValue;
  },
  findPath: (tree, id) => {
    const path = [];
    const findItem = (lTree, lId) => {
      for (const item of lTree) {
        if (item.id === lId) {
          path.push(item.id);
          return true;
        } else if (item.children) {
          path.push(item.id);
          if (findItem(item.children, lId)) {
            return true;
          }
          path.pop();
        }
      }
      return false;
    };
    findItem(tree, id);
    return path;
  },
};
