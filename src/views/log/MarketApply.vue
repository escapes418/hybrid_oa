<template>
  <div v-if="isReady">
    <group title="基本信息" label-margin-right="1em">
      <x-input title="当日电话拜访" v-model="applyData.custPhotoCount" readonly></x-input>
      <x-input title="当日上门拜访" v-model="applyData.custVisitCount" readonly></x-input>
      <x-input
        title="当日意向数量"
        placeholder="请输入"
        type="number"
        v-model.trim="applyData.custIntentionCount"
      >
        <span slot="label">当日意向数量<span class="required">*</span></span>
      </x-input>
      <x-input
        title="当日签约数量"
        :max="50"
        placeholder="请输入"
        type="number"
        v-model.trim="applyData.custSignCount"
      >
        <span slot="label">当日签约数量<span class="required">*</span></span>
      </x-input>
      <x-input
        title="明日拜访数量"
        :max="50"
        placeholder="请输入"
        type="number"
        v-model.trim="applyData.afterVisitCount"
      >
        <span slot="label">明日拜访数量<span class="required">*</span></span>
      </x-input>
      <x-textarea
        title="明日工作计划"
        placeholder="请输入"
        :autosize="true"
        v-model.trim="applyData.afterDailyPlan"
        :max="1000"
      >
        <span slot="label" style="padding-right:10px;"
          >明日工作计划<span class="required">*</span></span
        >
      </x-textarea>
      <x-textarea
        title="备注"
        :autosize="true"
        v-model.trim="applyData.remarks"
        :max="1000"
      ></x-textarea>
    </group>

    <group
      title="客户情况"
      label-margin-right="1em"
      v-for="(item, index) in applyData.dailyCustMaintenanceList"
      :key="index"
    >
      <box gap="10px 15px">
        <div style="height:26px">
          <span class="fr font-orange" @click="delItem(index)">删除</span>
        </div>
      </box>
      <RemoteSearch
        sTitle="客户名称"
        :isRequired="true"
        :sLabel="item.custLabel"
        :itemIndex="index"
        sPlaceholder="请选择"
        @on-change="changeCust"
        :rOption="custOption"
        :sendData="item.custId"
        :selectedItem.sync="item.custId"
      ></RemoteSearch>
      <x-input title="拜访类型" v-model="item.visitTypeName" readonly></x-input>
      <x-input title="维护时间" v-model="item.custMaintenanceDateTime" readonly></x-input>
      <x-textarea
        title="维护内容"
        :autosize="true"
        v-model="item.custMaintenanceContent"
        readonly
      ></x-textarea>
    </group>
    <div class="add-btn">
      <span class="pointer" @click="addItem">新增客户情况</span>
    </div>
    <group title="发送对象" label-margin-right="1em" style="margin-bottom:62px">
      <!-- <mulSelectors
        sTitle="发给谁"
        :max="0"
        :isRequired="true"
        sPlaceholder="请选择"
        :dataList="sendPeopelList"
        :sendData="sendToList"
        :selectedItem.sync="sendToList"
      ></mulSelectors>
      <mulSelectors
        sTitle="抄送对象"
        :max="0"
        sPlaceholder="请选择"
        :dataList="copyToPeoList"
        :sendData="copyToList"
        :selectedItem.sync="copyToList"
      ></mulSelectors> -->
      <multree
        sTitle="发给谁"
        :isRequired="true"
        :isPeople="true"
        sPlaceholder="请选择"
        :dataList="sendPeopelList"
        :sendData="sendToList"
        :selectedItem.sync="sendToList"
      ></multree>
      <multree
        sTitle="抄送对象"
        :isPeople="true"
        sPlaceholder="请选择"
        :dataList="copyToPeoList"
        :sendData="copyToList"
        :selectedItem.sync="copyToList"
      ></multree>
    </group>
    <box class="fixbtn">
      <flexbox>
        <flexbox-item>
          <x-button type="primary" :disabled="isSubmit" @click.native="submit">提交</x-button>
        </flexbox-item>
      </flexbox>
    </box>
  </div>
