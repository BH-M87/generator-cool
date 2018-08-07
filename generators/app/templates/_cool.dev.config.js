const TARGET = 'http://remoteHost:7001';

module.exports = {
  devServer: {
    port: '8001',
    proxy: {
      // Rules refer to https://www.npmjs.com/package/glob
      // /sockjs-node/** is used for webpack hot reload, do not proxy it
      '!(/sockjs-node/**)': {
        target: TARGET,
        changeOrigin: true,
        ws: true,
        onProxyReqWs: proxyReq => {
          proxyReq.setHeader('origin', TARGET);
        },
        secure: false,
        bypass: req => {
          const { headers, originalUrl } = req;
          // only proxy for xhr and image request
          if (
            headers['x-requested-with'] !== 'XMLHttpRequest' &&
            headers.accept.indexOf('image/') === -1
          ) {
            return originalUrl;
          }
          return false;
        },
      },
    },
  },
};
