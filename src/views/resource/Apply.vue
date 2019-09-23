<template>
  <div class="approval_apply">
    <group title="基本信息" label-margin-right="1em">
      <x-input title="申请人" readonly v-model="baseInfo.userName"></x-input>
      <proSelector
        sTitle="项目名称"
        :isRequired="true"
        sPlaceholder="请选择"
        :sendData="applyData.projectId"
        :selectedItem.sync="applyData.projectId"
        @on-change="changeName"
        :sLabel="applyData.projectName"
      ></proSelector>
      <x-input title="项目负责人" v-model="applyData.projectPersonel" readonly></x-input>
      <sinSelector
        sTitle="资源类型"
        :isRequired="true"
        sPlaceholder="请选择"
        :dataList="resourceList"
        :sendData="applyData.resourcesType"
        :selectedItem.sync="applyData.resourcesType"
      ></sinSelector>
      <x-input
        title="需求数量"
        :max="50"
        placeholder="请输入"
        v-model.trim="applyData.demandPersonelNum"
      >
        <span slot="label">需求数量<span class="required">*</span></span>
      </x-input>
      <datetime
        title="期望抵达时间"
        format="YYYY-MM-DD HH"
        class="data-time"
        v-model="applyData.expectDate"
        placeholder="请选择时间"
        :display-format="expectDate"
      ></datetime>
      <x-input title="预计时长" :max="50" placeholder="请输入" v-model.trim="applyData.timeLong">
        <span slot="label">预计时长<span class="required">*</span></span>
      </x-input>
      <x-input
        title="预算金额"
        :max="50"
        placeholder="请输入"
        v-model.trim="applyData.amountSum"
        type="number"
      >
        <span slot="label">预算金额<span class="required">*</span></span>
      </x-input>
      <x-textarea
        title="备注"
        v-model.trim="applyData.remarks"
        :autosize="true"
        :max="200"
      ></x-textarea>
    </group>
    <box gap="10px 10px">
      <flexbox>
        <flexbox-item>
          <x-button type="primary" class="mt-15" :disabled="disSubmit" @click.native="submit"
            >提交申请</x-button
          >
        </flexbox-item>
        <flexbox-item>
          <x-button class="mt-15" :disabled="disDraft" @click.native="draft">保存草稿</x-button>
        </flexbox-item>
      </flexbox>
    </box>
  </div>
