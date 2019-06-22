import http from 'common/http';
import { apiPrefix } from 'config/config';
import api from './api';

const parseKey = key => {
  let method = 'get';
  let path = key;

  if (key.indexOf(' ') > -1) {
    const splited = key.split(' ');
    method = splited[0].toLowerCase();
    // eslint-disable-next-line prefer-destructuring
    path = splited[1];
  }

  return { method, path };
};

const gen = param => {
  const { method, path } = parseKey(param);
  const url = (apiPrefix || '') + path;

  return function (data, headers, config) {
    return http[method](url, data, headers, config);
  };
};

const API = {};
for (const key in api) {
  if (Object.prototype.hasOwnProperty.call(api, key)) {
    API[key] = gen(api[key]);
  }
}

export default API;
