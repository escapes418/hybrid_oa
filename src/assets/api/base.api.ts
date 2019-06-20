import axios from '@/assets/api/axios';
import baseConfig from '@/assets/api/baseConfig'
//  公用部分api var NODE_ENV = process.env.NODE_ENV; var baseurl = NODE_ENV ==
// 'development' ? 'http://192.168.0.206:9028/trade' : '../trade';

var apiUrl = baseConfig.apiUrl;
var api:any = {};
api.baseUrl = baseConfig.apiUrl;
api.isBind = api.baseUrl + '/notify/isBind';
api.bindOpenId = api.baseUrl + '/notify/bindOpenId';
api.getValidateCode = api.baseUrl + '/notify/getValidateCode';

/*
api.getSignPack = apiUrl + '/wechat/setting/signPackage'; //获取签名包
api.getCompanyList = apiUrl + '/wechat/setting/getCompanyList'; //获取公司列表
api.getBaseInfo = apiUrl + '/wechat/setting/getBaseInfo'; //获取基本信息
api.bindOpenId = apiUrl + "/" //绑定
api.bindOpenId = apiUrl + "/" //报表信息
api.getCode = apiUrl + '/message/send'; //发送验证码
api.bind = apiUrl + '/message/valid'; //openid和手机号绑定
api.getInfo = apiUrl + '/company/bind'; //openid和手机号绑定
api.reportDetail = apiUrl + '/report'; //报表详情

api.test = apiUrl + '/test';
*/

export default api
