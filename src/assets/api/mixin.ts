import common from '@/assets/js/common'
// import sdk from "../../../static/js/sdk.js";
export default {
    data() {
        return {

        }
    },
    methods:{
        getCurData() {
            var _this = this;
            return new Promise((resolve,reject) => {
                sdk.ability.getStorage({
                    key:'userInfo',
                    success(data) {
                        resolve(data)
                        // _this.baseInfo = data;
                    },
                    fail(status) {
                        console.log('fail',status)
                    },
                    complete(status) {
                        console.log('complete',status)
                    }
                })
            })

        },
        showLoading(title) {
            sdk.components.showLoading({
                title: title || '正在加载...',
            })
        },
        hideLoading() {
            sdk.components.hideLoading({})
        },
    }
}
