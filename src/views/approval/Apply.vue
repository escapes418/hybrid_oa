<template>
  <div class="approval_apply">
    <div class="approvalprompt">
      <x-icon type="ios-information" size="25"></x-icon>
      <div class="font-orange">若选择项目，则费用归属项目，不选择，则该费用归属个人</div>
    </div>
    <group title="报销申请" label-margin-right="1em">
      <!-- 基本读取信息 START -->
      <x-input
        title="报销人"
        readonly
        :value="baseInfo.userName"
        placeholder="请输入报销人姓名"
      ></x-input>
      <datetime
        format="YYYY-MM-DD"
        class="data-time"
        v-model="baseInfo.applyTime"
        title="报销时间"
        placeholder="请选择开始时间"
        readonly
      ></datetime>
      <departTree
        sTitle="成本中心"
        :isRequired="true"
        sPlaceholder="请选择"
        v-if="useCostCenter"
        :dataList="costCenterList"
        :sendData="approvalForm.costCenterId"
        :selectedItem.sync="approvalForm.costCenterId"
      ></departTree>
      <x-input title="成本中心" v-if="!useCostCenter" readonly :value="costCenterName"></x-input>
      <!-- <x-input
        title="所属部门"
        readonly
        :value="baseInfo.officeName"
        placeholder="请选择所属部门"
      ></x-input> -->
      <!-- 基本读取信息 END -->
      <sinSelector1
        sTitle="报销类型"
        :isRequired="true"
        sPlaceholder="请选择"
        @on-change="changeType"
        :dataList="dictionary.oaExpenseType"
        :sendData="approvalForm.applyType"
        :selectedItem.sync="approvalForm.applyType"
      ></sinSelector1>
      <x-input
        title="关联申请"
        v-if="approvalForm.applyType != 1"
        :value="relationThemeName"
        placeholder="请选择"
        @click.native="themeShow = true"
        readonly
      >
        <span slot="label">关联申请<span class="required">*</span></span>
      </x-input>
      <proSelector
        sTitle="关联项目"
        v-if="approvalForm.applyType == 1"
        sPlaceholder="请选择"
        :sendData="approvalForm.projectId"
        :selectedItem.sync="approvalForm.projectId"
      ></proSelector>
      <x-input
        title="项目名称"
        v-if="approvalForm.applyType != 1"
        :value="approvalForm.projectLabel"
        readonly
      ></x-input>
      <x-input
        title="报销分类"
        v-if="approvalForm.applyType == 3"
        :value="approvalForm.travelExpenseTypeListName"
        readonly
      ></x-input>
      <x-input
        title="随行人员"
        v-if="approvalForm.applyType == 3"
        :value="approvalForm.entourageListName"
        readonly
      ></x-input>
      <!-- <RelEmployees
        sTitle="陪客人员"
        :isRequired="true"
        v-if="approvalForm.applyType == 2"
        sPlaceholder="请选择"
        :dataList="employeesList"
        :sendData="approvalForm.employees"
        :selectedItem.sync="approvalForm.employees"
      >
      </RelEmployees> -->
      <multree
        v-if="approvalForm.applyType == 2"
        sTitle="陪客人员"
        :isRequired="true"
        :isPeople="true"
        sPlaceholder="请选择"
        :dataList="recPelpleList"
        :sendData="approvalForm.employees"
        :selectedItem.sync="approvalForm.employees"
      ></multree>
      <sinSelector3
        sTitle="发票公司"
        :isRequired="true"
        sPlaceholder="请选择"
        :dataList="taxCityList"
        :sendData="approvalForm.taxCity"
        :selectedItem.sync="approvalForm.taxCity"
      ></sinSelector3>
      <x-textarea
        title="接待客户情况"
        v-if="approvalForm.applyType == 2"
        v-model="approvalForm.customerSituation"
        placeholder="请输入接待客户情况"
        :max="600"
        :rows="3"
      ></x-textarea>
      <x-textarea
        title="备注"
        v-model="approvalForm.remarks"
        placeholder="请输入备注"
        :max="700"
        :rows="3"
      ></x-textarea>
    </group>
    <group
      title="报销明细"
      label-margin-right="1em"
      v-for="(item, index) in itemDatas"
      :key="index"
    >
      <ReimItem ref="reimItem" :index="index" :itemData="item"></ReimItem>
    </group>
    <div class="add-btn">
      <span class="pointer" @click="addItem">新增报销明细</span>
    </div>
    <group title="预览汇总" label-margin-right="1em">
      <cell title="总额" :value="preExpenseAmt | thousands(2)" value-align="left"></cell>
      <cell title="票据数量" :value="preBillNum" value-align="left"></cell>
      <cell title="大写金额" :value="preExpenseAmt | bigMoney" value-align="left"></cell>
    </group>
    <box gap="10px 10px">
      <flexbox>
        <flexbox-item>
          <x-button type="primary" class="mt-15" :disabled="disSubmit" @click.native="submit"
            >提交申请</x-button
          >
        </flexbox-item>
        <flexbox-item v-if="paramsId == 0 || (paramsId != 0 && expenseStatus == 4)">
          <x-button type="default" class="mt-15" :disabled="disDraft" @click.native="draft"
            >存为草稿</x-button
          >
        </flexbox-item>
      </flexbox>
    </box>
    <div v-transfer-dom>
      <confirm
        v-model="isSubmit"
        title="提交报销申请"
        @on-cancel="isSubmit = false"
        @on-confirm="submit"
      >
        <p style="text-align:center;">{{ '确定执行操作?' }}</p>
      </confirm>
    </div>
    <!-- 关联申请 START -->
    <div v-transfer-dom>
      <popup v-model="themeShow" height="100%">
        <div class="popup1">
          <group v-if="themelistData.length != 0">
            <cell-box
              v-for="(el, index) in themelistData"
              :key="index"
              @click.native="themeProcCb(index)"
            >
              <div class="w-100">
                <div class="disc-text">
                  <div class="long-content">
                    <span class="disc-title long-title">流程编号</span>
                    <span class="long-text">{{ el.procCode }}</span>
                  </div>
                  <div class="long-content">
                    <span class="disc-title long-title">关联主题</span>
                    <span class="long-text">{{ el.procName }}</span>
                  </div>
                  <div class="long-content" v-if="el.projectName">
                    <span class="disc-title long-title">项目名称</span>
                    <span class="long-text">{{ el.projectName }}</span>
                  </div>
                  <div class="long-content">
                    <span class="disc-title long-title">申请人</span>
                    <span class="long-text">{{ el.applyPerName }}</span>
                  </div>
                  <div class="long-content">
                    <span class="disc-title long-title">费用合集</span>
                    <span class="long-text font-orange">{{ el.budgetTotal }}</span>
                  </div>
                </div>
              </div>
            </cell-box>
          </group>
          <div class="add-btn mb-15" v-if="loadThemeMore">
            <span class="pointer" @click="clickLoadMore()">点击加载更多</span>
          </div>
          <div class="pointout" v-if="themelistData.length == 0">
            <icon type="info" is-msg class="pointout-icon"></icon>
            <div class="mt-10">暂无数据</div>
          </div>
        </div>
      </popup>
      <box class="checklistbtn" v-if="themeShow">
        <flexbox>
          <flexbox-item>
            <x-button type="primary" @click.native="themeShow = false">取消</x-button>
          </flexbox-item>
        </flexbox>
      </box>
    </div>
    <!-- 关联接待申请 END -->
  </div>
