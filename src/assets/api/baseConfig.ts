//npm run HB 时需要调整
// export const innerInteface = "http://192.168.11.154:8081/OA/wechat",// 徐冰阳
// export const innerInteface = "http://192.168.12.37:8080/OA/wechat",// 张江浩
// export const innerInteface = "http://192.168.12.4:8089/OA/wechat",// 万雄波
// export const innerInteface = "http://192.168.12.79:8080/OA/wechat",// 黄凯

// export const innerInteface = "http://120.31.131.193:8104/OA/wechat",// 193配置
// export const innerInteface = "http://39.104.233.122:8104/OA/wechat",// 阿里云配置（IP版）
// export const innerInteface = "http://oatest.sijibao.com/OA/wechat",// 阿里云配置（域名版）
// export const innerInteface = "https://webtest1.sijibao.com/OA/wechat" // 阿里云配置（域名版）
const innerInteface = 'http://oa.sijibao.co/OA/wechat'; // 新测试配置（域名版）

// export const innerInteface = "https://oa.sijibao.com/OA/wechat",// 正式环境

//登录人帐号
// export const loginPhone = 13026338335; // 徐梦清
// export const loginPhone = 13554676177; // 雷超
// export const loginPhone = 15353741699; //伍设兵
export const loginPhone = 17607109890; //佘浩源
// export const loginPhone = 18502709258; //张党生
// export const loginPhone = 18674069117; //程意
// export const loginPhone = 13307147318; //孙林芳
// export const loginPhone = 19945007556; //向东威
// export const loginPhone = 18062412311; // 王义
// export const loginPhone = 18319429365; // 王桂林
// export const loginPhone = 13907157896; // 龚晓斌
// export const loginPhone = 18995619186; // 胡安逸
// export const loginPhone = 13907157896; //老板
// export const loginPhone = 15927602703; //占桥
// export const loginPhone = 17612759425; //万雄波
// export const loginPhone = 18319429365; //王桂林
// export const loginPhone = 18607178355; //宋斌
// export const loginPhone = 18071113676; //王玮
// export const loginPhone = 19945007556; //向东威
// export const loginPhone = 18506207878; //陈露

// export const loginPhone = 18506207878; //陈露
// export const loginPhone = 15172464020; //蔡晶
// export const loginPhone = 15013868994; //张正成
//
// export const loginPhone = 15807278689; //王树成
// export const loginPhone = 18662336722; //肖朝阳
// export const loginPhone = 18071758504; //彭寅冬
// export const loginPhone = 15971477827; //邱宏

// export const loginPhone = 17306398995; //何磊

// export const loginPhone = 18507166902; //李广

// export const loginPhone = 15072461979; //柳亮
// export const loginPhone = 13377888359; //陈俊

// export const loginPhone = 18565681423; //朱军
// export const loginPhone = 13986037701; //杨文静
// export const loginPhone = 15527379775; //王梦溪
// export const loginPhone = 15271941096; //范安顺

// export const loginPhone = 17771870693; //吴军

// export const loginPhone = 	18513137601; //徐冰阳
// export const loginPhone = 18671012019; //李鑫雨
// export const loginPhone = 13476857615; //丁飞飞

// const NODE_ENV = process.env.NODE_ENV;
var apiUrl;

console.log(process, 'process.argv');
if (process.env.NODE_ENV == 'development') {
  if (process.argv[0] == 'H5') {
    // H5
    apiUrl = './oa/wechat';
  } else {
    // 混合开发
    apiUrl = innerInteface;
  }
} else if (process.env.NODE_ENV == 'test') {
  // npm run build:test
  apiUrl = 'http://oa.sijibao.co/OA/wechat'; // 新测试配置（域名版）
} else if (process.env.NODE_ENV == 'production') {
  // 发布
  // npm run build:prod
  apiUrl = 'https://oa.sijibao.com/OA/wechat'; //正式配置
}
console.log(apiUrl, 'apiUrl');
export default {
  apiUrl: apiUrl
};
