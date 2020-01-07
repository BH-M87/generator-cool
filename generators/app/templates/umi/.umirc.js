import { resolve } from 'path';

export const TARGETS = {
  mock: 'https://mocks.alibaba-inc.com/mock/xxx',
  dev: 'https://devTarget',
};
const TARGET = TARGETS[process.env.PROXY_TARGET];

// ref: https://umijs.org/config/
export default {
  define: {
    'process.env.UMI_ENV': process.env.UMI_ENV,
  },
  manifest: {},
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
        dll: {},
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
