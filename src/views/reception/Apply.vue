<template>
  <div v-if="isReady" class="rec">
    <group title="接待申请" label-margin-right="1em">
      <x-input
        title="申请人员"
        readonly
        :value="baseInfo.userName"
        placeholder="请输姓名"
      ></x-input>
      <datetime
        format="YYYY-MM-DD"
        class="data-time"
        v-model="applyTime"
        title="申请时间"
        readonly
        placeholder="请选择申请时间"
      ></datetime>
      <x-input
        title="所属部门"
        readonly
        :value="baseInfo.officeName"
        placeholder="请选择所属部门"
      ></x-input>
      <x-input
        title="接待主题"
        :max="50"
        v-model.trim="approvalForm.recpTheme"
        placeholder="请输入接待主题"
      >
        <span slot="label">接待主题<span class="required">*</span></span>
      </x-input>
      <proSelector
        sTitle="项目名称"
        :isRequired="true"
        sPlaceholder="请选择"
        :sendData="approvalForm.projectId"
        :sLabel="approvalForm.projectName"
        :selectedItem.sync="approvalForm.projectId"
        @on-change="changeName"
      ></proSelector>
      <x-input title="项目负责人" v-model="approvalForm.projectPersonel" readonly></x-input>
      <x-input
        title="预计接待人数"
        :max="50"
        type="number"
        v-model.trim="approvalForm.recpNum"
        placeholder="请输入接待人数"
      >
        <span slot="label">预计接待人数<span class="required">*</span></span>
      </x-input>
      <datetime
        class="data-time"
        v-model="approvalForm.recpTime"
        title="预计接待时间"
        placeholder="请选择申请时间"
        format="YYYY-MM-DD"
      ></datetime>
      <!-- <x-input title="预计陪客人员" placeholder='请选择陪客人员' :value="receptionistVal" @click.native="receptionist=true" readonly>
                <span slot="label">预计陪客人员<span class="required">*</span></span>
            </x-input> -->
      <multree
        sTitle="陪客人员"
        :isRequired="true"
        :isPeople="true"
        sPlaceholder="请选择"
        :dataList="recPelpleList"
        :sendData="approvalForm.employees"
        :selectedItem.sync="approvalForm.employees"
      ></multree>
      <x-textarea
        title="备注"
        v-model="approvalForm.remarks"
        placeholder="请输入备注"
        :max="200"
        :rows="3"
      ></x-textarea>
    </group>
    <group
      :title="'接待明细' + (index + 1)"
      label-margin-right="1em"
      v-for="(item, index) in itemDatas"
      :key="index"
    >
      <recItem ref="recItem" :index="index" :itemData="item" :items="itemDatas"></recItem>
    </group>
    <div class="add-btn">
      <span class="pointer" @click="addItem">新增接待明细</span>
    </div>
    <group title="预览汇总" label-margin-right="1em">
      <cell title="总额" :value="preExpenseAmt | thousands(2)" value-align="left"></cell>
      <cell title="大写金额" :value="preExpenseAmt | bigMoney" value-align="left"></cell>
    </group>
    <box gap="10px 10px">
      <flexbox>
        <flexbox-item>
          <x-button type="primary" class="mt-15" :disabled="disSubmit" @click.native="submit"
            >提交申请</x-button
          >
        </flexbox-item>
        <flexbox-item v-if="paramsId == 0 || (paramsId != 0 && recpStatus == 4)">
          <x-button type="default" class="mt-15" :disabled="disDraft" @click.native="draft"
            >存为草稿</x-button
          >
        </flexbox-item>
      </flexbox>
    </box>
    <div v-transfer-dom>
      <confirm
        v-model="isSubmit"
        title="提交接待申请"
        @on-cancel="isSubmit = false"
        @on-confirm="submit(true)"
      >
        <p style="text-align:center;">{{ '确定执行操作?' }}</p>
      </confirm>
    </div>
    <!-- 陪客人员 -->
    <div v-transfer-dom>
      <div class="search" v-if="receptionist">
        <search
          @on-change="goSearch"
          v-model="search"
          @on-cancel="onSearchCancel"
          @on-clear="onSearchCancel"
          placeholder="请输入关键字"
        ></search>
      </div>
      <popup v-model="receptionist" height="100%" style="-webkit-overflow-scrolling:touch;">
        <div class="popup1">
          <group class="checkcontent">
            <checklist
              label-position="left"
              :options="ArrBox"
              v-model="approvalForm.employees"
            ></checklist>
          </group>
        </div>
      </popup>
      <box class="checklistbtn" v-if="receptionist">
        <flexbox>
          <flexbox-item>
            <x-button type="primary" @click.native="receptionistconfirm">确认</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="default" @click.native="receptionistCancel">取消</x-button>
          </flexbox-item>
        </flexbox>
      </box>
    </div>
  </div>