</template>
<script>
import api from '@/assets/api/index.api';
import com from '@/assets/js/common';
import sinSelector from '@/components/sinSelector';
import proSelector from '@/components/proSelector';
import XHR from '@/assets/js/XHR';
import { mapState, mapGetters } from 'vuex';
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
import listVue from '../log/list.vue';
export default {
  name: 'ResourceApply',
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
    proSelector
  },

  data: function() {
    return {
      paramsId: this.$route.params.id,
      showDelDialog: false,
      delDialigIndex: '',
      resourceList: [],
      projectNameOpt: [],
      baseInfo: {
        userName: ''
      },
      applyData: {
        applyTime: null,
        amountSum: null,
        projectId: null, //项目编号
        id: null, //主键ID
        procInsId: null, //流程实例ID
        // projectName: null,
        resourcesType: null,
        expectDate: com.timeFormatHour(new Date().getTime()),
        demandPersonelNum: null,
        timeLong: null,
        remarks: null
      },
      disDraft: false,
      disSubmit: false
    };
  },
  watch: {
    // "applyData.projectId": function(newVal, oldVal){
    //     this.projectNameOpt.forEach((item, index) => {
    //         if(item.key == this.applyData.projectId) {
    //             this.applyData.projectPersonel = item.projectLeaderName
    //         }
    //     })
    //     if(newVal == ''){
    //         this.applyData.projectPersonel = null
    //     }
    // }
  },
  created() {
    this.init();
    // com.addKeepAlive(this) //添加keep-alive
  },
  methods: {
    changeName(el) {
      if (!this.applyData.projectId) {
        this.applyData.projectPersonel = '';
      }
      // this.projectNameOpt.forEach((item, index) => {
      //   if (item.key == this.applyData.projectId) {
      //     this.applyData.projectPersonel = item.projectLeaderName;
      //   }
      // });
      this.applyData.projectPersonel = el.projectLeaderName;
    },
    expectDate(val) {
      return val + ':00:00';
    },
    getDictionary() {
      com.comGetStorage('queryDict').then(data => {
        var getData = data.dict;
        getData.forEach((item, index) => {
          getData[index] = {
            ...item,
            key: item.value,
            value: item.name
          };
        });
        function selectDic(arr, type) {
          let temp = [];
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].type == type) {
              temp.push(arr[i]);
            }
          }
          return temp;
        }
        this.resourceList = selectDic(getData, 'resources_type'); //资源类别
      });
    },
    init() {
      com.comGetStorage('userInfo').then(res => {
        this.baseInfo = res;
      });
      com
        .covertHttp(api.queryDictInfo, {
          dictType: 'oa_project'
        })
        .then(rtn => {
          rtn.data.forEach((item, index) => {
            this.projectNameOpt.push({
              ...item,
              value: item.label,
              key: item.value
            });
          });
        });
      this.getDictionary();
      if (this.$route.params.id) {
        this.getDetail().then(res => {
          if (!res.resourcesApplyFlowResponse.expectDate) {
            res.resourcesApplyFlowResponse.expectDate = '';
          } else {
            //转换成合适的时间格式
            res.resourcesApplyFlowResponse.expectDate = com.timeFormatHour(
              res.resourcesApplyFlowResponse.expectDate
            );
          }
          this.applyData = res.resourcesApplyFlowResponse;
        });
      }
    },
    getDetail() {
      return new Promise((resolve, reject) => {
        com
          .covertHttp(api.resourcesApplyFlowDetail, {
            resApplyFlowId: this.paramsId
          })
          .then(rtn => {
            resolve(rtn.data);
          });
      });
    },
    submit() {
      var _this = this;
      if (this.applyData.demandPersonelNum == '') {
        this.applyData.demandPersonelNum = null;
      }
      if (this.applyData.timeLong == '') {
        this.applyData.timeLong = null;
      }
      if (this.applyData.amountSum == '') {
        this.applyData.amountSum = null;
      }
      if (!this.valid()) return; //校验
      this.disSubmit = true;
      this.$vux.confirm.show({
        title: '提交申请',
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
        .covertHttp(api.resourcesApply, {
          ...this.applyData,
          expectDate: com.timeParse(this.applyData.expectDate + ':00:00')
        })
        .then(res => {
          if (res.status == 0) {
            this.$vux.toast.text(res.message || '申请发起成功');
            this.$router.push({ path: '/userIndex' });
            com.delKeepAlive(this, [
              'TaskOption',
              'UserIndex',
              'ResourceListRecived',
              'ResourceListSend'
            ]);
          }
          this.disSubmit = false;
        });
    },
    draft() {
      var _this = this;

      if (this.applyData.demandPersonelNum == '') {
        this.applyData.demandPersonelNum = null;
      }
      if (this.applyData.timeLong == '') {
        this.applyData.timeLong = null;
      }
      if (this.applyData.amountSum == '') {
        this.applyData.amountSum = null;
      }
      if (!this.valid()) return; //校验
      this.disDraft = true;
      var id = this.$route.params.id == 0 ? '' : this.$route.params.id;
      com
        .covertHttp(api.saveResourcesApplyInfo, {
          id: id,
          ...this.applyData,
          expectDate: com.timeParse(this.applyData.expectDate + ':00:00')
        })
        .then(res => {
          if (res.status == 0) {
            this.$vux.toast.text(res.message || '申请发起成功');
            this.$router.push({ path: '/userIndex' });
            com.delKeepAlive(this, [
              'TaskOption',
              'UserIndex',
              'ResourceListRecived',
              'ResourceListSend'
            ]);
          }
          this.disDraft = false;
        });
    },
    valid() {
      var flag = true;
      if (!this.applyData.projectId) {
        this.$vux.toast.text('请选择项目名称！');
        flag = false;
      } else if (!this.applyData.resourcesType) {
        this.$vux.toast.text('请选择资源类型！');
        flag = false;
      } else if (
        !/(^[0-9]\d*$)/.test(this.applyData.demandPersonelNum) ||
        this.applyData.demandPersonelNum == 0
      ) {
        this.$vux.toast.text('请正确填写需求数量！');
        flag = false;
      } else if (!this.applyData.expectDate) {
        this.$vux.toast.text('请选择期望抵达时间！');
        flag = false;
      } else if (!/(^[0-9]\d*$)/.test(this.applyData.timeLong) || this.applyData.timeLong == 0) {
        this.$vux.toast.text('请正确填写预计时长！');
        flag = false;
      } else if (!/(^[0-9]\d*$)/.test(this.applyData.amountSum) || this.applyData.amountSum == 0) {
        this.$vux.toast.text('请正确填写预算金额！');
        flag = false;
      }
      return flag;
    }
  }
};
</script>
<style scoped lang="less">
.approval_apply {
  .weui-cells {
    margin-top: 0 !important;
  }
  .vux-no-group-title {
    margin-top: 0 !important;
  }
}
</style>

