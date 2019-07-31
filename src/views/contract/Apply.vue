<template>
  <div class="dynammic">
    <group title="基本信息" label-margin-right="1em">
      <sinSelector
        sTitle="合同名称"
        :isRequired="true"
        sPlaceholder="请选择"
        @on-change="getTemplate"
        :dataList="mainContractList"
        :sendData="applyData.contractNameId"
        :selectedItem.sync="applyData.contractNameId"
        :sLabel="contractLabel"
      ></sinSelector>
      <PageSelector
        v-if="associationMain == 1"
        :isRequired="true"
        sTitle="关联主合同"
        sPlaceholder="请选择"
        @selectedItem="assMainContract"
        :sLabel="applyData.associationMainName"
      ></PageSelector>
      <mulProSelet
        v-if="associationMain != 1"
        sTitle="关联项目"
        :isRequired="true"
        sPlaceholder="请选择"
        :sendData="applyData.projectIds"
        :selectedItem.sync="applyData.projectIds"
      ></mulProSelet>
      <x-textarea
        title="备注"
        v-model.trim="applyData.remarks"
        placeholder="请输入"
        :max="200"
        :rows="3"
      ></x-textarea>
    </group>
    <!-- <div>{{dynamicFormList}}</div> -->
    <group
      :title="item.partyName"
      label-margin-right="1em"
      v-for="(item, index) in dynamicFormList"
      :key="index"
    >
      <DynamicForm
        :item="el"
        ref="dynamic"
        v-for="(el, idx) in item.contractPartyType"
        :key="idx"
        @on-change="changeSele"
      >
      </DynamicForm>
    </group>
    <group title="合同情况" label-margin-right="1em">
      <datetime
        title="合同开始日期"
        placeholder="请选择开始日期"
        format="YYYY-MM-DD"
        v-model="applyData.contractStartTime"
        class="data-time"
      >
        <span slot="title">合同开始日期<span class="required">*</span></span>
      </datetime>
      <datetime
        title="合同结束日期"
        placeholder="请选择结束日期"
        format="YYYY-MM-DD"
        v-model="applyData.contractEndTime"
        class="data-time"
      >
        <span slot="title">合同结束日期<span class="required">*</span></span>
      </datetime>
      <!-- <sinSelector sTitle='合同签约人' :isRequired="true" sPlaceholder='请选择' :dataList="linkmanList" :sendData="applyData.signLeaderId" :selectedItem.sync="applyData.signLeaderId"></sinSelector>
            <sinSelector sTitle='合同负责人' :isRequired="true" sPlaceholder='请选择' :dataList="linkmanList" :sendData="applyData.contractLeaderId" :selectedItem.sync="applyData.contractLeaderId"></sinSelector> -->
      <departTree
        sTitle="合同签约人"
        :isRequired="true"
        :isPeople="true"
        sPlaceholder="请选择"
        :dataList="linkmanList"
        :sendData="applyData.signLeaderId"
        :selectedItem.sync="applyData.signLeaderId"
      ></departTree>
      <departTree
        sTitle="合同负责人"
        :isRequired="true"
        :isPeople="true"
        sPlaceholder="请选择"
        :dataList="resmanList"
        :sendData="applyData.contractLeaderId"
        :selectedItem.sync="applyData.contractLeaderId"
      ></departTree>
    </group>
    <group title="快递信息" label-margin-right="1em">
      <x-input
        title="快递公司"
        placeholder="请输入"
        :max="50"
        v-model.trim="applyData.expressCompany"
      >
        <span slot="label">快递公司<span class="required">*</span></span>
      </x-input>
      <x-input
        title="快递单号"
        placeholder="请输入"
        :max="50"
        type="number"
        v-model.trim="applyData.expressBill"
      >
        <span slot="label">快递单号<span class="required">*</span></span>
      </x-input>
    </group>
    <group
      title="预签合同资料"
      label-margin-right="1em"
      v-for="(el, idx) in contractAttachmentList"
      :key="idx + 10"
    >
      <!-- <div>{{ contractAttachmentList }}</div> -->
      <cell
        :title="el.attachmentName"
        :inline-desc="el.message + '(至少' + el.mustCount + '张、最多' + el.maxCount + '张)'"
      ></cell>
      <div class="flex_box">
        <div class="flex_item" v-for="(val, index) in el.upload" :key="index">
          <div class="imgbox">
            <img
              src="../../assets/img/close.png"
              v-if="val.url"
              class="close"
              @click.stop="delImg(idx, index)"
            />
            <img
              :src="val.urlPrefix + val.url"
              v-if="val.url"
              @click="showImgFn(el.upload, index)"
            />
            <!-- <img
              :src="val.urlPrefix + val.url"
              v-if="val.url"
              @click="showImgFn(val.urlPrefix + val.url)"
            /> -->
            <!-- <img src="../../assets/img/add.png" v-else @click="imgUpload(idx, index)" /> -->
          </div>
        </div>
        <div class="flex_item" v-if="el.maxCount - el.upload.length >= 1">
          <div class="imgbox">
            <img src="../../assets/img/add.png" @click="imgUpload(idx, el.maxCount)" />
          </div>
        </div>
      </div>
    </group>
    <box gap="10px 10px">
      <flexbox>
        <flexbox-item>
          <x-button type="primary" :disabled="disSubmit" @click.native="handleApply">提交</x-button>
        </flexbox-item>
      </flexbox>
    </box>
  </div>
