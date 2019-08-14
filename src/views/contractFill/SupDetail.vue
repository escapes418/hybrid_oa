<template>
  <div v-if="isReady" class="contract_detail">
    <group title="基本信息">
      <cell-box>
        <div class="w-100">
          <div class="detail-text">
            <!-- <div class="long-content">
                            <span class="detail-title long-title">流程编号</span>
                            <span class="long-detail font-orange">{{dataArr.detail.procCode}}</span>
                        </div> -->
            <!-- <div class="long-content">
                            <span class="detail-title long-title">申请人</span>
                            <span class="long-detail">{{dataArr.detail.applyPerName}}</span>
                        </div> -->
            <div class="long-content">
              <span class="detail-title long-title">合同编号</span>
              <span class="long-detail font-orange">{{ dataArr.detail.contractCode }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">合同名称</span>
              <span class="long-detail">{{ dataArr.detail.contractName }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">合同归档方式</span>
              <span class="long-detail">{{ dataArr.detail.contractHisMethodName }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">合同类型</span>
              <span class="long-detail">{{ dataArr.detail.contractTypeName }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">合同归档时间</span>
              <span class="long-detail">{{ dataArr.detail.createTime | stamp2TextDateFull }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">主合同编号</span>
              <span class="long-detail">{{ dataArr.detail.associationMainCode }}</span>
            </div>
            <!-- <div class="long-content">
                            <span class="detail-title long-title">关联项目</span>
                            <span class="long-detail">{{projectName}}</span>
                        </div> -->
            <div class="long-content">
              <span class="detail-title long-title">备注</span>
              <span class="long-detail">{{ dataArr.detail.remarks }}</span>
            </div>
          </div>
        </div>
      </cell-box>
    </group>
    <group
      :title="item.partyName"
      v-for="(item, index) in dynamicFormList"
      :key="index"
      label-margin-right="1em"
    >
      <cell-box>
        <div class="w-100">
          <div class="detail-text">
            <div class="long-content" v-for="(el, idx) in item.contractPartyType" :key="idx">
              <span class="detail-title long-title">{{ el.columnLabel }}</span>
              <span class="long-detail">{{ el.value }}</span>
            </div>
          </div>
        </div>
      </cell-box>
    </group>
    <group title="合同情况">
      <cell-box>
        <div class="w-100">
          <div class="detail-text">
            <div class="long-content">
              <span class="detail-title long-title">合同开始时间</span>
              <span class="long-detail">{{
                dataArr.detail.contractStartTime | stamp2TextDate
              }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">合同结束时间</span>
              <span class="long-detail">{{ dataArr.detail.contractEndTime | stamp2TextDate }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">合同签约人</span>
              <span class="long-detail">{{ dataArr.detail.signLeaderName }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">合同负责人</span>
              <span class="long-detail">{{ dataArr.detail.contractLeaderName }}</span>
            </div>
          </div>
        </div>
      </cell-box>
    </group>
    <!-- <group title='快递信息'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">快递公司</span>
                            <span class="long-detail">{{dataArr.detail.expressCompany}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">快递单号</span>
                            <span class="long-detail">{{dataArr.detail.expressBill}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group> -->
    <group
      title="附件"
      label-margin-right="1em"
      v-for="(el, idx) in contractAttachmentList"
      :key="idx + 10"
      v-if="el.upload.length != 0"
    >
      <cell :title="el.attachmentName"></cell>
      <div class="flex_box" v-if="el.upload.length != 0">
        <div class="flex_item" v-for="(val, index) in el.upload" :key="index">
          <div class="imgbox">
            <!-- <img :src="val.urlPrefix + val.url" v-if="val.url" @click="showImgFn(val.urlPrefix + val.url)"> -->
            <img
              :src="val.urlPrefix + val.url"
              v-if="val.url"
              @click="showImgFn(el.upload, index)"
            />
          </div>
        </div>
      </div>
    </group>
    <!-- <group title='附件' label-margin-right="1em">
            <cell is-link  v-for="(el, idx) in dataArr.detail.suppResp" :key="idx" @click.native="clickSupp(el.suppId)">
                <span slot="title" style="color:#409eff;"><span style="vertical-align:middle;">{{el.suppName}}</span><x-icon type="ios-information" size="22" style="fill:#409eff;"></x-icon></span>
            </cell>
        </group> -->
    <!-- <group title="审批流程" v-if="dataArr.detail.expenseStatus != 4">
            <timeline class="font-gray adjustTimeline">
                <timeline-item v-for="(el,index) in dataArr.flowLoglist" :key="index">
                    <div :class="['ml-10',index==dataArr.flowLoglist.length-1?'font-green':'font-g333']">
                        <div>
                            <span>{{el.assigneeName}}</span>
                            <span v-if="index==0">{{el.activityName}}</span>
                            <span v-else>{{el.comment?"已审批":"待审批"}}</span>
                        </div>
                        <div class="state-item">
                            <span class="font-size14">{{el.endTime}}</span>
                            <span v-if="el.durationTime" class="state-name">历时:{{el.durationTime}}</span>
                        </div>
                        <p v-if="el.comment" class="font-gray font-size14 mt-2">{{el.comment}}</p>
                    </div>
                </timeline-item>
            </timeline>
        </group> -->

    <!-- 审批按钮 -->
    <!-- <box gap="10px 10px">
            <template v-if="type === 'myself'&&baseInfo.loginName==dataArr.detail.applyPerCode">
                <flexbox>
                    <flexbox-item v-if="ISEDIT">
                        <x-button type="primary" @click.native="editApply">编辑</x-button>
                    </flexbox-item>
                    <flexbox-item v-if="dataArr.detail.contractFlowStatus == 2&&!ISEDIT">
                        <x-button type="default" @click.native="cancel">撤销</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
            <template v-if="type === 'todo'">
                <flexbox v-if="dataArr.detail.contractFlowStatus == 2">
                    <flexbox-item  v-if="!ISEDIT">
                        <x-button type="warn" @click.native="refuseApply">拒绝</x-button>
                    </flexbox-item>
                    <flexbox-item  v-if="!ISEDIT">
                        <x-button type="primary" @click.native="agreeApply">同意</x-button>
                    </flexbox-item>
                    <flexbox-item v-if="ISEDIT">
                        <x-button type="primary" @click.native="editApply">编辑</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
            <template v-if="type === 'done'">
                <flexbox v-if="dataArr.detail.expenseStatus == 2">
                    <flexbox-item>
                        <x-button type="default" @click.native="cancel">撤销</x-button>
                    </flexbox-item>
                </flexbox>
            </template>
        </box> -->
    <div v-transfer-dom>
      <x-dialog v-model="remarkForm.isRemarks" hide-on-blur>
        <div class="weui-dialog__hd">
          <strong class="weui-dialog__title">审批意见</strong>
        </div>
        <group class="xdialog-group-textarea">
          <x-textarea
            v-model="remarkForm.remarks"
            placeholder="请输入审批意见"
            :max="600"
            :rows="3"
          ></x-textarea>
        </group>
        <div>
          <div class="weui-dialog__ft">
            <a
              href="javascript:;"
              class="weui-dialog__btn weui-dialog__btn_default"
              @click="remarkForm.isRemarks = false"
              >取消</a
            >
            <a
              href="javascript:;"
              class="weui-dialog__btn weui-dialog__btn_primary"
              @click="confirmRemark"
              >确定</a
            >
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import com from '@/assets/js/common';
import api from '@/assets/api/index.api';
import XHR from '@/assets/js/XHR';
import {
  Box,
  Confirm,
  Group,
  XButton,
  CellFormPreview,
  Timeline,
  Popup,
  Selector,
  TimelineItem,
  Cell,
  ConfirmPlugin,
  CellBox,
  XTextarea,
  XInput,
  XDialog,
  Flexbox,
  FlexboxItem,
  TransferDomDirective as TransferDom
} from 'vux';
Vue.use(ConfirmPlugin);
export default {
  name: 'ContractFillDetail',
  directives: {
    TransferDom
  },
  components: {
    Box,
    Confirm,
    Group,
    Selector,
    CellFormPreview,
    XButton,
    Popup,
    Timeline,
    TimelineItem,
    Cell,
    CellBox,
    XTextarea,
    XInput,
    XDialog,
    Flexbox,
    FlexboxItem
  },
  computed: {
    // ISEDIT: function() {
    //     let result = this.dataArr.detail.modify == "modify" ? true : false;
    //     return result;
    // },
  },
  data() {
    return {
      isReady: false,
      type: '',
      remarkForm: {
        isRemarks: false,
        remarks: '',
        flag: 'yes' //yes同意 no拒绝
      },
      projectList: [],
      projectName: '',
      amtList: [],
      receptionistVal: '',
      dataArr: {},
      dynamicFormList: [],
      contractAttachmentList: [],
      dynamicUpload: [],
      upType: 1,
      isUploadFileCount: 0,
      isUploadFileMin: 0,
      baseInfo: {},
      gerAttachmentList: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      var params = this.$route.params;
      com.comGetStorage('userInfo').then(res => {
        this.baseInfo = res;
      });
      com.comGetStorage('queryDictInfo').then(res => {
        res.dict.forEach((item, index) => {
          this.projectList.push({
            ...item,
            value: item.label,
            key: item.value
          });
        });
      });
      if (params.id) {
        if (
          params.type &&
          (params.type === 'todo' || params.type === 'done' || params.type === 'myself')
        ) {
          this.type = params.type;
          com
            .covertHttp(api.contractHisDetail, {
              id: params.id
            })
            .then(rtn => {
              if (rtn.status != 0) {
                // this.$vux.toast.text(rtn.message) || "查询不到当前信息";
                this.$router.push({ path: '/userIndex' });
                return;
              }
              this.dataArr.detail = rtn.data.contractHisDetailResponse;
              this.gerAttachmentList = this.dataArr.detail.contractAttachmentResponse || [];
              this.gerAttachmentList.forEach((item, index) => {
                if (item.fileType == '2') {
                  this.isUploadFileCount++;
                }
              });
              if (this.dataArr.detail.projectIds) {
                var tempArray = [];
                this.projectList.forEach((item, index) => {
                  this.dataArr.detail.projectIds.forEach((el, idx) => {
                    if (item.key == el) {
                      tempArray.push(item.value);
                    }
                  });
                });
                this.projectName = tempArray.join(', ');
              }
              this.dataArr.detail.contractPartyList.forEach((el, idx) => {
                for (let k in el) {
                  if (el[k].indexOf('&') != -1) {
                    el[k] = el[k].split('&')[1];
                  }
                }
              });
              this.getTemplate().then(() => {
                this.assignDynamicForm();
                this.assignUpload();
              });

              this.isReady = true;
            });
        } else {
          console.log('列表type参数异常');
          console.log(params);
          this.$router.push({ path: '/userIndex' });
        }
      } else {
        console.log('参数异常');
        console.log(params);
        this.$router.push({ path: '/userIndex' });
      }
    },
    assignDynamicForm() {
      if (!this.dataArr.detail.contractPartyList) {
        this.$vux.toast.text('甲乙方加载失败');
        return;
      }
      this.dynamicFormList.forEach((element, index) => {
        element.contractPartyType.forEach((el, idx) => {
          this.dataArr.detail.contractPartyList.forEach((e, i) => {
            for (let k in e) {
              if (k == el.columnName) {
                el.value = e[k];
              }
            }
          });
        });
      });
    },
    assignUpload() {
      this.contractAttachmentList.forEach((element, index) => {
        this.gerAttachmentList.forEach((ele, idx) => {
          if (element.attachmentType === ele.fileType) {
            element.upload.push({
              url: ele.contractAttachmentUrl,
              urlPrefix: ele.urlPrefix
            });
          }
        });
      });
    },
    getTemplate() {
      return new Promise((resolve, reject) => {
        com
          .covertHttp(api.queryContractConfig, {
            id: this.dataArr.detail.configId
          })
          .then(rtn => {
            if (!rtn.data.contractPartyList || rtn.data.contractPartyList.length == 0) {
              this.$vux.toast.text('合同模版加载失败');
              return;
            }
            if (
              !rtn.data.contractConfigAttachmentList ||
              rtn.data.contractConfigAttachmentList.length == 0
            ) {
              this.$vux.toast.text('合同模版加载失败');
              return;
            }
            this.dynamicFormList = rtn.data.contractPartyList;
            this.dynamicUpload = rtn.data.contractConfigAttachmentList;

            rtn.data.contractConfigAttachmentList.forEach((element, index) => {
              var attachmentName = '';
              if (element.attachmentType == '1') {
                attachmentName = '预签合同';
              } else if (element.attachmentType == '2') {
                attachmentName = '合同扫描件';
                this.isUploadFileMin = parseInt(element.mustCount);
              } else if (element.attachmentType == '3') {
                attachmentName = '附件资料';
              }
              this.contractAttachmentList.push({
                attachmentName: attachmentName,
                upload: [],
                ...element
              });
            });
            this.delUpItem(); //app限制的原因，不能上传合同扫描件
            resolve();
          });
      });
    },
    delUpItem() {
      this.contractAttachmentList.forEach((item, index) => {
        if (item.attachmentType == '2') {
          this.contractAttachmentList.splice(index, 1);
        }
      });
    },
    refuseApply() {
      // 拒绝
      this.remarkForm.isRemarks = true;
      this.remarkForm.remarks = '';
      this.remarkForm.type = 'no';
    },
    agreeApply() {
      // 同意
      if (this.dataArr.detail.isUploadFile == 1 && this.isUploadFileCount < this.isUploadFileMin) {
        this.$vux.toast.text(
          `缺少${this.isUploadFileMin - this.isUploadFileCount}张合同扫描件，请在电脑端上传`
        );
        return;
      }
      this.remarkForm.isRemarks = true;
      this.remarkForm.remarks = '';
      this.remarkForm.type = 'yes';
    },
    confirmRemark() {
      var _this = this;
      if (this.remarkForm.type === 'no') {
        if (!this.remarkForm.remarks) {
          this.$vux.toast.text('请输入审批意见');
          return;
        }
      }
      com
        .covertHttp(api.contractFlowNewCompleteTask, {
          flag: this.remarkForm.type,
          comment: this.remarkForm.remarks,
          procInsId: this.dataArr.detail.procInsId || '', //同意或拒绝操作 从详情中取实例id
          contractFlowId: this.dataArr.detail.id
        })
        .then(rtn => {
          if (rtn.status == 0) {
            _this.$router.go(-1);
            com.delKeepAlive(_this, [
              'TaskOption',
              'ContractListRecived',
              'ContractListSend',
              'UserIndex'
            ]);
          }
          _this.remarkForm.isRemarks = false;
        });
    },
    editApply() {
      // 编辑
      this.$router.push({
        path: '/contract/apply/' + this.$route.params.id
      });
    },
    del() {
      // 删除
      var _this = this;
      this.$vux.confirm.show({
        // 组件除show外的属性
        title: '确定删除？',
        onCancel() {},
        onConfirm() {
          com
            .covertHttp(api.contractRepealApply, {
              contractFlowId: _this.$route.params.id
            })
            .then(rtn => {
              if (rtn.status == 0) {
                _this.$router.go(-1);
                com.delKeepAlive(_this, [
                  'TaskOption',
                  'ContractListRecived',
                  'ContractListSend',
                  'UserIndex'
                ]);
              }
            });
        }
      });
    },
    cancel() {
      //撤销
      var _this = this;
      this.$vux.confirm.show({
        // 组件除show外的属性
        title: '确定撤销？',
        onCancel() {},
        onConfirm() {
          com
            .covertHttp(api.contractRepealTask, {
              procInsId: _this.dataArr.detail.procInsId,
              taskId: _this.$route.params.taskId
            })
            .then(rtn => {
              if (rtn.status == 0) {
                _this.$router.go(-1);
                com.delKeepAlive(_this, [
                  'TaskOption',
                  'ContractListRecived',
                  'ContractListSend',
                  'UserIndex'
                ]);
              }
            });
        }
      });
    },
    showImgFn(el, index) {
      var url = [];
      el.forEach((item, idx) => {
        url.push(item.urlPrefix + item.url);
      });
      sdk.components.previewImages({
        url: url,
        index: index,
        success: function(data) {},
        fail(data) {}
      });
    }
  }
};
</script>
<style lang="less">
.xdialog-group-textarea {
  .weui-textarea {
    text-align: left !important;
  }
}

.contract_detail {
  .flex_box {
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
  }
  .flex_item {
    padding-top: 10px;
    padding-bottom: 10px;
    width: 25%;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
    }
    div {
      font-size: 14px;
      color: #222;
    }
    .imgbox {
      position: relative;
    }
    .close {
      position: absolute;
      width: 25px;
      height: 25px;
      top: -10px;
      right: -10px;
    }
  }
}
</style>
