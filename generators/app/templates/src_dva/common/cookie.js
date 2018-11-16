import Cookies from 'js-cookie';

function setCookie(key, value, config) {
  Cookies.set(key, value, {
    expires: 10000000,
    ...config,
  });
}

function getCookie(key) {
  return Cookies.getJSON(key);
}

export default {
  setCookie,
  getCookie,
};
