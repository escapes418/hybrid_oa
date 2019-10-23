<template>
  <div v-if="isReady">
    <group title="基本信息" label-margin-right="1em">
      <x-textarea
        title="今日工作"
        :autosize="true"
        placeholder="请输入"
        v-model.trim="applyData.todayWork"
        :max="1000"
      >
        <span slot="label" style="padding-right:10px;"
          >今日工作<span class="required">*</span></span
        >
      </x-textarea>
      <x-textarea
        title="运力池建设"
        :autosize="true"
        placeholder="请输入"
        v-model.trim="applyData.transportPoolBuild"
        :max="1000"
      >
        <span slot="label" style="padding-right:10px;"
          >运力池建设<span class="required">*</span></span
        >
      </x-textarea>
      <x-textarea
        title="回访项目情况"
        :autosize="true"
        placeholder="请输入"
        v-model.trim="applyData.revisitProjectStatus"
        :max="1000"
      >
        <span slot="label" style="padding-right:10px;"
          >回访项目情况<span class="required">*</span></span
        >
      </x-textarea>
      <x-textarea
        title="需要协助问题"
        :autosize="true"
        placeholder="请输入"
        v-model.trim="applyData.needAssistProblem"
        :max="1000"
      >
        <span slot="label" style="padding-right:10px;"
          >需要协助问题<span class="required">*</span></span
        >
      </x-textarea>
      <x-textarea
        title="今日感想"
        :autosize="true"
        placeholder="请输入"
        v-model.trim="applyData.todayThought"
        :max="1000"
      >
        <span slot="label" style="padding-right:10px;"
          >今日感想<span class="required">*</span></span
        >
      </x-textarea>
      <x-textarea
        title="备注"
        :autosize="true"
        placeholder="请输入"
        v-model.trim="applyData.remarks"
        :max="1000"
      ></x-textarea>
    </group>
    <group
      title="项目情况"
      label-margin-right="1em"
      v-for="(item, index) in applyData.projectImplementStatusList"
      :key="index"
    >
      <box gap="10px 15px" v-if="applyData.projectImplementStatusList.length > 1">
        <div style="height:26px">
          <span class="fr font-orange" @click="delItem(index)">删除</span>
        </div>
      </box>
      <proSelector
        sTitle="项目名称"
        sPlaceholder="请选择"
        :isRequired="true"
        @on-change="changePro"
        :sendData="item.projectId"
        :itemIndex="index"
        :sLabel="item.projectName"
        :selectedItem.sync="item.projectId"
      ></proSelector>
      <sinSelector
        sTitle="节点"
        :isRequired="true"
        sPlaceholder="请选择"
        @on-change="changeNode(index)"
        :dataList="item.nodeList"
        :sendData="item.nodeId"
        :selectedItem.sync="item.nodeId"
      ></sinSelector>
      <x-input title="节点具体地址" v-model="item.nodeAddress" readonly>
        <span slot="label">节点具体地址<span class="required">*</span></span>
      </x-input>
      <x-input
        title="节点人数"
        :max="50"
        placeholder="请输入"
        type="number"
        v-model.trim="item.nodeEmpNum"
      >
        <span slot="label">节点人数<span class="required">*</span></span>
      </x-input>
      <x-input title="节点具体人员" :max="50" placeholder="请输入" v-model.trim="item.nodeEmpNames">
        <span slot="label">节点具体人员<span class="required">*</span></span>
      </x-input>
      <sinSelector
        sTitle="异常情况"
        :isRequired="true"
        sPlaceholder="请选择"
        :dataList="dictionary.abnormalStatus"
        :sendData="item.hasAbnormalStatus"
        :selectedItem.sync="item.hasAbnormalStatus"
      ></sinSelector>
      <x-textarea
        title="具体异常说明"
        v-if="item.hasAbnormalStatus == 1"
        :autosize="true"
        v-model="item.anomalyDescription"
        :max="200"
      >
        <span slot="label" style="padding-right:10px;"
          >具体异常说明<span class="required">*</span></span
        >
      </x-textarea>
    </group>
    <div class="add-btn">
      <span class="pointer" @click="addItem">新增项目情况</span>
    </div>
    <group title="发送对象" label-margin-right="1em" style="margin-bottom:62px">
      <!-- <mulSelectors sTitle='发给谁' :max="0" :isRequired="true" sPlaceholder='请选择' :dataList="sendPeopelList" :sendData="sendToUserList" :selectedItem.sync="sendToUserList"></mulSelectors>
            <mulSelectors sTitle='抄送给谁' :max="0" sPlaceholder='请选择' :dataList="copyToPeoList" :sendData="copyToList" :selectedItem.sync="copyToList"></mulSelectors> -->
      <multree
        sTitle="发给谁"
        :isRequired="true"
        :isPeople="true"
        sPlaceholder="请选择"
        :dataList="sendPeopelList"
        :sendData="sendToUserList"
        :selectedItem.sync="sendToUserList"
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
          <x-button type="primary" :disabled="disSubmit" @click.native="submit">提交</x-button>
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
import proSelector from '@/components/proSelector';
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
  name: 'LogImpApply',
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
    multree,
    mulSelectors,
    proSelector
  },
  data() {
    return {
      isReady: false,
      applyData: {
        needAssistProblem: '', //需要协助问题
        revisitProjectStatus: '', //回访项目情况
        remarks: '',
        sendToUserList: [], //发给谁
        copyToList: [], //抄送给谁
        todayThought: '', //今日感想
        todayWork: '', //今日工作
        transportPoolBuild: '', //运力池建设
        projectImplementStatusList: [
          {
            anomalyDescription: '', //具体异常说明
            hasAbnormalStatus: '', //是否有异常情况
            implyDailyId: '', //实施日志表ID
            nodeAddress: '', //节点具体地址
            nodeEmpNames: '', //节点具体人员
            nodeEmpNum: undefined, //节点人数
            nodeId: '', //节点ID
            nodeName: '', //节点名称
            projectId: '', //项目ID
            projectName: '', //项目名称
            nodeList: []
          }
        ]
      },
      sendToUserList: [],
      projectList: [],
      dictionary: {
        abnormalStatus: []
      },
      saveTimer: false,
      sendPeopelList: [],
      copyToList: [],
      copyToPeoList: [],
      disSubmit: false
    };
  },
  computed: {},
  created() {
    this.init();
    this.getDictionary();
  },
  beforeDestroy() {
    clearInterval(this.saveTimer);
  },
  methods: {
    init() {
      //   this.getSendPeopelList();
      this.getProList();
      this.initAutoSave();
      this.getTreeList();
      this.getSend();
    },
    initAutoSave() {
      var _this = this;
      this.getAutoSaveTime().then(getData => {
        com.comGetStorage('autoSave').then(rtn => {
          if (rtn.LogImpApply !== undefined) _this.applyData = rtn.LogImpApply; //给表单赋值
          _this.isReady = true;
          _this.saveTimer = setInterval(() => {
            rtn.LogImpApply = _this.applyData;
            com.comSetStorage('autoSave', rtn);
          }, getData);
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
    getSend() {
      com
        .covertHttp(api.querySendToByUserId, {
          dailyTemplate: 0
        })
        .then(rtn => {
          var s = rtn.data.sendTo || [];
          var c = rtn.data.copyTo || [];
          s.forEach((item, index) => {
            this.sendToUserList.push(item.sendToId);
          });
          c.forEach((item, index) => {
            this.copyToList.push(item.copyToId);
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
    getDictionary() {
      com.comGetStorage('queryDict').then(data => {
        var getData = data.dict;
        function selectDic(type) {
          let temp = [];
          for (var i = 0; i < getData.length; i++) {
            if (getData[i].type == type) {
              temp.push({
                ...getData[i],
                key: getData[i].value,
                value: getData[i].name
              });
            }
          }
          return temp;
        }
        this.dictionary.abnormalStatus = selectDic('node_has_abnormal_status'); //异常情况
      });
    },
    getProList() {
      com.comGetStorage('queryDictInfo').then(rtn => {
        rtn.dict.forEach((item, index) => {
          this.projectList.push({
            ...item,
            value: item.label,
            key: item.value
          });
        });
      });
    },
    changePro(el) {
      // console.log(el);
      // return;
      // this.projectList.forEach((el, idx) => {
      //   if (el.key == this.applyData.projectImplementStatusList[index].projectId) {
      //     this.applyData.projectImplementStatusList[index].projectName = el.value;
      //     this.applyData.projectImplementStatusList[index].nodeList = [];
      //     this.applyData.projectImplementStatusList[index].nodeAddress = '';
      //     this.applyData.projectImplementStatusList[index].nodeName = '';
      //     this.applyData.projectImplementStatusList[index].nodeId = '';
      //     com.covertHttp(api.queryProjectNodeList, {
      //         id: el.key
      //       })
      //       .then(rtn => {
      //         if (rtn.status == 0) {
      //           var data = rtn.data || [];
      //           data.forEach((e, i) => {
      //             this.applyData.projectImplementStatusList[index].nodeList.push({
      //               ...e,
      //               value: e.nodeName,
      //               key: e.nodeId
      //             });
      //           });
      //         } else {
      //           // this.$vux.toast.text(rtn.message || '服务器异常');
      //         }
      //       });
      //   }
      // });
      this.applyData.projectImplementStatusList[el.itemIndex].projectName = el.value;
      this.applyData.projectImplementStatusList[el.itemIndex].nodeList = [];
      this.applyData.projectImplementStatusList[el.itemIndex].nodeAddress = '';
      this.applyData.projectImplementStatusList[el.itemIndex].nodeName = '';
      this.applyData.projectImplementStatusList[el.itemIndex].nodeId = '';
      com
        .covertHttp(api.queryProjectNodeList, {
          id: el.key
        })
        .then(rtn => {
          if (rtn.status == 0) {
            var data = rtn.data || [];
            data.forEach((e, i) => {
              this.applyData.projectImplementStatusList[el.itemIndex].nodeList.push({
                ...e,
                value: e.nodeName,
                key: e.nodeId
              });
            });
          } else {
            // this.$vux.toast.text(rtn.message || '服务器异常');
          }
        });
    },
    changeNode(index) {
      this.applyData.projectImplementStatusList[index].nodeList.forEach((el, idx) => {
        if (el.nodeId == this.applyData.projectImplementStatusList[index].nodeId) {
          this.applyData.projectImplementStatusList[index].nodeAddress = el.nodeAddress;
          this.applyData.projectImplementStatusList[index].nodeName = el.nodeName;
        }
      });
    },
    submit() {
      var _this = this;
      if (!Utils.ImpApply(this)) return; //校验
      this.disSubmit = true;
      this.$vux.confirm.show({
        title: '是否提交',
        content: '确定执行操作？',
        onCancel() {
          _this.disSubmit = false;
        },
        onConfirm() {
          _this.handleApply();
        }
      });
    },
    handleApply() {
      com
        .covertHttp(api.saveImplyDaily, {
          ...this.applyData,
          sendToUserList: this.sendToUserList,
          copyToList: this.copyToList
        })
        .then(rtn => {
          if (rtn.status == 0) {
            this.$vux.toast.text(rtn.message);
            this.$router.go(-1);
            this.delAutoSave();
          } else {
            // this.$vux.toast.text(rtn.message || '服务器异常');
          }
          this.disSubmit = false;
        });
    },
    delAutoSave() {
      clearInterval(this.saveTimer);
      com.comGetStorage('autoSave').then(rtn => {
        delete rtn.LogImpApply;
        com.comSetStorage('autoSave', rtn);
      });
    },
    addItem() {
      this.applyData.projectImplementStatusList.push({
        anomalyDescription: '',
        hasAbnormalStatus: '',
        implyDailyId: '',
        nodeAddress: '',
        nodeEmpNames: '',
        nodeEmpNum: undefined,
        nodeId: '',
        nodeName: '',
        projectId: '',
        projectName: '',
        nodeList: []
      });
    },
    delItem(index) {
      var _this = this;
      // if(this.applyData.projectImplementStatusList.length <= 1){
      //     this.$vux.toast.text('无法继续删除');
      //     return;
      // }
      this.$vux.confirm.show({
        title: '是否删除',
        content: '确定执行操作？',
        onCancel() {},
        onConfirm() {
          _this.applyData.projectImplementStatusList.splice(index, 1);
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