</template>
<script>
import Vue from 'vue';
import com from '@/assets/js/common';
import sinSelector from '@/components/sinSelector';
import mulSelectors from '@/components/mulSelectors';
import RemoteSearch from '@/components/RemoteSearch.vue';
import multree from '@/components/multree.vue';
import api from '@/assets/api/index.api';
import Utils from './utils';
import {
  Tab,
  TabItem,
  Group,
  Cell,
  CellBox,
  Icon,
  XInput,
  Selector,
  XAddress,
  Datetime,
  XButton,
  Popup,
  Box,
  Flexbox,
  XTextarea,
  Checklist,
  Confirm,
  FlexboxItem,
  TransferDomDirective as TransferDom
} from 'vux';
import { resolve } from 'path';

export default {
  name: 'LogMarketApply',
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
    multree,
    Checklist,
    sinSelector,
    mulSelectors,
    RemoteSearch
  },
  data() {
    return {
      isReady: false,
      applyData: {
        afterDailyPlan: '', //明日计划
        afterVisitCount: undefined, //明日拜访客户数量
        custIntentionCount: undefined, //当日意向客户数量
        custPhotoCount: 0, //当日电话拜访数量
        custSignCount: undefined, //当日签约数量
        custVisitCount: 0, //当日上门拜访数量
        remarks: '',
        dailyCustMaintenanceList: [
          {
            custId: '', //客户id ,
            custMaintenanceContent: '', //维护内容
            custMaintenanceDate: '', //维护时间
            custMaintenanceDateTime: '',
            custName: '', //客户name
            visitType: '', //拜访类型
            visitTypeName: '',
            custLabel: ''
          }
        ],
        sendToList: [],
        copyToList: [] //抄送给谁
      },
      custOption: {
        api: api.queryDailyCustMaintenance,
        params: {},
        search: 'custName',
        key: 'custId',
        value: 'custName'
      },
      sendToList: [],
      saveTimer: false,
      sendPeopelList: [],
      custMaintenanceList: [],
      copyToList: [], //抄送给谁
      copyToPeoList: [],
      isSubmit: false
    };
  },
  computed: {},
  created() {
    this.init();
  },
  beforeDestroy() {
    clearInterval(this.saveTimer);
  },
  methods: {
    init() {
      this.initAutoSave();
      // this.getCustMaintenance();
      // this.getSendPeopelList();
      this.getTreeList();
      this.getSend();
    },
    initAutoSave() {
      var _this = this;
      this.getAutoSaveTime().then(getData => {
        com.comGetStorage('autoSave').then(rtn => {
          if (rtn.LogMarketApply !== undefined) _this.applyData = rtn.LogMarketApply; //给表单赋值
          _this.isReady = true;
          _this.saveTimer = setInterval(() => {
            rtn.LogMarketApply = _this.applyData;
            com.comSetStorage('autoSave', rtn);
          }, 10000);
        });
      });
    },
    getAutoSaveTime() {
      return new Promise((resolve, reject) => {
        com.comGetStorage('queryDict').then(data => {
          var getData = data.dict;
          let temp = 10000;
          for (var i = 0; i < getData.length; i++) {
            if (getData[i].type == 'auto_save') {
              temp = parseInt(getData[i].value);
              break;
            }
          }
          if (typeof temp == 'number') {
            resolve(temp);
          } else {
            resolve(10000);
          }
        });
      });
    },
    getTreeList() {
      com.covertHttp(api.orgAndUserInfo, { queryType: '2' }).then(rtn => {
        var list = com.addTreePeopel(rtn.data);
        var peopelList = com.hasChildren(list);
        this.copyToPeoList = com.clone(peopelList);
        this.sendPeopelList = com.clone(peopelList);
      });
    },
    getSend() {
      com
        .covertHttp(api.querySendToByUserId, {
          dailyTemplate: 1
        })
        .then(rtn => {
          var s = rtn.data.sendTo || [];
          var c = rtn.data.copyTo || [];
          s.forEach((item, index) => {
            this.sendToList.push(item.sendToId);
          });
          c.forEach((item, index) => {
            this.copyToList.push(item.copyToId);
          });
        });
    },
    getSendPeopelList() {
      com.covertHttp(api.escortEmployee).then(rtn => {
        rtn.data.forEach((item, index) => {
          this.sendPeopelList.push({
            ...item,
            value: item.name,
            key: item.id
          });
          this.copyToPeoList.push({
            ...item,
            value: item.name,
            key: item.id
          });
        });
      });
    },
    // getCustMaintenance() {
    //     com.covertHttp(api.queryDailyCustMaintenance).then(rtn => {
    //         rtn.data&&rtn.data.forEach((item, index)=>{
    //             this.custMaintenanceList.push({
    //                 ...item,
    //                 value: item.custName,
    //                 key: item.custId,
    //             });
    //         });
    //     });
    // },
    submit() {
      var _this = this;
      if (!Utils.valiMarketApply(this)) return; //校验
      this.isSubmit = true;
      this.$vux.confirm.show({
        title: '是否提交',
        content: '确定执行操作？',
        onCancel() {
          _this.isSubmit = false;
        },
        onConfirm() {
          _this.handleApply();
        }
      });
    },
    handleApply() {
      var _this = this;
      var params = com.clone(_this.applyData);
      params.sendToList = this.sendToList;
      params.copyToList = this.copyToList;
      com.covertHttp(api.saveMarketDaily, params).then(rtn => {
        if (rtn.status == 0) {
          this.$vux.toast.text(rtn.message);
          this.$router.go(-1);
          this.delAutoSave();
        } else {
          // this.$vux.toast.text(rtn.message || '服务器异常');
        }
        this.isSubmit = false;
      });
    },
    delAutoSave() {
      clearInterval(this.saveTimer);
      com.comGetStorage('autoSave').then(rtn => {
        delete rtn.LogMarketApply;
        com.comSetStorage('autoSave', rtn);
      });
    },
    backStep() {
      this.$router.go(-1);
    },
    changeCust(e) {
      if (this.applyData.dailyCustMaintenanceList[e.itemIndex].custId == '') return;
      this.applyData.dailyCustMaintenanceList[e.itemIndex].custMaintenanceContent =
        e.custMaintenanceContent;
      this.applyData.dailyCustMaintenanceList[e.itemIndex].custMaintenanceDate =
        e.custMaintenanceDate;
      this.applyData.dailyCustMaintenanceList[
        e.itemIndex
      ].custMaintenanceDateTime = com.formatFullDateTime(e.custMaintenanceDate);
      this.applyData.dailyCustMaintenanceList[e.itemIndex].custName = e.custName;
      this.applyData.dailyCustMaintenanceList[e.itemIndex].visitType = e.visitType;
      this.applyData.dailyCustMaintenanceList[e.itemIndex].visitTypeName = e.visitTypeName;
      this.applyData.dailyCustMaintenanceList[e.itemIndex].custLabel = e.custName;
      this.changeCount();
    },
    changeCount() {
      this.applyData.custPhotoCount = 0;
      this.applyData.custVisitCount = 0;
      this.applyData.dailyCustMaintenanceList.forEach((el, idx) => {
        if (el.visitType == 1) {
          this.applyData.custVisitCount++;
        } else if (el.visitType == 2) {
          this.applyData.custPhotoCount++;
        }
      });
    },
    addItem() {
      this.applyData.dailyCustMaintenanceList.push({
        custId: '', //客户id ,
        custMaintenanceContent: '', //维护内容
        custMaintenanceDate: '', //维护时间
        custMaintenanceDateTime: '',
        custName: '', //客户name
        visitType: '', //拜访类型
        visitTypeName: '',
        custLabel: ''
      });
    },
    delItem(index) {
      var _this = this;
      // if(this.applyData.dailyCustMaintenanceList.length <= 1){
      //     this.$vux.toast.text('无法继续删除');
      //     return;
      // }
      this.$vux.confirm.show({
        title: '是否删除',
        content: '确定执行操作？',
        onCancel() {},
        onConfirm() {
          _this.applyData.dailyCustMaintenanceList.splice(index, 1);
          _this.changeCount();
        }
      });
    }
  }
};
</script>
<style lang="less">
@import '../../assets/css/common/reset.fix.less';
@import '../../assets/css/common/base.less';
@import '../../assets/css/index.less';
.fixbtn {
  width: 100%;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 10px;
  box-sizing: border-box;
  z-index: 10000;
  background: #f0f0f2;
}
</style>
