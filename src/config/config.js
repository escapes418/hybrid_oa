import loginPhone from './loginPhone.js';
const NODE_ENV = process.env.NODE_ENV;

const config = {
  // 内网配置
  dev: {
    baseURL: './oa/wechat',
    loginPhone: loginPhone,
    clientType: 2,
    env: 'dev'
  },
  // 测试配置
  test: {
    baseURL: 'http://web.sijibao.co/OA/wechat',
    loginPhone: loginPhone,
    clientType: 2,
    env: 'test'
  },
  // 生产配置
  prod: {
    baseURL: 'https://oa.sijibao.com/OA/wechat',
    loginPhone: loginPhone,
    clientType: 2,
    env: 'prod'
  }
};

// 根据环境变量 导出对应配置
let envConfig = null;
if (NODE_ENV == 'development') {
  /**
   * debug_server -> 调试服务器
   * 在开发模式下 为方便调试  开发者可自行修改debug_server 用本地项目连接不同的目标服务器
   * debug_server：dev  开发服务器(默认)
   * debug_server：test 测试服务器
   * debug_server：prod 生产服务器
   */

  let envkey = window.localStorage.getItem('debug_server') || 'dev';
  if (envkey != 'dev' && envkey != 'test' && envkey != 'prod') envkey = 'dev';

  envConfig = { ...config[envkey] };

  if (envkey === 'dev') {
    // 本机开发模式默认连接内网服务器
    // 若本地localStorage存在dev_host 则覆盖默认目标
    const dev_host = window.localStorage.getItem('dev_host') || '';
    // const dev_host = 'http://192.168.12.4:8089/OA/wechat'; //万雄波

    if (dev_host) envConfig.baseURL = dev_host;
  }
} else if (process.env.NODE_ENV == 'test') {
  sdk.ability.getStorage({
    key: 'key',
    data: { data: '1' },
    complete(status) {
      console.log('isapp');
    }
  });
  envConfig = { ...config.test };
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = './static/js/vconsole.min.js';
  document.getElementsByTagName('head')[0].appendChild(script);
} else {
  envConfig = { ...config.prod };
}

export default envConfig;
