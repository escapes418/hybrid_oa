<template>
    <div>
        <group title='进度情况' label-margin-right="1em">
            <sinSelector sTitle='进度状态' :isRequired="true" sPlaceholder='请选择' :dataList="needTypeList" :sendData="applyData.progressName" :selectedItem.sync="applyData.progressName" @on-change="changeProgress"></sinSelector>

            <!-- 进度状态：需求审核中 -->
            <sinSelector sTitle='需求紧急度' v-if="applyData.progressName=='需求审核中'" :isRequired="true" sPlaceholder='请选择' :dataList="dictionary.urgency" :sendData="applyData.urgency" :selectedItem.sync="applyData.urgency"></sinSelector>

            <!-- 进度状态：需求调研中 -->
            <sinSelector sTitle='优先级' v-if="applyData.progressName=='需求调研中'" :isRequired="true" sPlaceholder='请选择' :dataList="dictionary.priority" :sendData="applyData.priority" :selectedItem.sync="applyData.priority"></sinSelector>

            <!-- 进度状态：产品设计中 -->
            <sinSelector sTitle='产品端' v-if="applyData.progressName=='产品设计中'" :isRequired="true" sPlaceholder='请选择' :dataList="dictionary.product" :sendData="applyData.productEnd" :selectedItem.sync="applyData.productEnd"></sinSelector>
            <datetime format="YYYY-MM-DD" v-if="applyData.progressName=='产品设计中'" v-model="applyData.planDesignTime" class="data-time" title="预计设计时间" :readonly="isReadonly" placeholder="请选择日期">
                <span slot="title">预计设计时间<span class="required">*</span></span>
            </datetime>

            <!-- 进度状态：开发中 -->
            <datetime format="YYYY-MM-DD" v-if="applyData.progressName=='开发中'" v-model="applyData.planDevTime" class="data-time" title="预计开发时间" :readonly="isReadonly" placeholder="请选择日期">
                <span slot="title">预计开发时间<span class="required">*</span></span>
            </datetime>
            <datetime format="YYYY-MM-DD" v-if="applyData.progressName=='开发中'" v-model="applyData.planTestTime" class="data-time" title="预计提测时间" :readonly="isReadonly" placeholder="请选择日期">
                <span slot="title">预计提测时间<span class="required">*</span></span>
            </datetime>
            <datetime format="YYYY-MM-DD" v-if="applyData.progressName=='开发中'" v-model="applyData.planReleaseTime" class="data-time" title="预计上线时间"  :readonly="isReadonly" placeholder="请选择日期">
                <span slot="title">预计上线时间<span class="required">*</span></span>
            </datetime>

            <!-- 进度状态：上线 -->
            <datetime format="YYYY-MM-DD" v-if="applyData.progressName=='上线'" v-model="applyData.actualReleaseTime" class="data-time" title="实际上线时间"  :readonly="isReadonly" placeholder="请选择日期">
                <span slot="title">实际上线时间<span class="required">*</span></span>
            </datetime>
            <datetime format="YYYY-MM-DD" v-if="applyData.progressName=='上线'" v-model="applyData.trainTime" class="data-time" title="培训时间" :readonly="isReadonly" placeholder="请选择日期">
                <span slot="title">培训时间<span class="required">*</span></span>
            </datetime>

            <x-textarea title="处理说明" v-model.trim="applyData.handleExplain" :autosize="true" :max="200">
                <span slot="label" style="padding-right:10px;">处理说明<span class="required">*</span></span>
            </x-textarea>

        </group>
        <box gap="10px 10px">
            <flexbox>
                <flexbox-item>
                    <x-button v-if="isReadonly" type="primary" @click.native="backStep">返回</x-button>
                    <x-button v-else type="primary" :disabled="disSubmit" @click.native="submit">提交</x-button>
                </flexbox-item>
            </flexbox>
        </box>
    </div>
</template>
<script>
import Vue from 'vue'
import com from '@/assets/js/common'
import sinSelector from '@/components/sinSelector'
import mulSelectors from '@/components/mulSelectors'
import Utils from './utils';
import api from '@/assets/api/index.api'
import { Tab, TabItem, Group, Cell, CellBox, Icon, XInput,Selector,XAddress, Datetime,XButton,Popup,Box,Flexbox,XTextarea,Checklist,Confirm,  FlexboxItem, TransferDomDirective as TransferDom} from 'vux';


