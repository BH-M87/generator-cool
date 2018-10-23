/* global location */
import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import URLSearchParams from 'url-search-params';
import utils from 'common/utils';
import routeConfig from 'config/routeConfig';

const { navTo } = utils;

export class Http {
  defaultConfig = {
    csrf: {
      api: '/csrf/getCsrfToken',
      timeout: 11 * 60 * 10000,
      getToken: response => response.token,
    },
    errorHook: (error, url) => {
      console.error(`${error}, from: ${url}`);
      throw error;
    },
    notLoginInErrorCode: 1029,
    notLoginInUrl: routeConfig.login.path,
    parseResult: data => data && data.data,
    isGetParamJsonStringfy: true,
  };

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    const error = new Error(response.statusText);
    error.data = response;
    throw error;
  }

  notLoginIn(loginPageUrl) {
    /* eslint no-restricted-globals:0 */
    // history.push({ pathname: routeConfig.login.path, search: `?redirectUrl=${location.pathname}` });
    const urlReg = /^https?:\/\/*/;
    if (loginPageUrl && urlReg.exec(loginPageUrl)) {
      window.location.href = loginPageUrl;
    } else if (this.defaultConfig.notLoginInUrl) {
      navTo({ pathname: this.defaultConfig.notLoginInUrl });
    }
  }

  checkErrCode(dataObj) {
    const { errCode, data, errMsg } = dataObj;
    if (!errCode || errCode === 0) {
      return;
    }
    if (errCode === this.defaultConfig.notLoginInErrorCode) {
      this.notLoginIn(errMsg);
    }

    const error = new Error(errMsg);
    error.code = errCode;
    error.data = data;
    throw error;
  }

  parseResult(data) {
    this.checkErrCode(data);
    return this.defaultConfig.parseResult
      ? this.defaultConfig.parseResult(data)
      : data;
  }

  async parseJSON(response) {
    return response.json();
  }

  async processResult(response) {
    this.checkStatus(response);
    const returnResponse = await this.parseJSON(response);
    return this.parseResult(returnResponse, response.url);
  }

  async request(url, init, headers = {}, config = { throwError: false }) {
    try {
      const options = _.assign(
        {
          credentials: 'include',
        },
        init,
      );
      options.headers = Object.assign(
        {
          'x-requested-with': 'XMLHttpRequest',
        },
        options.headers || {},
        headers || {},
      );
      let response = await fetch(url, options);
      response = await this.processResult(response);
      return response;
    } catch (error) {
      this.defaultConfig.errorHook(error, url);
      if (config.throwError) throw error;
      return null;
    }
  }

  /**
   * headers
   * csrf
   * host
   * cqrs
   **/
  set config(config) {
    this.defaultConfig = {
      ...this.defaultConfig,
      ...config,
    };
  }

  token = null;
  async getCsrfToken() {
    if (!this.defaultConfig.csrf) {
      return undefined;
    }
    if (window.ajaxHeader && window.ajaxHeader['x-csrf-token']) {
      this.token = window.ajaxHeader['x-csrf-token'];
      return this.token;
    }
    if (!this.token) {
      let response = await this.get(this.defaultConfig.csrf.api);
      if (this.defaultConfig.csrf.getToken) {
        response = this.defaultConfig.csrf.getToken(response);
      }
      if (!response) {
        throw new Error('CSRF Not EXIST!');
      }
      // response is a object with attribute token
      this.token = response;
      setTimeout(() => {
        this.token = null;
      }, this.defaultConfig.csrf.timeout || 11 * 60 * 1000);
    }
    return this.token;
  }

  async get(api, data = {}, headers = {}, config = {}) {
    let query;
    if (_.isEmpty(data)) {
      query = '';
    } else if (this.defaultConfig.isGetParamJsonStringfy) {
      query = `?json=${encodeURIComponent(JSON.stringify(data))}`;
    } else {
      // https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams
      const searchParams = new URLSearchParams();
      _.keys(data).forEach(key => {
        searchParams.append(key, data[key]);
      });
      query = `?${searchParams.toString()}`;
    }
    return this.request(`${api}${query}`, {}, headers, config);
  }

  async post(api, data = {}, customeHeaders = {}, config = {}) {
    const token = await this.getCsrfToken();
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token,
      ...customeHeaders,
    };
    const formBody = JSON.stringify(data);
    return this.request(
      api,
      {
        method: 'POST',
        headers,
        body: formBody,
      },
      {},
      config,
    );
  }

  async submitForm(api, formData, customeHeaders = {}, config = {}) {
    const token = await this.getCsrfToken();
    const headers = {
      'X-CSRF-TOKEN': token,
      ...customeHeaders,
    };
    return this.request(
      api,
      {
        method: 'POST',
        headers,
        body: formData,
      },
      {},
      config,
    );
  }
}

const http = new Http();

export default http;