</template>
<script>
import api from '@/assets/api/index.api';
import com from '@/assets/js/common';
import recItem from '@/components/recItem';
import mulSelector from '@/components/mulSelector';
import sinSelector from '@/components/sinSelector';
import proSelector from '@/components/proSelector';
import multree from '@/components/multree.vue';
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
  name: 'ReceptionApply',
  directives: {
    TransferDom
  },
  components: {
    Box,
    Group,
    Cell,
    CellBox,
    XButton,
    Search,
    Popup,
    PopupPicker,
    Checklist,
    Datetime,
    XInput,
    XTextarea,
    Selector,
    Confirm,
    Calendar,
    Flexbox,
    FlexboxItem,
    XAddress,
    XDialog,
    recItem,
    multree,
    selectList1: mulSelector,
    selectList2: sinSelector,
    proSelector
  },

  data: function() {
    return {
      isSubmit: false,
      paramsId: this.$route.params.id,
      isReady: false,
      approvalForm: {
        employees: [], //预计陪客人员
        procInsId: '',
        taskId: '',
        customerSituation: '',
        projectPersonel: '',
        projectId: '', // 项目名称 - 默认值：请选择
        remarks: '', //备注
        recpTheme: '', //接待主题
        recpTime: com.timeFormat(new Date().getTime()), // 预计接待时间
        recpNum: '',
        id: ''
      },
      applyTime: com.timeFormat(new Date().getTime()), // 申请时间
      projectNameOpt: [],
      projectNameOpt2: [],

      initData: {
        startDate: com.timeFormat(new Date().getTime()),
        startPoint: ['420000', '420100'],
        endDate: com.timeFormat(new Date().getTime() + 86400000),
        endPoint: ['420000', '420100'],

        subject: [],

        personNum: 1,
        // dayNum: 1,
        expenseAmt: '',
        remarks: ''
      },
      baseInfo: {
        userName: ''
      },
      recpStatus: '',
      reception: false,
      receptionist: false,
      ReceptionistlistData: [],
      receptionistVal: '',
      search: '',
      ArrBox: [],
      recPelpleList: [],
      disDraft: false,
      disSubmit: false
    };
  },
  computed: {
    ...mapState({
      itemDatas: state => state.itemDatas,
      addressData: state => state.addressData,
      subjectData: state => state.subjectList
    }),
    ...mapGetters(['preExpenseAmt'])
  },
  created() {
    // 0.清空所有数组
    this.$store.dispatch('delallItemDatas', {});
    this.init();
    this.getDict();
    // this.getReceptionistList();
    this.getTreeList();
    if (this.addressData.length == 0) this.$store.dispatch('getAddressList');
    if (this.subjectData.length == 0) this.$store.dispatch('getSubjectList');
  },
  // watch: {
  //     "approvalForm.projectId": function(newVal, oldVal) {
  //         if(newVal == ""){
  //             this.approvalForm.projectPersonel = "";
  //         }
  //         this.projectNameOpt.forEach((item, index) => {
  //             if (item.value == this.approvalForm.projectId) {
  //                 this.approvalForm.projectPersonel = item.projectLeaderName;
  //             }
  //         });
  //     }
  // },
  methods: {
    changeName(el) {
      if (!this.approvalForm.projectId) {
        this.approvalForm.projectPersonel = '';
      }
      // this.projectNameOpt.forEach((item, index) => {
      //   if (item.value == this.approvalForm.projectId) {
      //     this.approvalForm.projectPersonel = item.projectLeaderName;
      //   }
      // });
      this.approvalForm.projectPersonel = el.projectLeaderName;
    },
    getReceptionistList() {
      var _this = this;
      com.covertHttp(api.escortEmployee).then(rtn => {
        rtn.data.forEach(function(item, index) {
          _this.ReceptionistlistData.push({
            ...item,
            value: item.name,
            key: item.loginName
          });
        });
        this.ArrBox = this.ReceptionistlistData;
      });
    },
    init() {
      com.comGetStorage('userInfo').then(res => {
        this.baseInfo = res;
      });
      if (this.$route.params.id == 0) {
        // 新增
        this.addItem();
      } else {
        // 编辑
        // 处理编辑逻辑
        var _this = this;
        this.approvalForm.id = this.$route.params.id;
        this.getDetail().then(rtnData => {
          // 基础参数赋值
          var rData = rtnData.recpFlowresponse;
          var Dtime = rData.recpTime || '';
          var empName = rData.employeesName || [];
          this.approvalForm = Object.assign(
            {},
            {
              employees: rData.employees, //预计陪客人员
              procInsId: rData.procInsId,
              taskId: rData.taskId,
              projectPersonel: rData.projectPersonel,
              projectId: rData.projectId, // 项目名称 - 默认值：请选择
              projectName: rData.projectName || '', // 项目名称 - 默认值：请选择
              remarks: rData.remarks, //备注
              recpTheme: rData.recpTheme, //接待主题
              customerSituation: rData.customerSituation,
              recpTime: com.timeFormat(Dtime), // 预计接待时间
              recpNum: rData.recpNum,
              id: _this.$route.params.id
            }
          );
          (this.applyTime = com.timeFormat(rData.applyTime)), // 申请时间
            empName.forEach((item, index) => {
              this.receptionistVal += ' ' + item;
            });
          this.recpStatus = rtnData.recpFlowresponse.recpStatus;
          // 动态参数赋值
          var itemDataList = rtnData.budgetDetailList || [];
          var newItemDatas = com.ObjToStamp(itemDataList, ['startDate', 'endDate']);
          this.$store.dispatch('fullItemDatas', newItemDatas);
          this.isReady = true;
        });
      }
    },
    getTreeList() {
      com.covertHttp(api.orgAndUserInfo, { queryType: '2' }).then(rtn => {
        var list = com.addTreePeopel(rtn.data);
        var peopelList = com.hasChildren(list);
        this.recPelpleList = com.clone(peopelList);
        this.isReady = true;
      });
    },
    getDetail() {
      return new Promise((resolve, reject) => {
        com
          .covertHttp(api.recpFlowDetail, {
            recpFlowId: this.approvalForm.id
          })
          .then(rtn => {
            resolve(rtn.data);
          });
      });
    },
    addItem() {
      if (this.itemDatas.length >= 30) {
        this.$vux.toast.text('添加明细不能超过30条');
        return;
      }
      var obj = com.clone(this.initData);
      this.$store.dispatch('addItemDatas', obj);
    },
    submit() {
      var _this = this;
      if (!this.valid()) return; //校验
      this.disSubmit = true;
      this.$vux.confirm.show({
        title: '提交接待申请',
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
      // if (!this.valid()) return;
      var postData = {
        ...this.approvalForm,
        recpTime: com.timeParse(this.approvalForm.recpTime),
        demandBudgetList: com.changeItemtimestamp(this.itemDatas, ['startDate', 'endDate'])
      };
      com
        .covertHttp(api.recpApply, {
          ...postData
        })
        .then(rtn => {
          if (rtn.status == 0) {
            this.$vux.toast.text(rtn.message || '申请发起成功');
            this.$router.push({ path: '/userIndex' });
            com.delKeepAlive(this, [
              'TaskOption',
              'UserIndex',
              'ReceptionListRecived',
              'ReceptionListSend'
            ]);
            this.disSubmit = false;
          } else {
            // this.$vux.toast.text(
            //     rtn.message || "提交失败，请注意是否填写有误"
            // );
          }
          this.disSubmit = false;
        });
    },
    draft() {
      if (!this.valid()) return;
      this.disDraft = true;
      var postData = {
        ...this.approvalForm,
        recpTime: com.timeParse(this.approvalForm.recpTime),
        demandBudgetList: com.changeItemtimestamp(this.itemDatas, ['startDate', 'endDate'])
      };
      var id = this.$route.params.id == 0 ? '' : this.$route.params.id;
      com
        .covertHttp(api.saveRecpFlowInfo, {
          ...postData,
          id: id
        })
        .then(rtn => {
          if (rtn.status == 0) {
            this.$vux.toast.text(rtn.message || '申请发起成功');
            this.$router.push({ path: '/userIndex' });
            com.delKeepAlive(this, [
              'TaskOption',
              'UserIndex',
              'ReceptionListRecived',
              'ReceptionListSend'
            ]);
          } else {
            // this.$vux.toast.text(
            //     rtn.message || "提交失败，请注意是否填写有误"
            // );
          }
          this.disDraft = false;
        });
    },
    valid() {
      // 整体校验
      var flag = true,
        _this = this;
      if (this.approvalForm.recpTheme == '') {
        this.$vux.toast.text('请填写接待主题');
        return (flag = false);
      }
      if (this.approvalForm.projectId === true || this.approvalForm.projectId == '') {
        this.$vux.toast.text('请选择项目名称');
        return (flag = false);
      }
      if (!/(^[0-9]\d*$)/.test(this.approvalForm.recpNum) || this.approvalForm.recpNum == 0) {
        _this.$vux.toast.text('请填写预计接待人数');
        flag = false;
        return;
      }
      if (this.approvalForm.employees.length == 0) {
        this.$vux.toast.text('请选择预计陪客人员');
        return (flag = false);
      }
      if (this.itemDatas.length == 0) {
        this.$vux.toast.text('请填写接待明细');
        return (flag = false);
      }
      for (var i in _this.itemDatas) {
        if (!_this.$refs.recItem[i].componentsValid()) {
          flag = false;
          return;
        }
      }
      return flag;
    },
    getDict() {
      com
        .covertHttp(api.queryDictInfo, {
          dictType: 'oa_project'
        })
        .then(rtn => {
          this.projectNameOpt = rtn.data;
          rtn.data.forEach((item, index) => {
            this.projectNameOpt2.push({
              ...item,
              value: item.label,
              key: item.value
            });
          });
        });
    },
    receptionistconfirm() {
      var _this = this;
      this.receptionistVal = '';
      this.ReceptionistlistData.forEach((item, index) => {
        _this.approvalForm.employees.forEach((itm, idx) => {
          if (item.key == itm) {
            _this.receptionistVal += ' ' + item.value;
          }
        });
      });
      this.receptionist = false;
    },
    receptionistCancel() {
      this.approvalForm.employees = [];
      this.receptionistVal = '';
      this.receptionist = false;
    },
    goSearch() {
      if (this.search == '') {
        this.ArrBox = this.ReceptionistlistData;
      } else {
        this.ArrBox = [];
        this.ReceptionistlistData.forEach((item, index) => {
          if (item.value.indexOf(this.search) != -1) {
            this.ArrBox.push(item);
          }
        });
      }
    },
    onSearchCancel() {
      this.search = '';
      this.ArrBox = this.dataList;
    }
  }
};
</script>
<style scoped lang="less">
.btnWrap {
  display: flex;
  div {
    flex: 1;
    margin: 0 4px;
  }
}

.dialog-demo {
  .weui-dialog {
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    height: 360px;
    width: 100%;
    overflow: hidden;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .btn-bottom {
    position: fixed !important;
    bottom: 20px;
  }
}
.checklistbtn {
  width: 100%;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 10px;
  box-sizing: border-box;
  z-index: 10000;
  background: #eee;
}
.popup1 {
  padding-bottom: 62px;
}
.search {
  /* width: 100%; */
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 10000;
  background: #eee;
}
.checkcontent {
  margin-top: 43px;
}
.receptionText .weui-textarea {
  text-align: right !important;
}
</style>


