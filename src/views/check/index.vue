<template>
    <div>
        <div class="title">
            <img src="../../assets/img/check/title.png" alt="">
        </div>
        <div class="input">
            <input type="text" placeholder="姓名" v-model.trim="applyData.userName">
        </div>
        <div class="input">
            <input type="text" placeholder="手机号" v-model.trim="applyData.phone">
        </div>
        <div class="btn" @click="submit"></div>
    </div>
</template>
<script lang="ts">
import com from '@/assets/js/common'
import api from '@/assets/api/index.api'
import MapInfo from '@/components/MapInfo.vue'
import Utils from './utils';
import { APPLY_data} from "./interface";
import { Group, XInput,Selector, XButton,Box,Flexbox,XTextarea,Checklist,Confirm, FlexboxItem, TransferDomDirective as TransferDom} from 'vux';

import { Vue, Component } from "vue-property-decorator";
@Component({
    components: {
        Group,
        Selector,
        XInput,
        Confirm,
        XButton,
        Flexbox,
        FlexboxItem,
        Box,
        Checklist,
        XTextarea,
        MapInfo,
    }
})
export default class projectApply extends Vue {
    applyData:APPLY_data = {
        phone:"",
        userName:"",
    }
    phone = ""
    created() {
        this.init();
    }
    mounted() {

    }
    init(): void {
        com.comGetStorage("checkUserName").then((res:any) => {
            if(res !== undefined){
                com.covertHttp(api.queryUserIsBindForNew,{phone:res.phone}).then((rtn:Ajax.AjaxResponse) => {
                    if(rtn.status == 0) {
                        this.$vux.toast.text(rtn.message);
                        if(rtn.data.isBind == 1){
                            // window.location.href = "url";
                        }
                    }
                });
            }
        });
    }
    submit(): void{
        if (!Utils.vali(this)) return; //校验  
        com.covertHttp(api.saveUserNew,this.applyData).then((rtn:Ajax.AjaxResponse) => {
            if(rtn.status == 0) {
                this.$vux.toast.text(rtn.data);
                com.comSetStorage('checkUserName',this.applyData)
                // window.location.href = "url";
            }
        });
    }

}

</script>
// <style lang="less">
// @import "../../assets/css/common/reset.fix.less";
// @import "../../assets/css/common/base.less";
// @import "../../assets/css/index.less";
// </style>
<style scoped lang="less">

    .title{
        margin:0 auto;
        margin-top: 77px;
        width: 305px ;
        height: 175px;
        background-image: url('../../assets/img/check/bg.png');
        background-size:cover;
        display:flex;
        justify-content: center;
        align-items:center;
        img{
            width:225px;
            height: 36px;
        }
    }
    .input{
        width:292px;
        height: 48px;
        background-image: url('../../assets/img/check/input.png');
        background-size:100% 100%;
        margin:0 auto;
        margin-top: 30px;
        text-aline:center;
        input{
            width:85%;
            height: 80%;
            border:none;
            margin-top: 2px;
            margin-left:20px;
            font-size:16px;
            
        }
    }
    .btn{
        width:178px;
        height: 48px;
        background-image: url('../../assets/img/check/btn.png');
        background-size:cover;
        margin:0 auto;
        margin-top: 30px;
    }
</style>
