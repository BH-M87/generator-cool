import { request } from '@tarojs/taro';
import genAPI from 'cool-utils/es/utils/services/genAPI';
import api from './api';

export default genAPI(api, ({ method, path, data, headers, config } = {}) =>
  request({ method, url: path, data, headers, ...config }),
);
