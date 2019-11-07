const TARGETS = {
  mock: 'https://mocks.alibaba-inc.com/mock/vplan',
};
const TARGET = TARGETS[process.env.PROXY_TARGET];

// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  hash: true,
  publicPath: './',
  proxy: {
    context: (pathname, req) => {
      return req.headers['x-requested-with'] === 'XMLHttpRequest';
    },
    target: TARGET,
    changeOrigin: true,
    ws: true,
    onProxyReqWs: proxyReq => {
      proxyReq.setHeader('origin', TARGET);
    },
    secure: false,
  },
  plugins: [
    [
      'umi-plugin-react',
      {
        title: '<%= title %>',
        pwa: {
          manifestOptions: {
            srcPath: './src/manifest.json',
          },
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        },
        antd: true,
        dva: {
          dynamicImport: undefined,
        },
        dll: {
          // exclude: [
          //   'react',
          //   'react-dom',
          //   'prop-types',
          //   // 'antd',
          //   'moment',
          // ],
        },
        dynamicImport: {
          webpackChunkName: true,
          loadingComponent: 'components/Empty',
        },
        routes: {
          exclude: [
            /model\.(j|t)sx?$/,
            /service\.(j|t)sx?$/,
            /models\//,
            /components\//,
            /services\//,
          ],
        },
      },
    ],
  ],
  chainWebpack(config) {
    config.resolve.modules.add(resolve(__dirname, './src'));
    config.module
      .rule('worker-loader')
      .test(/\.worker\.js$/i)
      .use('worker-loader')
      .loader('file-loader');
  },
};
