import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import store from '@/store/index/index'
import storage from 'store' // git地址  https://github.com/marcuswestin/store.js#user-content-api
import {
    ToastPlugin,
    LoadingPlugin
} from 'vux'
import {
    loginPhone
} from './baseConfig'
Vue.use(ToastPlugin);
Vue.use(LoadingPlugin);
var vueTips: any = new Vue();

axios.defaults.timeout = 60000;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


axios.interceptors.request.use(config => {
    //初始化post参数
    //store.dispatch('updateLoading', true); //开启loading
    vueTips.$vux.loading.show({
        text: '加载中'
    })
    // config.headers.sjboacertphone = store.state.openid || "";
    /* config.headers.sjboacertphone = localStorage.getItem('userPhone') || ''; */
    config.headers.sjboacert = loginPhone;

    // 客户端类型，1.公众号，2混合开发
    config.headers.clientType = 2;
    return config;
}, error => {
    vueTips.$vux.toast.text('参数错误', 'center');
    return Promise.reject(error);
});

//请求响应拦截器
axios.interceptors.response.use(
    res => {
        vueTips.$vux.loading.hide();
        //store.dispatch('updateLoading', false); //关闭loading
        if (res.status === 200) {
            return res.data;
        } else {
            vueTips.$vux.toast.text('服务异常，请稍后重试！[status:!200]', 'center');
            return;
        }
    }, error => {
        vueTips.$vux.loading.hide();
        //store.dispatch('updateLoading', false); //关闭loading
        if (error.response == undefined) {
            vueTips.$vux.toast.text('服务异常，请稍后重试！', 'center');
            return;
        }
        switch (error.response.status) {
            case 400:
                vueTips.$vux.toast.text('服务器打盹了，请稍后重试！[status:400]', 'center');
                break;
            case 401:
                vueTips.$vux.toast.text('服务器打盹了，请稍后重试！[status:401]', 'center');
                break;
            case 403:
                vueTips.$vux.toast.text('服务器打盹了，请稍后重试！[status:403]', 'center');
                break;
            case 404:
                vueTips.$vux.toast.text('服务器打盹了，请稍后重试！[status:404]', 'center');
                break;
            case 500:
                vueTips.$vux.toast.text('服务器打盹了，请稍后重试！[status:500]', 'center');
                break;
            default:
                vueTips.$vux.toast.text('服务器打盹了，请稍后重试！[status:default]', 'center');
                break;
        }

        // 这里屏蔽掉promise的错误返回值，否则前端axios不做catch处理时控制台会出错！ return
        // Promise.reject('服务器异常,被全局响应拦截');
        return Promise.reject(error.response.data.message || '服务器异常');
    });

export default axios;