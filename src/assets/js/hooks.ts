import baseConfig from '@/assets/api/baseConfig'
import store from '@/store/index/index'
var BC:any = baseConfig
var Config = {
    appid: BC.appid,
    backBaseUrl: BC.weChartUrl + "/wechat/setting/notify"
}

export const routesObj = {
    path: "/router/:state/:id",
    redirect: function (to) {
        /* redirect中不能包含异步操作 */
        // console.log('服务端传递过来的openid:',to.params.id);
        //localStorage.setItem('openid', to.params.id);
        store.commit('SET_OPENID', to.params.id);
        // var path = to.params.state.replace(new RegExp(/-/, "g"), "/").replace(new RegExp(/\*/, "g"), "?");
        var path = to.params.state.replace(new RegExp(/-/g), "/").replace(new RegExp(/\*/g), "?");
        return path;
    }
}
export const beforeEachHandler = function (to, from, next) {
    /*
    此处若有异步请求，可以用使用promise，router会阻止页面渲染
    适用场景：用接口去取后台地址和appid
    */
    // var promiseModule = window.location.href.split("#")[0];
    // console.log("原始地址",to.fullPath);
    //var ConvertPath = to.fullPath.replace("/", "").replace(new RegExp(/\//, "g"), "-").replace(new RegExp(/\?/, "g"), "*");
    // var ConvertPath = to.fullPath.replace("/", "").replace(new RegExp(/\//g), "-").replace(new RegExp(/\?/g), "*");
    /*
    替换第一个/
    后面所有/ ----> -
    后面所有? ----> *
    */
    // console.log("替换后地址",ConvertPath);
    //var localOpenId = localStorage.getItem('openid');
    if (store.state.openid) {
        next();
    } else {
        //后端处理格式  front#/router/state/openid
        /* var backBaseUrl = Config.backBaseUrl,
            appid = Config.appid,
            frontBaseUrl = promiseModule,
            routerParam = ConvertPath,
            redirectUrl = backBaseUrl + '?front=' + frontBaseUrl;
            console.log("跳转至微信地址：",redirectUrl);
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + redirectUrl + "&response_type=code&scope=snsapi_base&state=" + routerParam + "#wechat_redirect"; */
        /* window.location.href = '#/bind'
        next(); */
    }
}
