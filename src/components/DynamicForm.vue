<template>
    <div class="sinselector">
        <group label-margin-right="1em">
            <div v-if="item.columnType == 'text'">
                <x-input :title="item.columnLabel" placeholder='请输入' v-model.trim="item.value" :readonly="item.readonly==1?true:false">
                    <span v-if="item.required==1?true:false" slot="label">{{item.columnLabel}}<span class="required">*</span></span>
                </x-input>
            </div>
            <div v-if="item.columnType == 'select'">
                <sinSelector :sTitle='item.columnLabel' :isRequired="item.required==1?true:false" sPlaceholder='请选择' :dataList="item.DataList" :sendData="item.value" :selectedItem.sync="item.value" @on-change="changeItem"></sinSelector>
            </div>
            <div v-if="item.columnType == 'select-cust'">
               <RemoteSearch sTitle='客户名称' :isRequired="true" sPlaceholder='请选择' :rOption="item.rOption" :sendData="item.value" :selectedItem.sync="item.value" @on-change="changeRemote" :sLabel="item.dLabel"></RemoteSearch>
            </div>
        </group>
    </div>
</template>

<script>
import {
    Box,
    Group,
    XInput,
} from "vux";
import sinSelector from "@/components/sinSelector";
import RemoteSearch from "@/components/RemoteSearch.vue";
export default {
    components: {
        Box,
        Group,
        XInput,
        sinSelector,
        RemoteSearch,
    },
    props: {
        item:[String, Boolean, Number,Object],
    },
    data() {
        return {

        };
    },
    created() {

    },
    watch: {

    },
    mounted() {

    },
    methods: {
        validDynamic(){
            if(!this.item.value&&this.item.required==true){
                if(this.item.columnType == 'text') {
                    this.$vux.toast.text(`请输入${this.item.columnLabel}`);
                } else if (this.item.columnType == 'select') {
                    this.$vux.toast.text(`请选择${this.item.columnLabel}`);
                } else if (this.item.columnType == 'select-cust') {
                    this.$vux.toast.text(`请选择${this.item.columnLabel}`);
                }
                return false
            } else {
                return true
            }
        },
        changeItem(){
            this.item.DataList.forEach((el,idx)=>{
                if(el.key == this.item.value) {
                    this.$emit("on-change",{...el,memberType: this.item.memberType});
                }
            }) 
        },
        changeRemote(el){
            this.$emit("on-change",{...el,memberType: this.item.memberType});
        },
    }
};
</script>

<style lang="less">
.sinselector {
    .weui-cells {
        margin-top: 0 !important;
    }
    .vux-no-group-title {
        margin-top: 0 !important;
    }
    .weui-cells:before {
        left: 15px !important;
    }
    .weui-cells:after {
        border-bottom: none !important;
    }
    .weui-textarea {
        text-align: right !important;
    }
}
</style>
