/* global window */
const remoteHost = 'test.com:7001';
const { host = remoteHost } = window.location;

export default (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? remoteHost : host);

// export default host;
