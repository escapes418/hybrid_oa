<template>
    <div class="approval">
        <group label-width="7em" label-margin-right="1em" label-align="justify">
            <box gap="10px 15px">
                <div style="height:26px">
                    <span></span>
                    <span class="fr font-orange" @click="showDelDialog = true">删除</span>
                </div>
            </box>
            <datetime format="YYYY-MM-DD" v-model="itemData.startDate" style="text-align='right'" class="data-time" title="发生日期" placeholder="请选择发生日期"></datetime>
            <x-address title="起点" :hide-district="true" v-model="itemData.startPoint" :list="addressData" @on-hide="startAddressHide" @on-shadow-change="startAddressChange"  value-text-align="left" placeholder="请选择起点"></x-address>
            <datetime format="YYYY-MM-DD" v-model="itemData.endDate" class="data-time" title="结束日期" placeholder="请选择结束日期"></datetime>
            <x-address title="终点" :hide-district="true" v-model="itemData.endPoint" :list="addressData" @on-hide="endAddressHide" @on-shadow-change="endAddressChange" value-text-align="left" placeholder="请选择起点"></x-address>
            <sinSelector1 sTitle='一级科目' sPlaceholder='请选择' @on-change="changeFirstSub" :dataList="firstSubList"  :sendData="itemData.firstSub" :selectedItem.sync="itemData.firstSub"></sinSelector1>
            <sinSelector2 sTitle='二级科目' sPlaceholder='请选择' @on-change="changeSecondSub" :dataList="subjectList2" v-if="subjectList2.length != 0" :sendData="itemData.secondSub" :selectedItem.sync="itemData.secondSub"></sinSelector2>
            
            <div v-if="showUploadImg" v-for="(val,index) in itemData.subConfList" :key="index">
                <cell title="上传图片" value-align="left" align-items="flex-start">
                    <x-button type="primary" :mini="true" @click.native="imgUpload(index)">上传{{val.confDesc}}</x-button>
                </cell>
                <div v-if="val.url != ''" class="upload-list">
                    <img @click="showImgFn(val.urlPrefix + val.url)" :src="val.urlPrefix + val.url" alt="">
                    <a href="javascript:;" class="img-del" @click.stop="delImg(index)">x</a>
                </div>
            </div>
            <x-input v-model.number="itemData.personNum" title="人数" placeholder="请填写人数" type="number"> </x-input>
            <x-input v-model.number="itemData.dayNum" title="天数" placeholder="请填写天数" type="number"> </x-input>
            <x-input v-if="showBillNum" v-model.number="itemData.billNum" title="票据数量" placeholder="请填写票据数量" type="number"> </x-input>
            <x-input v-model.number="itemData.expenseAmt" title="报销金额" placeholder="请填写报销金额" type="number"> </x-input>
            <x-textarea v-model="itemData.remarks" title="备注" placeholder="请输入备注" :show-counter="false" :rows="2"></x-textarea>
        </group>
        <div v-transfer-dom>
            <confirm v-model="showDelDialog" title="删除报销表单" @on-cancel="showDelDialog = false" @on-confirm="delItem">
                <p style="text-align:center;">{{ ('确定是删除该项报销明细?') }}</p>
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
    PopupPicker,
    XAddress,
    XInput,
    Cell,
    Box,
    Confirm,
    Datetime,
    Selector,
    XButton,
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
        itemData: Object,
        showBillNum: Boolean, //显示票据数量
        showUploadImg: Boolean //上传图片
    },
    components: {
        Group,
        PopupPicker,
        XInput,
        Cell,
        Box,
        XButton,
        Confirm,
        Datetime,
        Selector,
        XTextarea,
        XAddress,
        sinSelector1: sinSelector,
        sinSelector2: sinSelector,
    },
    data: function() {
        return {
            showDelDialog: false,
            valueMap: ["value", "name"],
            subjectList2: [],
            addresStartText: "",
            addresEndText: "",
            // showUpload: false,
            uploadFlag: false,
            orignSecondSub: this.itemData.secondSub,
            orignSubconfList: JSON.parse(JSON.stringify(this.itemData.subConfList||[]))
        };
    },
    created() {
        //this.getSubjects("subjectList1", "1", "");
        //@on-change="getSubjects('subjectList2','0',itemData.firstSub)"
        console.log("created-created-createdcreated-created")
        var _this = this;
        try {
            // 兼容处理
            if (this.subslistKeyVal[this.itemData.firstSub].children) {
                var tempArr = this.subslistKeyVal[this.itemData.firstSub].children;
                tempArr.forEach(function(item,idx){
                    _this.subjectList2.push({
                        ...item,
                        key: item.value,
                        value: item.name,
                    });
                })
                // this.subjectList2 = [
                //     ...tempArr,
                //     key: item.value,
                //     value: item.name,
                // ]
            } else {
                this.subjectList2 = [];
            }
        } catch (err) {
            this.subjectList2 = [];
        }
        if (this.$route.params.id == 0) {
            this.uploadFlag = true;
        }
    },
    mounted(){

    },
    computed: {
        ...mapState({
            subsList: state => state.subsList,
            addressData: state => state.addressData,
            subslistKeyVal: state => state.subsListKeyVal
        }),
        ...mapGetters(["firstSubList"])
    },
    watch: {
        "itemData.personNum": function(newVal, oldVal) {
            console.log("itemData.personNum")
        },
        "itemData.firstSub": function(newVal, oldVal) {
            return
            console.log('itemData.firstSub')
            var tempArr = [],
                _this = this;
            this.itemData.secondSub = "";
            this.subsList.forEach(function(item, index) {
                if (item.parent == _this.itemData.firstSub) {
                    tempArr.push({
                        ...item,
                        key: item.value,
                        value: item.name,
                    });
                }
            });
            this.subjectList2 = tempArr;
            // this.showUpload = false
            this.itemData.secondSub = "";
            // this.itemData.subConfList = [];
            this.itemData.subConfList = [];
            console.log("watch-------------");
        },
        "itemData.secondSub": function(newVal, oldVal) {
            
        }
    },
    mounted() {
        // this.changeSubjectList2()
    },
    methods: {
        changeFirstSub() {
            console.log("changeFirstSub------------")
             var tempArr = [],
                _this = this;
            this.itemData.secondSub = "";
            this.subsList.forEach(function(item, index) {
                if (item.parent == _this.itemData.firstSub) {
                    tempArr.push({
                        ...item,
                        key: item.value,
                        value: item.name,
                    });
                }
            });
            console.log(tempArr)
            this.subjectList2 = tempArr;
            // this.showUpload = false
            this.itemData.secondSub = "";
            // this.itemData.subConfList = [];
            this.itemData.subConfList = [];
            console.log("watch-------------");
        },
        changeSecondSub() {
            this.changeSubjectList2(newVal)
        },
        delItem() {
            console.log(this.subjectList2)
            this.$store.dispatch("delItemDatas", this.index);
        },
        changeSubjectList2(val) {
            console.log("控件传入值：",val);
            console.log("组件itemData原始值：",this.orignSecondSub);
            var _this=this;
            if (!_this.showUploadImg) return; //如果不现实上传图片，则不push上传图片的数组

            if (val == _this.orignSecondSub) {
                _this.itemData.subConfList=JSON.parse(JSON.stringify(_this.orignSubconfList))//Object.assign([],_this.orignSubconfList);
            } else {
                _this.subsList.forEach((item, index) => {
                    if (_this.itemData.secondSub === true) {
                        return;
                    }
                    if (item.value == _this.itemData.secondSub) {
                        console.warn(item.subConfList);
                        _this.itemData.subConfList = [];
                        if (item.subConfList) {
                            item.subConfList.forEach((el, idx) => {
                                _this.itemData.subConfList.push({
                                    id: el.id,
                                    url: "",
                                    confDesc: el.confDesc, //上传名称
                                    urlPrefix: ""
                                });
                            });
                        }
                    }
                });
            }
        },
        getSubjects(listName, isFirst, parSubCode) {
            com.covertHttp(api.getSubjects, {
                    isFirst: isFirst,
                    parSubCode: parSubCode
                })
                .then(rtn => {
                    if (rtn.status == 0) {
                        this[listName] = rtn.data.list || [];
                    }
                });
        },
        startAddressChange(ids, names) {
            this.addresStartText = names;
        },
        startAddressHide(flag) {
            if (flag) {
                this.itemData.startPointName = this.addresStartText;
            }
        },
        endAddressChange(ids, names) {
            this.addresEndText = names;
        },
        endAddressHide(flag) {
            if (flag) {
                this.itemData.endPointName = this.addresEndText;
            }
        },
        imgUpload(idx) {
            // 图片上传
            var _this = this;
            sdk.ability.chooseImage({
                success: function(rtn) {
                    // var arr = JSON.parse(JSON.stringify(_this.itemData.subConfList));
                    // arr[idx].urlPrefix = rtn.data.pre; //图片url前缀
                    // arr[idx].url = rtn.data.remoteFilePaths[0];
                    // _this.itemData.subConfList = arr;

                    _this.itemData.subConfList[idx].urlPrefix = rtn.data.pre; //图片url前缀
                    _this.itemData.subConfList[idx].url = rtn.data.remoteFilePaths[0];
                    console.log("上传图片成功,前缀"+ rtn.data.pre)
                    console.log("上传图片成功,后缀"+ rtn.data.remoteFilePaths[0])
                    console.log(_this.itemData.subConfList)
                    console.log("itemdata"+_this.itemData.subConfList[idx].url )
                },
                fail(data) {
                    console.log("getdatafail", data);
                }
            });
        },
        delImg(idx) {
            // 图片删除
            this.itemData.subConfList[idx].urlPrefix = ""; //图片url前缀
            this.itemData.subConfList[idx].url = "";
        },
        showImgFn(url) {
            sdk.components.previewImage({
                // 图片预览
                url: url,
                success: function(data) {
                    console.log(data);
                },
                fail(data) {
                    console.log(data);
                }
            });
        },
        componentsValid() { // 所有组件校验
            var flag = true, _this = this;
                if (_this.itemData.startPoint.length == 0 || _this.itemData.startPoint[0] == "") {
                    _this.$vux.toast.text("起点填写有误");
                    flag = false;
                    return;
                }
                if (_this.itemData.endPoint.length == 0 || _this.itemData.endPoint[0] == "") {
                    _this.$vux.toast.text("终点填写有误");
                    flag = false;
                    return;
                }
                /*
                if (item.endPoint.trim() == item.startPoint.trim()) {
                    _this.$vux.toast.text("起点和终点不能相同");
                    flag = false;
                    return;
                }
                */
                if (_this.itemData.firstSub == "") {
                    _this.$vux.toast.text("请选择一级科目");
                    flag = false;
                    return;
                }
                if(!/^[0-9]{4,6}$/.test(_this.itemData.secondSub)  && _this.subslistKeyVal[_this.itemData.firstSub].children && _this.subslistKeyVal[_this.itemData.firstSub].children.length > 0) {
                    _this.$vux.toast.text("请选择二级科目");
                    flag = false;
                    return;
                }
                //校验上传图片
                if(this.showUploadImg){
                    if( _this.subslistKeyVal[_this.itemData.firstSub].children && _this.subslistKeyVal[_this.itemData.secondSub].subConfList&&_this.subslistKeyVal[_this.itemData.secondSub].subConfList.length > 0){
                        _this.itemData.subConfList.forEach((itm,idx)=>{
                            if(itm.url == ''){
                                _this.$vux.toast.text("请上传"+itm.confDesc);
                                flag = false;
                                return;
                            }
                        })
                    }
                }
                if (!/(^[0-9]\d*$)/.test(_this.itemData.dayNum) || _this.itemData.dayNum == 0) {
                    _this.$vux.toast.text("天数填写有误");
                    flag = false;
                    return;
                }
                if (!/(^[0-9]\d*$)/.test(_this.itemData.personNum) || _this.itemData.personNum == 0) {
                    _this.$vux.toast.text("人数填写有误");
                    flag = false;
                    return;
                }
                if(_this.showBillNum){
                    // if (!/(^[0-9]\d*$)/.test(_this.itemData.billNum)) {
                    //     _this.$vux.toast.text("票据数量填写有误");
                    //     flag = false;
                    //     return;
                    // }
                }
                if (!/^[0-9]+(.[0-9]{1,2})?$/.test(_this.itemData.expenseAmt) || _this.itemData.expenseAmt == 0) {
                    _this.$vux.toast.text("报销金额填写有误");
                    flag = false;
                    return;
                }
                if (_this.itemData.startDate == "" || _this.itemData.endDate == "") {
                    _this.$vux.toast.text("请选择发生日期或结束日期");
                    flag = false;
                    return;
                }
                if (new Date(_this.itemData.startDate) > new Date(_this.itemData.endDate)) {
                    _this.$vux.toast.text("结束日期不能早于发生日期");
                    flag = false;
                    return;
                }
            return flag;
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

