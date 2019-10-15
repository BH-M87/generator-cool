import defaultConfig from './.umirc';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

export default {
  chainWebpack(config, ...args) {
    defaultConfig.chainWebpack(config, ...args);
    config.plugin('Analyzer').use(BundleAnalyzerPlugin);
  },
};
