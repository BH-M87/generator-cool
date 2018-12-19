/* global location */
import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import URLSearchParams from 'url-search-params';
import { message } from 'antd';
import utils from 'common/utils';
import history from 'common/history';
import routeConfig from 'config/routeConfig';

const { navTo } = utils;

export class Http {
  defaultConfig = {
    dailyHostname: 'g-assets.daily.taobao.net',
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
    } else if (
      this.defaultConfig.notLoginInUrl &&
      history.location.pathname !== this.defaultConfig.notLoginInUrl
    ) {
      navTo({
        pathname: this.defaultConfig.notLoginInUrl,
        search: `?redirectUrl=${history.location.pathname}${
          history.location.search.substr(1)
            ? `&${history.location.search.substr(1)}`
            : ''
        }`,
      });
    }
  }

  checkErrCode(dataObj) {
    const { errCode, data, errMsg } = dataObj;
    if (!errCode || errCode === 0) {
      return;
    }
    if (errCode === this.defaultConfig.notLoginInErrorCode) {
      this.notLoginIn(errMsg);
      return;
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

  async request(url, init, headers = {}, config = {}) {
    // const fetchUrl =
    //   window.location.hostname === this.defaultConfig.dailyHostname
    //     ? `${serviceConfig.serviceHost}${url.startsWith('/') ? url : `/${url}`}`
    //     : url;
    // loadingState could be false or ture or the message displaying when loading
    const defaultRequestConfig = {
      throwError: false,
      loadingState: false,
      loadingStateMessage: undefined,
    };
    const cfg = Object.assign(defaultRequestConfig, config);
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
    let messageTimeout = null;
    let messageHide;
    if (cfg.loadingState) {
      messageTimeout = setTimeout(() => {
        messageHide = message.loading(
          cfg.loadingState === true
            ? cfg.loadingStateMessage || '请求中，请稍等...'
            : cfg.loadingState,
          0,
        );
      }, 300);
    }
    const hideMessage = () => {
      if (cfg.loadingState) {
        clearTimeout(messageTimeout);
        if (messageHide) {
          messageHide();
        }
      }
    };
    try {
      let response = await fetch(url, options);
      response = await this.processResult(response);
      hideMessage();
      return response;
    } catch (error) {
      hideMessage();
      this.defaultConfig.errorHook(error, url);
      if (cfg.throwError) throw error;
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
      Object.assign({ loadingState: true }, config),
    );
  }

  async form(api, formData, customeHeaders = {}, config = {}) {
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
