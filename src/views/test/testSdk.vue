<template>
    <div>
        测SDK啊啊啊啊啊啊啊啊啊啊啊啊
    </div>
</template>
<script>
import Vue from 'vue'
import com from '@/assets/js/common'
import api from '@/assets/api/index.api'
import testsdk from './sdk.js';

// Vue.use(ConfirmPlugin)
export default {
    name: "LogImpDetail",
    directives: {
        // TransferDom
    },
    components: {

    },
    data() {
        return {

        }
    },
    computed: {

    },
    created() {
        // console.log(testsdk.globalRecive)
        window.globalRecive = testsdk.globalRecive;
        console.log(window.globalRecive)
    },
    mounted(){
        this.init();
    },
    methods: {
        init(){
            var params ={
                pageNo: 1,
                pageSize: 1,
                expenseStatus: 2
            }
            var p = {
                pageNo: 1,
                pageSize: 1,
                expenseStatus: 2,
                billType: 4
            }
            // console.log(globalRecive)

            testsdk.biz.http({
                headers: {
                    sjboacert: 17607109890 || '',
                    clientType:2,
                },
                params: {
                    // ...params,//有标点
                    ...p,//无标点
                },
                // url: api.getMysendList,//有标点
                url: api.queryMyRecpFlowList,//无标点
                success: function (rtn) {
                    console.log('....success',rtn)

                },
                fail: function (rtn) {
                    console.log('....fail','---url:',url,'---',rtn)

                },
                complete: function (rtn) {
                    console.log(rtn,"complete")
                }
            });
        },


    }
}
</script>
<style lang="less">

</style>
