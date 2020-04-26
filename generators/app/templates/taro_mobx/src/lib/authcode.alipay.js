/* global my */
import { getEnv } from '@tarojs/taro';

if (getEnv() === 'ALIPAY') {
  my.getAuthCode({
    scopes: 'auth_user', // 主动授权：auth_user，静默授权：auth_base。或者其它scope
    success: res => {
      if (res.authCode) {
        // 认证成功
        // 调用自己的服务端接口，让服务端进行后端的授权认证，并且种session，需要解决跨域问题
        my.request({
          url: 'https://isv.com/auth', // 该url是您自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
          data: {
            authcode: res.authCode,
          },
          success: () => {
            // 授权成功并且服务器端登录成功
          },
          fail: () => {
            // 根据自己的业务场景来进行错误处理
          },
        });
      }
    },
  });
}
