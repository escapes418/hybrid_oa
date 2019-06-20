<template>
    <div>
        <group title='工作内务管理' label-width="6em" label-margin-right="1em" label-align="justify">
            <x-input title="申请人" :value="123" :readonly='true'></x-input>
            <datetime format="YYYY-MM-DD" :readonly='true' v-model="approvalForm.applyTime" class="data-time" title="年月日" placeholder="请选择日期"></datetime>
            <cell title="上班签到" value-align="left" align-items="flex-start">
            </cell>
            <ul class="upload-list">
                <li v-for="(val,index) in approvalForm.expenseAttachmentSign" @click="showImgFn(approvalForm.expenseAttachmentPrefix+val)" :key="index">
                    <img :src="approvalForm.expenseAttachmentPrefix + val" alt="">
                </li>
            </ul>
            <cell title="工作桌面" value-align="left" align-items="flex-start">   
            </cell>
            <ul class="upload-list">
                <li v-for="(val,index) in approvalForm.expenseAttachmentDesktop" @click="showImgFn(approvalForm.expenseAttachmentPrefix+val)" :key="index">
                    <img :src="approvalForm.expenseAttachmentPrefix + val" alt="">
                </li>
            </ul>
            <cell title="内务环境" value-align="left" align-items="flex-start">
            </cell>
            <ul class="upload-list">
                <li v-for="(val,index) in approvalForm.expenseAttachmentEnvironment" @click="showImgFn(approvalForm.expenseAttachmentPrefix+val)" :key="index">
                    <img :src="approvalForm.expenseAttachmentPrefix + val" alt="">
                </li>
            </ul>
            <cell title="评分">
                <rater :disabled="!isReadonly" v-model="raterData" :margin="12" :max="5"></rater>
            </cell>
        </group>
        <box gap="10px 10px">
            <!-- 项目主管审批 -->
            <flexbox>
                <flexbox-item>
                    <x-button type="primary" @click.native="agreeApply">提交</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button type="default" @click.native="cancel">取消</x-button>
                </flexbox-item>
            </flexbox>
        </box>
    </div>
</template>
<script>
import Vue from 'vue'
import axios from '@/assets/api/axios'
import {mapState} from 'vuex'
import api from '@/assets/api/index.api'
import com from '@/assets/js/common'

import { Tab, TabItem, Group, Cell, CellBox, Icon, XInput, Datetime,XButton,Popup,Box,Flexbox,XTextarea,Rater,Checklist,FlexboxItem, TransferDomDirective as TransferDom} from 'vux';


export default {
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
        XInput,
        Datetime,
        XButton,
        Flexbox,
        FlexboxItem,
        XTextarea,
        Popup,
        Rater,
        Box,
        Checklist, 
    },
    data() {
        return {
            isReadonly: false,
            groupLeaderlist: [],
            preExpenseAmt: 0,
            preBillNum: 0,
            approvalForm: {
                applyTime: com.timeFormat(new Date().getTime()), // 申请时间

                expenseAttachmentPrefix:"http://120.31.131.193:8121/vfs", // 图片前缀(此字段仅前端使用，提交时后端不保存)
                expenseAttachmentSign:["/54/105/6ffb4ad0029be35b6c52d9fe97c5601a.jpg","/54/105/6ffb4ad0029be35b6c52d9fe97c5601a.jpg","/54/105/6ffb4ad0029be35b6c52d9fe97c5601a.jpg"], // 图片数组               
                expenseAttachmentDesktop:["/54/108/cf2704b66f4ebb5f57ce22b7368c305c.jpg"], // 图片数组
                expenseAttachmentEnvironment:["/54/95/e862eac937b422d81c175816611f572d.jpg"], // 图片数组
            },
            raterData: "5",
        }
    },
    computed: {
        ...mapState({
            baseInfo: state => state.baseInfo,
        }),
    },
    created() {
    },
    methods: {
        checkListChange(value, label) {
            console.log('change', value, label)
        },
        imgUpload(type) { // 图片上传
            var _this = this;
            this.valid(type);
            sdk.ability.chooseImage({
                success:function(rtn) {
                    _this.approvalForm.expenseAttachmentPrefix = rtn.data.pre;
                    if(type == "sign") {                       
                        _this.approvalForm.expenseAttachmentSign.push(...rtn.data.remoteFilePaths);
                    } else if(type == "desktop") {
                        _this.approvalForm.expenseAttachmentDesktop.push(...rtn.data.remoteFilePaths);
                    } else if(type == "environment") {
                        _this.approvalForm.expenseAttachmentEnvironment.push(...rtn.data.remoteFilePaths);
                    }           
                },
                fail(data) {
                    console.log('getdatafail',data)
                }
            })
        },
        valid(type) {
            if(type == "sign") {
                return this.approvalForm.expenseAttachmentSign.length >= 1 ? false : "" ;
            } else if(type == "desktop") {
                return this.approvalForm.expenseAttachmentDesktop.length >= 1 ? false : "" ;
            } else if(type == "environment") {
                return this.approvalForm.expenseAttachmentEnvironment.length >= 1 ? false : "" ;
            }
        },
        delImg(index,type) { // 图片删除
            if(type == "sign") {
                this.approvalForm.expenseAttachmentSign.splice(index,1);
            } else if(type == "desktop") {
                this.approvalForm.expenseAttachmentDesktop.splice(index,1);
            } else if(type == "environment") {
                this.approvalForm.expenseAttachmentEnvironment.splice(index,1);
            }
        },
        showImgFn(url) {
            sdk.components.previewImage({ // 图片预览
                url: url,
                success:function(data) {
                    console.log(data);
                },
                fail(data) {
                    console.log(data)
                }
            })
        },
        agreeApply() {
            api.save({ ...this.approvalForm }).then((rtn) => {
                if (rtn.status == 0) {
                    this.$router.go(-1);
                } else {
                    // this.$vux.toast.text(rtn.message || '服务器异常');
                    return;
                }
            })
        },
        refuseApply() {
            api.resave({ ...this.approvalForm }).then((rtn) => {
                if (rtn.status == 0) {
                    this.$router.go(-1);
                } else {
                    // this.$vux.toast.text(rtn.message || '服务器异常');
                    return;
                }
            })
        },
        cancel() {
            this.$router.go(-1);
        },
    },
}
</script>
<style lang="less">
@import "../../assets/css/common/reset.fix.less";
@import "../../assets/css/common/base.less";
@import "../../assets/css/index.less";
</style>
<style scoped lang="less">
.btnWrap {
  display: flex;
  div {
    flex: 1;
    margin: 0 4px;
  }
}

.dialog-demo {
  .weui-dialog{
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    height: 360px;
    width:100%;
    overflow: hidden;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
.upload-list {
    display: inline-block;
    padding: 0 15px 10px;
}
.upload-list li {
    display: inline-block;
    width: 80px;
    height: 80px;
    margin: 5px 5px;
    position: relative;
}
.upload-list li img {
    width: 100%;
    height: 100%;
}
.img-del {
    position: absolute;
    width:16px;
    height: 16px;
    right: -6px;
    top: -8px;
    background: #f00;
    color: #fff;
    line-height: 16px;
    text-align: center;
    border-radius: 50%;
}
.xdialog-group-textarea{
    .weui-textarea{
        text-align:left !important;
    }
}
</style>
