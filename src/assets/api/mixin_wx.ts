import Vue from 'vue'
import api from '@/assets/api/base.api';
import {
    WechatPlugin
} from 'vux'
// import {
//     AlertPlugin
// } from 'vux'
Vue.use(WechatPlugin);
// Vue.use(AlertPlugin);

export default {
    created() {
        var _this = this;
        var currentUrl = window.location.href.split('#')[0];
        api.getSignPack(currentUrl).then(function (rtn) {
            //配置
            _this.$wechat.config({
                debug: true,
                appId: rtn.appid,
                timestamp: rtn.timestamp,
                nonceStr: rtn.noncestr,
                signature: rtn.signature,
                jsApiList: ["getLocation"]
            })
            //鉴权
            _this.$wechat.ready(function () {
                _this.$wechat.checkJsApi({
                    jsApiList: ['getLocation'],
                    success: function (res) {
                        console.log("签名校验成功！");
                        // 以键值对的形式返回，可用的api值true，不可用为false
                        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                    }
                });
            });
        }).catch(function () {
            _this.$vux.alert.show({
                title: '错误',
                content: '获取签名包服务器异常'
            })
        })
    },
    methods: {
        getLoc(cb) {
            var _this = this;
            _this.$wechat.getLocation({
                type: 'wgs84',
                success: function (res) {
                    //res.latitude res.longitude
                    if (cb instanceof Function) {
                        cb(res);
                    }
                },
                cancel: function () {
                    _this.$vux.alert.show({
                        title: '错误',
                        content: '获取签名包服务器异常'
                    })
                }
            })
        }
    }
}