</template>
<script>
import api from '@/assets/api/index.api';
import com from '@/assets/js/common';
import sinSelector from '@/components/sinSelector';
import mulProSelet from '@/components/mulProSelet';
import DynamicForm from '@/components/DynamicForm';
import PageSelector from '@/components/PageSelector';
import departTree from '@/components/departTree.vue';
import XHR from '@/assets/js/XHR';
import Utils from './utils';
import {
  XAddress,
  Box,
  Popup,
  Checklist,
  Search,
  Group,
  Cell,
  XDialog,
  CellBox,
  Icon,
  XButton,
  PopupPicker,
  XInput,
  XTextarea,
  Selector,
  Confirm,
  Calendar,
  Datetime,
  Flexbox,
  FlexboxItem,
  TransferDomDirective as TransferDom
} from 'vux';
export default {
  name: 'ContractApply',
  directives: {
    TransferDom
  },
  components: {
    Box,
    Group,
    Cell,
    CellBox,
    XButton,
    Popup,
    PopupPicker,
    Checklist,
    Datetime,
    Search,
    XInput,
    XTextarea,
    Selector,
    Confirm,
    Icon,
    Calendar,
    Flexbox,
    FlexboxItem,
    XAddress,
    XDialog,
    sinSelector,
    DynamicForm,
    departTree,
    mulProSelet,
    PageSelector
  },

  data: function() {
    return {
      applyData: {
        associationMainId: '',
        associationMainName: '',
        contractNameId: '',
        projectIds: [], //项目名称
        remarks: '', //备注
        contractStartTime: com.timeFormat(new Date().getTime()),
        contractEndTime: com.timeFormat(new Date().getTime() + 86400000),
        signLeaderId: '', //合同签约人
        contractLeaderId: '', //合同负责人
        expressCompany: '', //快递公司
        expressBill: '' //快递单号
      },
      contractLabel: '',
      linkmanList: [],
      resmanList: [],
      mainContractList: [],
      dynamicFormList: [],
      associationMain: '',
      expressCompany: '',
      contractAttachmentList: [],
      upload: [],
      upType: 1,
      disSubmit: false
    };
  },
  computed: {},
  created() {
    this.init();
    this.getMainContract(); //获取主合同
    // this.getLinkmanInfo()
    this.getTreeList();
  },
  methods: {
    init() {
      com.comGetStorage('userInfo').then(res => {
        this.baseInfo = Object.assign({}, this.baseInfo, res);
      });
      if (this.$route.params.id != 0) {
        this.getDetail().then(rtn => {
          //1. 加载详情
          var getD = rtn.contractFlowDetailInfoNewResponse;
          this.applyData = {
            contractNameId: getD.configId,
            projectIds: getD.projectIds, //项目名称
            remarks: getD.remarks, //备注
            contractStartTime: com.timeFormat(getD.contractStartTime),
            contractEndTime: com.timeFormat(getD.contractEndTime),
            signLeaderId: getD.signLeaderId, //合同签约人
            contractLeaderId: getD.contractLeaderId, //合同负责人
            expressCompany: getD.expressCompany, //快递公司
            expressBill: getD.expressBill, //快递单号
            id: getD.id,
            procInsId: getD.procInsId,
            procCode: getD.procCode,
            associationMainId: getD.associationMainId,
            associationMainName: getD.associationMainName
          };
          this.contractLabel = getD.contractName;
          if (!getD.contractPartyList) console.log('无甲乙方(contractFlowDetail)');
          if (!getD.contractAttachmentList) console.log('无附件(contractFlowDetail)');
          this.getTemplate().then(() => {
            //2. 获取表单配置信息
            this.assignDynamic(getD); //3. 动态表单赋值
            this.assignUpload(getD); //4. 附件赋值
          });
        });
      }
    },
    assignDynamic(getD) {
      this.dynamicFormList.forEach((item, index) => {
        item.contractPartyType.forEach((it, idx) => {
          getD.contractPartyList.forEach((el, i) => {
            for (let key in el) {
              if (key == it.columnName) {
                it.value = el[key];
                it.dLabel = el.value;
              }
            }
          });
        });
      });
    },
    assignUpload(getD) {
      var upIndex = 0;
      getD.contractAttachmentList.forEach((element, index) => {
        for (let idx in this.contractAttachmentList) {
          if (
            element.fileType == this.upType &&
            this.contractAttachmentList[idx].attachmentType == this.upType
          ) {
            this.contractAttachmentList[idx].upload[upIndex].url = element.contractAttachmentUrl;
            this.contractAttachmentList[idx].upload[upIndex].urlPrefix = element.urlPrefix;
            upIndex++;
          }
        }
      });
      this.upType++;
      if (this.upType <= 3) this.assignUpload(getD);
    },
    getDetail() {
      return new Promise((resolve, reject) => {
        com
          .covertHttp(api.contractFlowDetail, {
            contractFlowId: this.$route.params.id
          })
          .then(rtn => {
            resolve(rtn.data);
          });
      });
    },
    getMainContract() {
      com.covertHttp(api.queryContractTempletList, {}).then(rtn => {
        rtn.data.forEach((item, index) => {
          this.mainContractList.push({
            ...item,
            value: item.contractName,
            key: item.id
          });
        });
      });
    },
    getLinkmanInfo() {
      com.covertHttp(api.escortEmployee).then(rtn => {
        rtn.data.forEach((item, index) => {
          this.linkmanList.push({
            ...item,
            value: item.name,
            key: item.id
          });
        });
      });
    },
    getTreeList() {
      com.covertHttp(api.orgAndUserInfo, { queryType: '2' }).then(rtn => {
        var list = com.addTreePeopel(rtn.data);
        var peopelList = com.hasChildren(list);
        this.linkmanList = com.clone(peopelList);
        this.resmanList = com.clone(peopelList);
      });
    },
    getSeleList(url, type) {
      return new Promise((resolve, reject) => {
        com
          .covertHttp(api.baseApi + '/' + url, {
            memberType: type
          })
          .then(rtn => {
            resolve(rtn.data);
          });
      });
    },
    assMainContract(data) {
      this.applyData.associationMainId = data.id;
      this.applyData.associationMainName = data.contractName;
    },
    getTemplate() {
      return new Promise((resolve, reject) => {
        if (this.applyData.contractNameId == '') return;
        var _this = this;
        com
          .covertHttp(api.queryContractConfig, {
            id: this.applyData.contractNameId
          })
          .then(rtn => {
            this.associationMain = rtn.data.associationMain; //是否显示关联主合同
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
            this.dynamicFormList.forEach((element, index) => {
              element.contractPartyType.forEach((el, idx) => {
                _this.$set(el, 'dLabel', '');
                if (el.columnType == 'select') {
                  _this.$set(el, 'DataList', []); //数据层级太深，需要将响应属性添加到嵌套的对象上
                  if (el.url != '') {
                    _this.getSeleList(el.url, el.memberType).then(rtn => {
                      //获取select的选项
                      el.DataList = rtn;
                    });
                  }
                } else if (el.columnType == 'select-cust') {
                  _this.$set(el, 'rOption', {});
                  if (el.url != '') {
                    el.rOption = {
                      api: api.baseApi + '/' + el.url,
                      params: {
                        memberType: el.memberType
                      },
                      search: 'memberName',
                      key: 'key',
                      value: 'value'
                    };
                  }
                }
              });
            });
            this.contractAttachmentList = [];
            rtn.data.contractConfigAttachmentList.forEach((element, idx) => {
              var attachmentName = '';
              var upload = [];
              // for (let i = 0; i < parseInt(element.maxCount); i++) {
              //   //上传图片信息
              //   upload.push({
              //     urlPrefix: 'https://wyyt-test.oss-cn-huhehaote.aliyuncs.com',
              //     url: '/wyyt-image/2018/10/23/5603967938455541178.jpg'
              //     // urlPrefix: '',
              //     // url: ''
              //   });
              // }

              if (element.attachmentType == '1') {
                //合同标题
                attachmentName = '预签合同';
              } else if (element.attachmentType == '2') {
                attachmentName = '合同扫描件';
              } else if (element.attachmentType == '3') {
                attachmentName = '附件资料';
              }
              this.contractAttachmentList.push({
                attachmentName: attachmentName,
                upload: upload,
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
    changeSele(el) {
      this.dynamicFormList.forEach((item, index) => {
        item.contractPartyType.forEach((it, idx) => {
          for (let key in el) {
            if (key == it.columnName) {
              it.value = el[key];
            }
          }
        });
      });
    },
    handleApply() {
      var _this = this;
      if (!Utils.valid(this)) return; //校验
      this.disSubmit = true;
      var params = {};
      var fields = this.dynamicFormList;
      for (let idx in fields) {
        for (let i in fields[idx].contractPartyType) {
          params[fields[idx].contractPartyType[i].columnName] =
            fields[idx].contractPartyType[i].value;
        }
      }
      var attach = com.clone(this.contractAttachmentList);
      var uploadArr = [];
      attach.forEach((element, index) => {
        //去掉数组中没有上传的图片的内容//去掉没有上传图片的
        var uploadArr = element.upload.filter((el, idx) => {
          if (el.url) return true;
        });
        element.upload = uploadArr;
      });
      params.contractAttachmentList = [];
      attach.forEach((item, index) => {
        item.upload.forEach((itm, idx) => {
          params.contractAttachmentList.push({
            contractAttachmentUrl: itm.url,
            fileType: item.attachmentType
          });
        });
      });
      this.$vux.confirm.show({
        title: '是否提交',
        content: '确定执行操作？',
        onCancel() {
          _this.disSubmit = false;
        },
        onConfirm() {
          _this.goApply(params);
        }
      });
    },
    goApply(params) {
      var _this = this;
      com
        .covertHttp(api.contractApplyNew, {
          ...params,
          ...this.applyData,
          contractStartTime: com.timeParse(this.applyData.contractStartTime),
          contractEndTime: com.timeParse(this.applyData.contractEndTime)
        })
        .then(rtn => {
          if (rtn.status == 0) {
            com.delKeepAlive(_this, [
              'TaskOption',
              'ContractListRecived',
              'ContractListSend',
              'UserIndex'
            ]);
            this.$router.push({ path: '/userIndex' });
            this.$vux.toast.text(rtn.message || '保存状态成功!');
          }
          this.disSubmit = false;
        });
    },
    imgUpload(idx, maxCount) {
      var _this = this;
      var maxNum = maxCount - this.contractAttachmentList[idx].upload.length;
      console.log(maxNum, this.contractAttachmentList);
      console.log(sdk.ability.uploadImages);
      sdk.ability.uploadImages({
        // params: {
        maxNum: maxNum,
        // },
        success: function(rtn) {
          console.log(rtn, 'imgUploadsuccess');
          // _this.contractAttachmentList[idx].upload[index].urlPrefix = rtn.data.pre;
          // _this.contractAttachmentList[idx].upload[index].url = rtn.data.remoteFilePaths[0];
          rtn.data.remoteFilePaths.forEach((item, i) => {
            _this.contractAttachmentList[idx].upload.push({
              urlPrefix: rtn.data.pre,
              url: item
            });
          });
        },
        fail(data) {
          console.log('imgUploadfail', data);
        }
      });
    },
    delImg(idx, index) {
      // 图片删除
      // this.contractAttachmentList[idx].upload[index].urlPrefix = '';
      // this.contractAttachmentList[idx].upload[index].url = '';
      this.contractAttachmentList[idx].upload.splice(index, 1);
    },
    showImgFn(el, index) {
      // console.log(el, index);
      var url = [];
      el.forEach((item, idx) => {
        url.push(item.urlPrefix + item.url);
      });
      console.log(url, index);
      sdk.components.previewImages({
        // 图片预览
        // url: url,
        // params: {
        url: url,
        index: index,
        // },
        success: function(data) {
          console.log(data, 'showImgFnsuccess');
        },
        fail(data) {
          console.log(data);
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.fixbtn {
  width: 100%;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 10px;
  box-sizing: border-box;
  z-index: 999;
  background: #f0f0f2;
}

.dynammic {
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

