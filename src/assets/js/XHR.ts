import common from '@/assets/js/common';
import Vue from 'vue'
import  { ToastPlugin } from 'vux'
Vue.use(ToastPlugin)
// import sdk from "../../../static/js/sdk.js";
var vueTips: any = new Vue();
function appLogout(){
    common.logout()
    window.location.href = "./#/login"
}
export default {
    async http(url, params, showLoading = true) {
        // 匹配所有表情字符
        // 方法一：params转成字符串 test匹配
        var s = JSON.stringify(params)
        if(/[\ud800-\udbff][\udc00-\udfff]/g.test(s)){
            vueTips.$vux.toast.text("请勿填写特殊字符");
            return
        }
        //方法二： 找出对象中所有的字符串 test匹配
        // var flag = false
        // function getStr(obj) {
        //     for(let i in obj){
        //         if(typeof(obj[i]) == 'string'){
        //             // 屏蔽emoji
        //             if(/[\ud800-\udbff][\udc00-\udfff]/g.test(obj[i])){
        //                 vueTips.$vux.toast.text("请勿填写特殊字符");
        //                 flag = true
        //                 break
        //             }
        //             //替换英文字符(app壳子兼容性问题)
        //             obj[i] = obj[i].replace(/\[/g,"【").replace(/\]/g,"】").replace(/\{/g,"｛").replace(/\}/g,"｝")
        //         }else if(typeof(obj[i]) == 'object'){
        //             getStr(obj[i]);
        //         }
        //     }
        //     return flag
        // }
        // if(getStr(params)) return
        // console.log(params,"params----------------")
        if(showLoading){
            sdk.components.showLoading({ // 异步方法当同步调用
                title: '正在加载...',
            })
        }
        var res: any = await common.getStorage('sjboacert');
        var userPhone = res.status == 0 ? res.data.phone : '';
        return new Promise((resolve, reject) => {
            sdk.biz.http({
                headers: {
                    sjboacert: userPhone || '',
                    clientType:2,
                },
                params: {
                    ...params
                },
                url: url,
                success: function (rtn) {
                    
                    console.log('....success',rtn)
                    resolve(rtn);
                },
                fail: function (rtn) {
                    console.log('....fail','---url:',url,'---',rtn)
                    if(rtn.status == 20){
                        vueTips.$vux.toast.text(rtn.message);
                        setTimeout(function () {
                            appLogout()
                        }, 3000); 
                        return
                    }
                    sdk.components.showToast({ // 错误提示
                        title: rtn.message
                    })
                    resolve(rtn);
                },
                complete: function (rtn) {
                    if(showLoading){
                        sdk.components.hideLoading({}) // 关闭Loading
                    }
                }
            });
        })
    },
}