</template>
<script>
import api from '@/assets/api/index.api';
import com from '@/assets/js/common';
import ReimItem from '@/components/ReimItem';
import sinSelector from '@/components/sinSelector';
import mulSelector from '@/components/mulSelector';
import departTree from '@/components/departTree.vue';
import multree from '@/components/multree.vue';
import proSelector from '@/components/proSelector';
import XHR from '@/assets/js/XHR';
import Utils from './utils';

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
export default {
  name: 'EditApproval',
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
    ReimItem,
    multree,
    departTree,
    sinSelector1: sinSelector,
    sinSelector2: sinSelector,
    sinSelector3: sinSelector,
    RelReceptionApply: sinSelector,
    RelEmployees: mulSelector,
    proSelector: proSelector
  },

  data: function() {
    return {
      isSubmit: false,
      paramsId: this.$route.params.id || '',
      expenseStatus: '',
      approvalForm: {
        id: '',
        procInsId: '',
        taskId: '',

        projectLabel: '',
        applyType: 1, // 报销类型 1：常规 2：接待 3:出差
        relationTheme: '', // 关联接待申请code
        employees: [], // 人员手机号数组
        customerSituation: '',
        costCenterId: '',
        projectId: '', // 关联项目
        taxCity: '', // 发票城市
        remarks: '' // 备注
      },
      initData: {
        startDate: com.timeFormat(new Date().getTime()),
        startPoint: ['420000', '420100'],
        endDate: com.timeFormat(new Date().getTime() + 86400000),
        endPoint: ['420000', '420100'],

        subject: [],
        subConfList: [],

        personNum: 1,
        dayNum: 1,
        billNum: '',
        expenseAmt: '',
        remarks: ''
      },
      baseInfo: {
        userName: '',
        applyTime: com.timeFormat(new Date().getTime()) // 申请时间
      },

      themeShow: false, // 控制接待申请显示/隐藏
      relationThemeName: '', // 主题名称显示用

      employeesList: [], // 陪客人员list数组
      recPelpleList: [],
      costCenterList: [],
      themelistData: [], // 接待申请list数组

      taxCityList: [], // 发票城市list数组
      theme: {
        pageNo: 1, //当前页数,
        pageTotal: 1,
        pageSize: 10, //固定常量
        count: -1
      },
      dictionary: {
        oaExpenseType: []
      },
      disDraft: false,
      disSubmit: false,
      useCostCenter: true,
      costCenterName: ''
    };
  },
  computed: {
    ...mapState({
      itemDatas: state => state.itemDatas,
      subsList: state => state.subsList,
      addressData: state => state.addressData,
      subjectData: state => state.subjectList
    }),
    ...mapGetters(['preBillNum', 'preExpenseAmt']),
    loadThemeMore() {
      if (this.theme.pageNo >= this.theme.pageTotal) {
        return false;
      } else {
        return true;
      }
    }
  },
  created() {
    this.$store.dispatch('delallItemDatas', {}); // 清空所有数组
    this.init();
    this.getDictionary();
    this.getThemeList(); //主题
    // this.getReceptionistList(); // 接待主题
    this.getDict(2); // 发票列表
    this.getTreeList();
    if (this.addressData.length == 0) this.$store.dispatch('getAddressList');
    if (this.subjectData.length == 0) this.$store.dispatch('getSubjectList');
    // com.addKeepAlive(this) //添加keep-alive
  },
  methods: {
    getDict(type) {
      com
        .covertHttp(api.queryDictInfo, {
          dictType: 'tax_city'
        })
        .then(rtn => {
          rtn.data.forEach((item, index) => {
            this.taxCityList.push({
              ...item,
              value: item.label,
              key: item.value
            });
          });
        });
    },
    // 获取陪客人员列表
    getReceptionistList() {
      var _this = this;
      com.covertHttp(api.escortEmployee).then(rtn => {
        rtn.data.forEach(function(item, index) {
          _this.employeesList.push({
            ...item,
            value: item.name,
            key: item.loginName
          });
        });
      });
    },
    getTreeList() {
      com.covertHttp(api.orgAndUserInfo, { queryType: '1' }).then(rtn => {
        this.costCenterList = com.hasChildren(rtn.data);
      });
      com.covertHttp(api.orgAndUserInfo, { queryType: '2' }).then(rtn => {
        var list = com.addTreePeopel(rtn.data);
        var peopelList = com.hasChildren(list);
        this.recPelpleList = com.clone(peopelList);
      });
    },
    changeType() {
      this.approvalForm.relationTheme = '';
      this.relationThemeName = '';
      this.approvalForm.projectLabel = '';
      this.approvalForm.projectId = '';
      this.approvalForm.customerSituation = '';
      this.approvalForm.employees = [];
      this.theme.pageNo = 1;
      this.theme.pageTotal = 1;
      this.theme.pageSize = 10;
      this.theme.count = -1;
      this.getThemeList();
    },
    // 获取关联主题的任务信息
    getThemeList() {
      com
        .covertHttp(api.flowRevencelist, {
          pageNo: this.theme.pageNo,
          pageSize: this.theme.pageSize,
          applyType: this.approvalForm.applyType
        })
        .then(res => {
          this.themelistData = res.data.list || [];
          this.theme.count = parseInt(res.data.total) || 0;
          this.theme.pageTotal = Math.ceil(this.theme.count / this.theme.pageSize);
        });
    },
    clickLoadMore() {
      this.theme.pageNo = this.theme.pageNo + 1;
      com
        .covertHttp(api.flowRevencelist, {
          pageNo: this.theme.pageNo,
          pageSize: this.theme.pageSize,
          applyType: this.approvalForm.applyType
        })
        .then(res => {
          this.themelistData.push(...res.data.list);
          this.theme.count = parseInt(res.data.total) || 0;
          this.theme.pageTotal = Math.ceil(this.theme.count / this.theme.pageSize);
        });
    },
    // 获取详情
    getDetail() {
      return new Promise((resolve, reject) => {
        com
          .covertHttp(api.getApprovalDetail, {
            expenseFlowId: this.approvalForm.id
          })
          .then(rtn => {
            resolve(rtn.data);
          });
      });
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
        this.dictionary.oaExpenseType = selectDic(getData, 'oa_expense_type'); //紧急度
      });
    },
    init() {
      com.comGetStorage('userInfo').then(res => {
        this.baseInfo = Object.assign({}, this.baseInfo, res);
        this.approvalForm.costCenterId = this.baseInfo.officeId;
      });
      if (this.$route.params.id == 0) {
        // 新增
        this.addItem();
      } else {
        // 编辑
        // 处理编辑逻辑
        this.approvalForm.id = this.$route.params.id;
        this.getDetail().then(rtnData => {
          // 基础参数赋值
          this.approvalForm = Object.assign(
            {},
            {
              id: rtnData.detail.id,
              procInsId: rtnData.detail.procInsId,
              costCenterId: rtnData.detail.costCenterId,
              taskId: rtnData.detail.taskId || '',

              taxCity: rtnData.detail.taxCity,
              remarks: rtnData.detail.remarks,

              projectId: rtnData.detail.projectId,
              applyType: rtnData.detail.applyType,
              employees: rtnData.detail.employees,
              relationTheme: rtnData.detail.relationTheme,
              projectLabel: rtnData.detail.projectLabel,
              customerSituation: rtnData.detail.customerSituation
            }
          );
          this.costCenterName = rtnData.detail.costCenterName;
          if (rtnData.detail.travelExpenseTypeListName) {
            this.approvalForm.travelExpenseTypeListName = rtnData.detail.travelExpenseTypeListName.join(
              ', '
            );
          }
          if (rtnData.detail.entourageListName) {
            this.approvalForm.entourageListName = rtnData.detail.entourageListName.join(', ');
          }
          this.relationThemeName = rtnData.detail.relationThemeName;
          this.expenseStatus = rtnData.detail.expenseStatus;

          this.baseInfo.applyTime = rtnData.detail.applyTime;
          var itemDatas = rtnData.flowDetailList || []; //兼容性处理，如果没有图片，则图片数组赋值一个空数组
          itemDatas.forEach((val, idx) => {
            if (!val.subConfList) val.subConfList = [];
            if (val.subject[1] == 'no_') val.subject = [];
          });
          var newItemDatas = com.ObjToStamp(itemDatas, ['startDate', 'endDate']);
          // 动态参数赋值
          this.$store.dispatch('fullItemDatas', newItemDatas);
          this.getThemeList();
          if (com.timeParse(rtnData.detail.applyTime) < 1562601600000) {
          //2019-07-09 00:00
            this.useCostCenter = false;
          }
        });
      }
    },
    addItem() {
      if (this.itemDatas.length >= 30) {
        this.$vux.toast.text('添加明细不能超过30条');
        return;
      }
      var obj = com.clone(this.initData);
      this.$store.dispatch('addItemDatas', obj);
    },
    valid() {
      // 整体校验
      var flag = true,
        _this = this;
      if (!Utils.valid(this)) return (flag = false); //检验申请基本信息
      for (var i in _this.itemDatas) {
        //检验明细
        if (!_this.$refs.reimItem[i].componentsValid()) return (flag = false);
      }
      return flag;
    },
    submit() {
      var _this = this;
      if (!this.valid()) return; //校验
      this.disSubmit = true;
      this.$vux.confirm.show({
        title: '提交报销申请',
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
      // 克隆数据，防止提交时数据发生变化 / 操作提交数据，应放在所有校验逻辑之后[基本常识]
      // if (!this.valid()) return;
      // var itemDatas = JSON.parse(JSON.stringify(this.itemDatas)); // 克隆待处理的提交数据
      var postData = {
        ...this.approvalForm,
        expenseDetail: com.changeItemtimestamp(this.itemDatas, ['startDate', 'endDate'])
      };
      com
        .covertHttp(api.editApproval, {
          ...postData
        })
        .then(rtn => {
          if (rtn.status == 0) {
            this.$vux.toast.text(rtn.message || '申请发起成功');
            this.$router.push({ path: '/userIndex' });
            com.delKeepAlive(this, [
              'TaskOption',
              'ApprovalListRecived',
              'ApprovalListSend',
              'UserIndex'
            ]);
          }
          this.disSubmit = false;
        });
    },
    draft() {
      if (!this.valid()) return;
      this.disDraft = true;
      // var itemDatas = JSON.parse(JSON.stringify(this.itemDatas)); // 克隆待处理的提交数据
      var postData = {
        ...this.approvalForm,
        expenseDetail: com.changeItemtimestamp(this.itemDatas, ['startDate', 'endDate'])
      };
      var id = this.$route.params.id == 0 ? '' : this.$route.params.id;
      com
        .covertHttp(api.saveExpenseInfo, {
          ...postData,
          id: id
        })
        .then(rtn => {
          if (rtn.status == 0) {
            this.$vux.toast.text(rtn.message || '申请发起成功');
            // this.$router.push({ path: '/userIndex' });
            com.delKeepAlive(this, [
              'TaskOption',
              'ApprovalListRecived',
              'ApprovalListSend',
              'UserIndex'
            ]);
          }
          this.disDraft = false;
        });
    },
    // 关联申请
    themeProcCb(idx) {
      this.approvalForm.relationTheme = this.themelistData[idx].procCode;
      this.relationThemeName = this.themelistData[idx].procName;
      this.themeShow = false;
      this.approvalForm.projectLabel = this.themelistData[idx].projectName;
      if (this.themelistData[idx].travelExpenseTypeListName) {
        this.approvalForm.travelExpenseTypeListName = this.themelistData[
          idx
        ].travelExpenseTypeListName.join(', ');
      }
      if (this.themelistData[idx].entourageListName) {
        this.approvalForm.entourageListName = this.themelistData[idx].entourageListName.join(', ');
      }
    }
  }
};
</script>
<style scoped lang="less">
.approval_apply {
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
  .popup1 {
    padding-bottom: 62px;
  }
  .weui-cells {
    margin-top: 0 !important;
  }
  .vux-no-group-title {
    margin-top: 0 !important;
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
  .approvalprompt {
    width: 100%;
    background: rgb(253, 247, 237);
    font-size: 12px;
    box-sizing: border-box;
    padding: 8px 15px 8px 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    fill: orange;
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

.pointout .pointout-icon {
  padding-top: 150px;
  display: block;
  text-align: center;
  background: #eee;
  // border: 1px solid #eee;
  // .weui-cells:before{
  //     border:none;
  // }
}
.pointout div {
  background: #eee;
  padding-top: 20px;
  text-align: center;
  border: 1px solid #eee;
}
</style>

