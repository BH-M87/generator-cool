import { resolve } from 'path';
import { defineConfig } from 'umi';

export const TARGETS = {
  mock: 'https://mocks.alibaba-inc.com/mock/xxx',
  dev: 'https://devTarget',
};
const TARGET = TARGETS[process.env.PROXY_TARGET];

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  proxy: {
    context: (pathname: string, req: any) => {
      return req.headers['x-requested-with'] === 'XMLHttpRequest';
    },
    target: TARGET,
    changeOrigin: true,
    ws: true,
    onProxyReqWs: (proxyReq: any) => {
      proxyReq.setHeader('origin', TARGET);
    },
    secure: false,
  },
  dynamicImport: {
    loading: 'components/Empty',
  },
  chainWebpack(config) {
    config.resolve.modules.add(resolve(__dirname, './src'));
    config.module
      .rule('worker-loader')
      .test(/\.worker\.js$/i)
      .use('worker-loader')
      .loader('file-loader');
  },
});
