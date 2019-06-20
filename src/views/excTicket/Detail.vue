<template>
    <div class="approval_detail">
        <group title='基本信息'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">运单号</span>
                            <span class="long-detail">{{detail.orderNumber}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">车牌</span>
                            <span class="long-detail font-orange">{{detail.vehicleNumber}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">装货地址名</span>
                            <span class="long-detail">{{detail.loadAddressName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">装货时间</span>
                            <span class="long-detail">{{detail.loadTime | stamp2TextDateFull}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">卸货地址名</span>
                            <span class="long-detail">{{detail.unloadAddressName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">卸货时间</span>
                            <span class="long-detail">{{detail.unloadTime | stamp2TextDateFull}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">异常时间</span>
                            <span class="long-detail">{{detail.abnormalTime | stamp2TextDateFull}}</span>
                        </div>                
                    </div>
                </div>
            </cell-box>
        </group>
        <group title='异常说明'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">异常原因</span>
                            <span class="long-detail">{{detail.abnormalMemo}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
    </div>
</template>
<script>
import Vue from 'vue'
import com from '@/assets/js/common'
import api from '@/assets/api/index.api'
import XHR from '@/assets/js/XHR';
import { Box, Confirm, Group, XButton, Timeline, Selector, TimelineItem, Cell,ConfirmPlugin, CellBox, XTextarea, XInput, XDialog, Flexbox, FlexboxItem, TransferDomDirective as TransferDom } from 'vux';
Vue.use(ConfirmPlugin)
export default {
    name: "excListDetail",
    directives: {
        TransferDom
    },
    components: {
        Box,
        Confirm,
        Group,
        Selector,
        XButton,
        Timeline,
        TimelineItem,
        Cell,
        CellBox,
        XTextarea,
        XInput,
        XDialog,
        Flexbox,
        FlexboxItem,
    },
    data() {
        return {
            detail: {},
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            com.comGetStorage("excListDetail").then(res => {
                this.detail = res;
                if (this.detail.abnormalMemo == "null"){
                    this.detail.abnormalMemo = "未填写";
                }
            });
            
        },
    
    }
}
</script>
<style lang="less">

.xdialog-group-textarea{
    .weui-textarea{
        text-align:left !important;
    }
}
</style>
