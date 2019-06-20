<template>
    <div>
        <box gap="10px 15px">
            <div style="height:26px">
                <span class="fr font-orange" @click="showDelDialog = true">删除</span>
            </div>
        </box>
        <sinSelector :isRequired="true" sTitle='对象' sPlaceholder='请输入' :dataList="memberList" :sendData="item.targetAssign" :selectedItem.sync="item.targetAssign"></sinSelector>
        <x-input title="满足数量" placeholder="请输入" v-model="item.personelNum">
            <span slot="label">满足数量<span class="required">*</span></span>
        </x-input>
        <x-textarea title="意见" placeholder="请输入" v-model.trim="item.remarks" :autosize="true" :max="1000"></x-textarea>
        <div v-transfer-dom>
            <confirm v-model="showDelDialog" title="删除该指派人" @on-cancel="showDelDialog = false" @on-confirm="delItem">
                <p style="text-align:center;">{{ ('确定是否删除该指派人?') }}</p>
            </confirm>
        </div>
    </div>
</template>
<script>
import com from "@/assets/js/common";
import XHR from "@/assets/js/XHR";
import sinSelector from '@/components/sinSelector'
import { mapState, mapGetters } from "vuex";
import {
    Group,
    XInput,
    Box,
    Confirm,
    Selector,
    XTextarea,
    TransferDomDirective as TransferDom
} from "vux";
import api from "@/assets/api/index.api";
export default {
    directives: {
        TransferDom
    },
    props: {
        index: Number,
        item: Object,
        memberList:Array
    },
    components: {
        Group,
        XInput,
        Box,
        Confirm,
        XTextarea,
        sinSelector: sinSelector
    },
    data: function() {
        return {
            showDelDialog: false, 
        };
    },
    created() {
       
    },
    mounted(){

    },
    computed: {
    
    },
    watch: {
        
    },
    mounted() {

    },
    methods: {
        delItem() {
            this.$store.dispatch("delAssignStaff", this.index);
        },
    }
};
</script>
<style lang="less">
.approval{
    .weui-cells{
        margin-top: 0 !important;
    }
    .vux-no-group-title{
        margin-top: 0 !important;
    }
}

</style>