export default {
    name: "CoopSchedule",
    directives: {
        TransferDom
    },
    components: {
        Tab,
        TabItem,
        Group,
        Cell,
        CellBox,
        Icon,
        Selector,
        XInput,
        Datetime,
        Confirm,
        XButton,
        XAddress,
        Flexbox,
        FlexboxItem,
        XTextarea,
        Popup,
        Box,
        Checklist,
        sinSelector,
        mulSelectors,
    },
    data() {
        return {
            isSubmit:false,
            isReadonly:false,
            ready:false,
            dailyDateObj:'',
            custClassify: [], //客户分类
            tranList:[],
            userInfo:{},
            applyData:{
                actualReleaseTime: "",//实际上线时间
                handleExplain: "",//处理说明
                needFlowId: this.$route.params.needFlowId,//协作ID
                planDesignTime: "",//预计设计时间
                planDevTime: "",//预计开发时间 
                planReleaseTime: "",//预计上线时间
                planTestTime: "",//预计提测时间
                priority: "",//优先级
                productEnd: "",//产品端
                progressName: "",
                trainTime: "",//培训时间
                urgency: "",//需求紧急度
                isEnd: 0,
                },
            schStatus: "",
            projectList: [],
            needTypeList: [],
            dictionary: {
                urgency: [],
                priority: [],
                product: [],
                actCategory: [],
            },
            disSubmit: false,
        }
    },
    created() {
        this.init();
        this.getDictionary();
    },
    methods: {
        init() {
            com.comGetStorage("queryDictInfo").then(res => {
                res.dict.forEach((item, index) => {
                    this.projectList.push({
                        ...item,
                        value: item.label,
                        key: item.value
                    });
                });
            });
            this.queryNeedType();
        },
        changeProgress(){
            this.needTypeList.forEach((item,index)=>{
                if(item.key == this.applyData.progressName){
                    this.applyData.isEnd = item.isEnd
                }
            })
        },
        getDictionary(){
            com.comGetStorage('queryDict').then(data => { 
                var getData = data.dict 
                function selectDic(type) {
                    let temp = [];
                    for (var i = 0; i < getData.length; i++) {
                        if (getData[i].type == type) {
                            temp.push({
                                ...getData[i],
                                key:getData[i].value,
                                value:getData[i].name,
                            });
                        }
                    }
                    return temp;  
                }
                this.dictionary.urgency = selectDic("urgency"); //紧急度
                this.dictionary.priority = selectDic("priority"); //优先级
                this.dictionary.product = selectDic("product_end"); //优先级
            });
        },
        queryNeedType(){
            com.covertHttp(api.queryNeedType,{
                typeId: this.$route.params.typeId,
                }).then(res => {
                if(res.status == 0) {
                    res.data[0].needProgressList.forEach((item,index)=>{
                        this.needTypeList.push({
                            ...item,
                            key: item.progressName,
                            value: item.isEnd==1?item.progressName+"(结束状态)":item.progressName,
                        })
                    })
                }
            })
        },
        addSchedule() {
            var _this = this;
            com.covertHttp(api.promoteProgress,{
                ...this.applyData,
                actualReleaseTime:com.timeParse(this.applyData.actualReleaseTime),
                planDesignTime:com.timeParse(this.applyData.planDesignTime),
                planDevTime:com.timeParse(this.applyData.planDevTime),
                planReleaseTime:com.timeParse(this.applyData.planReleaseTime),
                planTestTime:com.timeParse(this.applyData.planTestTime),
                trainTime:com.timeParse(this.applyData.trainTime),
                }).then(res => {
                if(res.status == 0) {
                    this.$vux.toast.text(res.message);
                    this.$router.go(-1);
                    com.delKeepAlive(_this,["CoopList"])
                }
                this.disSubmit = false;
            })
        },
        backStep(){
            this.$router.go(-1)
        },
        submit() {
            var _this = this
            if (!Utils.valiSchedule(this)) return; //校验
            this.disSubmit = true
            this.$vux.confirm.show({
                title: "是否提交",
                content: "确定执行操作？",
                onCancel() {
                    _this.disSubmit = false;
                },
                onConfirm() {
                    _this.addSchedule();
                }
            });
            
        },
    },
}
</script>
<style lang="less">
@import "../../assets/css/common/reset.fix.less";
@import "../../assets/css/common/base.less";
@import "../../assets/css/index.less";
</style>
