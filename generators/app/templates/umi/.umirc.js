// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  hash: true,
  publicPath: './',
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
  },
};
