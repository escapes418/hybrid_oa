<template>
  <div class="approval_apply">
    <group title="基本信息" label-margin-right="1em">
      <!-- <sinSelector sTitle='客户名称' :isRequired="true" sPlaceholder='请选择' @on-change="changeType" :dataList="dictionary.handleType" :sendData="applyData.custId" :selectedItem.sync="applyData.custId"></sinSelector> -->
      <!-- <RemoteSearch sTitle='客户名称' :isRequired="true" sPlaceholder='请选择' :rOption="custOptin" :sendData="applyData.custId" :selectedItem.sync="applyData.custId" ></RemoteSearch> -->
      <x-input
        title="客户名称"
        v-if="paramsType == 'jump'"
        v-model="applyData.custName"
        readonly
      ></x-input>
      <sinSelector
        sTitle="客户名称"
        v-else
        :isRequired="true"
        sPlaceholder="请选择客户名称"
        :dataList="custList"
        :sendData="applyData.custId"
        :selectedItem.sync="applyData.custId"
        @on-change="changeCust"
      ></sinSelector>
      <x-input
        title="项目名称"
        v-model.trim="applyData.projectName"
        :max="64"
        placeholder="请输入项目名称"
      >
        <span slot="label">项目名称<span class="required">*</span></span>
      </x-input>
      <!-- <sinSelector sTitle='企业名称' :isRequired="true" sPlaceholder='请选择' :dataList="dictionary.handleType" :sendData="applyData.companyHolderCode" :selectedItem.sync="applyData.companyHolderCode"></sinSelector> -->
      <RemoteSearch
        sTitle="企业名称"
        :isRequired="true"
        sPlaceholder="请选择企业名称"
        :rOption="holderOption"
        :sLabel="applyData.companyName"
        :sendData="applyData.companyHolderCode"
        :selectedItem.sync="applyData.companyHolderCode"
        @on-change="changeCompany"
      ></RemoteSearch>
      <mulSelectors
        sTitle="承运货物"
        :max="0"
        :isRequired="true"
        sPlaceholder="请选择承运货物"
        :dataList="dictionary.carrierGoods"
        :sendData="applyData.carrierGoods"
        :selectedItem.sync="applyData.carrierGoods"
      ></mulSelectors>
      <sinSelector
        sTitle="项目等级"
        :isRequired="true"
        sPlaceholder="请选择项目等级"
        :dataList="dictionary.projectLevel"
        :sendData="applyData.projectLevel"
        :selectedItem.sync="applyData.projectLevel"
      ></sinSelector>
      <sinSelector
        sTitle="项目类型"
        :isRequired="true"
        sPlaceholder="请选择项目类型"
        :dataList="dictionary.projectType"
        :sendData="applyData.projectType"
        :selectedItem.sync="applyData.projectType"
      ></sinSelector>
      <x-input
        title="计划月运费"
        v-model.number="applyData.transExpensesPlan"
        :max="15"
        placeholder="请输入计划月运费(万元/月)"
      >
        <span slot="label">计划月运费<span class="required">*</span></span>
      </x-input>
      <datetime
        format="YYYY-MM-DD"
        class="data-time"
        v-model="applyData.onlinePlanTime"
        title="计划上线时间"
        placeholder="请选择计划上线时间"
      >
        <span slot="title">计划上线时间<span class="required">*</span></span>
      </datetime>
      <departTree
        sTitle="实施负责人"
        :isPeople="true"
        sPlaceholder="请选择实施负责人"
        :dataList="impleLeaderList"
        :sendData="applyData.implyLeaderId"
        :selectedItem.sync="applyData.implyLeaderId"
      ></departTree>
      <x-textarea
        title="备注"
        v-model.trim="applyData.remarks"
        placeholder="请输入备注"
        :max="200"
        :rows="3"
      ></x-textarea>
    </group>

    <group title="一般要求" label-margin-right="1em">
      <sinSelector
        sTitle="开票方式"
        :isRequired="true"
        sPlaceholder="请选择开票方式"
        :dataList="dictionary.invoiceMode"
        :sendData="applyData.invoiceMode"
        :selectedItem.sync="applyData.invoiceMode"
      ></sinSelector>
      <x-input
        title="月开票频次"
        v-model.number="applyData.invoicingFrequency"
        placeholder="请输入计划月开票频次(次/月)"
        :max="5"
      >
        <span slot="label">月开票频次<span class="required">*</span></span>
      </x-input>
      <sinSelector
        sTitle="托管"
        :isRequired="true"
        sPlaceholder="请选择是否托管"
        :dataList="dictionary.yesNo"
        :sendData="applyData.projectTrusteeshipt"
        :selectedItem.sync="applyData.projectTrusteeshipt"
      ></sinSelector>
      <sinSelector
        sTitle="托管渠道"
        :isRequired="true"
        v-if="applyData.projectTrusteeshipt == 1"
        sPlaceholder="请选择托管渠道"
        :dataList="dictionary.trusteeshiptChannel"
        :sendData="applyData.trusteeshiptChannel"
        :selectedItem.sync="applyData.trusteeshiptChannel"
      ></sinSelector>
      <!-- <sinSelector sTitle='项目类型' :isRequired="true" sPlaceholder='请选择' @on-change="changeType" :dataList="dictionary.handleType" :sendData="applyData.projectType" :selectedItem.sync="applyData.projectType"></sinSelector> -->
    </group>
    <group title="特殊要求" label-margin-right="1em">
      <sinSelector
        sTitle="自营"
        :isRequired="true"
        sPlaceholder="请选择自营"
        :dataList="dictionary.yesNo"
        :sendData="applyData.selfMarketing"
        :selectedItem.sync="applyData.selfMarketing"
      ></sinSelector>
      <sinSelector
        sTitle="经纪人"
        :isRequired="true"
        sPlaceholder="请选择经纪人"
        :dataList="dictionary.yesNo"
        :sendData="applyData.projectAgent"
        :selectedItem.sync="applyData.projectAgent"
      ></sinSelector>
      <sinSelector
        sTitle="车队长"
        :isRequired="true"
        sPlaceholder="请选择车队长"
        :dataList="dictionary.yesNo"
        :sendData="applyData.truckLeader"
        :selectedItem.sync="applyData.truckLeader"
      ></sinSelector>
      <sinSelector
        sTitle="油气"
        :isRequired="true"
        sPlaceholder="请选择油气"
        :dataList="dictionary.oilGas"
        :sendData="applyData.oilGas"
        :selectedItem.sync="applyData.oilGas"
      ></sinSelector>
      <sinSelector
        sTitle="叫车"
        :isRequired="true"
        sPlaceholder="请选择叫车"
        :dataList="dictionary.yesNo"
        :sendData="applyData.callTruck"
        :selectedItem.sync="applyData.callTruck"
      ></sinSelector>
      <sinSelector
        sTitle="贸易"
        :isRequired="true"
        sPlaceholder="请选择贸易"
        :dataList="dictionary.yesNo"
        :sendData="applyData.projectTrade"
        :selectedItem.sync="applyData.projectTrade"
      ></sinSelector>
      <sinSelector
        sTitle="账期"
        :isRequired="true"
        sPlaceholder="请选择账期"
        :dataList="dictionary.yesNo"
        :sendData="applyData.accountPeriod"
        :selectedItem.sync="applyData.accountPeriod"
      ></sinSelector>
      <sinSelector
        sTitle="网商"
        :isRequired="true"
        sPlaceholder="请选择网商"
        :dataList="dictionary.yesNo"
        :sendData="applyData.networkBusiness"
        :selectedItem.sync="applyData.networkBusiness"
      ></sinSelector>
      <sinSelector
        sTitle="托盘"
        :isRequired="true"
        sPlaceholder="请选择托盘"
        :dataList="dictionary.yesNo"
        :sendData="applyData.projectTray"
        :selectedItem.sync="applyData.projectTray"
      ></sinSelector>
      <sinSelector
        sTitle="返点"
        :isRequired="true"
        sPlaceholder="请选择返点"
        :dataList="dictionary.yesNo"
        :sendData="applyData.returnPoint"
        :selectedItem.sync="applyData.returnPoint"
      ></sinSelector>
      <x-input
        title="返点比例(%)"
        v-if="applyData.returnPoint == '1'"
        v-model.number="applyData.returnPointProportion"
        placeholder="请输入返点比例"
        :max="8"
      >
        <span slot="label">返点比例(%)<span class="required">*</span></span>
      </x-input>
    </group>
    <group
      title="联系人信息"
      label-margin-right="1em"
      v-for="(item, index) in linkMan"
      :key="index"
    >
      <box gap="10px 15px">
        <div style="height:26px">
          <span class="fr font-orange" @click="delItem(index)">删除</span>
        </div>
      </box>
      <x-input
        title="联系人"
        placeholder="请输入联系人姓名"
        v-model.trim="item.linkmanName"
        :max="16"
      >
        <span slot="label">联系人<span class="required">*</span></span>
      </x-input>
      <x-input
        title="联系方式"
        placeholder="请输入联系人电话"
        v-model.number="item.linkmanPhone"
        :max="13"
      >
        <span slot="label">联系方式<span class="required">*</span></span>
      </x-input>
      <x-input title="职位" placeholder="请输入职位" v-model.trim="item.linkmanPost" :max="32">
        <span slot="label">职位<span class="required">*</span></span>
      </x-input>
      <x-textarea
        title="备注"
        placeholder="请输入备注"
        v-model.trim="item.remarks"
        :autosize="true"
        :max="200"
      ></x-textarea>
    </group>
    <!-- <div>{{ linkMan }}</div> -->
    <div class="add-btn">
      <span class="pointer" @click="addItem">添加联系人</span>
    </div>
    <box gap="10px 10px">
      <flexbox>
        <flexbox-item>
          <x-button type="primary" class="mt-15" :disabled="disSubmit" @click.native="submit"
            >提交申请</x-button
          >
        </flexbox-item>
        <!-- <flexbox-item v-if="paramsId ==0 ||(paramsId !=0 && expenseStatus == 4)">
                    <x-button type="default" class="mt-15" :disabled="disDraft" @click.native="draft">存为草稿</x-button>
                </flexbox-item> -->
      </flexbox>
    </box>
    <div v-transfer-dom>
      <confirm
        v-model="isSubmit"
        title="提交申请"
        @on-cancel="isSubmit = false"
        @on-confirm="submit(true)"
      >
        <p style="text-align:center;">{{ '确定执行操作?' }}</p>
      </confirm>
    </div>
  </div>
</template>
<script>
import api from '@/assets/api/index.api';
import com from '@/assets/js/common';
import { mapState, mapGetters } from 'vuex';
import sinSelector from '@/components/sinSelector';
import mulSelectors from '@/components/mulSelectors';
import departTree from '@/components/departTree.vue';
import RemoteSearch from '@/components/RemoteSearch.vue';
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
  name: 'ProjectApprovalApply',
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
    mulSelectors,
    RemoteSearch,
    departTree
    // AssignItem,
    // proSelector,
  },

  data: function() {
    return {
      isSubmit: false,
      paramsId: this.$route.params.id,
      paramsType: this.$route.params.type,
      expenseStatus: '',
      impleLeaderList: [],
      custOptin: {
        api: api.queryDailyCustMaintenance,
        params: {},
        search: 'custName',
        key: 'custId',
        value: 'custName'
      },
      holderOption: {
        api: api.queryCompanyName,
        params: {},
        search: 'companyName',
        key: 'holderCode',
        value: 'companyName'
      },
      linkMan: [
        {
          linkmanName: '', //联系人姓名
          linkmanPhone: '', //联系人电话
          linkmanPost: '', //联系人职位
          remarks: ''
        }
      ],
      applyData: {
        remarks: '',
        accountPeriod: '0', //账期：1是，2否
        // applyPerCode: "",//申请人编号
        // applyPerName: "",//申请人名称
        // applyTime: 0,//申请时间
        callTruck: '0', //叫车：1是，2否
        carrierGoods: [], //承运货物:1煤炭2钢铁3商砼4其他
        companyHolderCode: '', //企业holderCode
        companyName: '', //企业名称
        custId: '', //客户id
        // finishTaskTime: 0,//审批结束时间
        implyLeaderId: '', //实施负责人ID
        invoiceMode: '', //开票方式：1一票，2两票
        invoicingFrequency: '', //月开票频次（次/月）
        networkBusiness: '0', //网商：1是，2否
        // officeId: "",//所属部门ID
        // officeName: "",//所属部门名称
        oilGas: '1', //油气：1不做油气，2带油,3带气,4带油和气
        onlinePlanTime: '', //计划上线时间
        procCode: '', //流程编号
        procInsId: '', // 流程实例ID
        procName: '', // 流程编号
        projectAgent: '0', //项目经纪人：1是，2否
        projectApprovalLinkman: [
          {
            // commonId: "",//主键 id
            // linkmanMail: "",//联系人邮箱
            linkmanName: '', //联系人姓名
            linkmanPhone: '', //联系人电话
            linkmanPost: '', //联系人职位
            // linkmanType: "",//联系人类型：1立项联系人，2项目联系人
            remarks: ''
          }
        ],
        // projectApprovalStatus: "",//项目批准状态
        projectLevel: '', //项目等级abcd
        projectName: '', //项目名称
        projectTrade: '0', //贸易：1是，2否 ,
        projectTray: '0', //项目托盘：1是，2否 ,
        projectTrusteeshipt: '', //项目托管：1是，2否 ,
        projectType: '1', //项目类型0公司项目1市场项目 ,
        returnPoint: '0', //返点：1是，2否 ,
        returnPointProportion: '', //返点比例（%）
        selfMarketing: '0', //自营：1是，2否 ,
        transExpensesPlan: '', //计划月运费(万元)
        truckLeader: '0', //车队长：1是，2否
        trusteeshiptChannel: '1' //托管渠道：1华夏，2兴业
      },
      baseInfo: {
        userName: ''
      },
      dictionary: {
        resourcesType: [],
        handleType: [],

        carrierGoods: [],
        projectType: [],
        invoiceMode: [],
        oilGas: [],
        projectLevel: [],
        trusteeshiptChannel: [],
        yesNo: []
      },
      custList: [],
      disDraft: false,
      disSubmit: false
    };
  },
  computed: {},
  created() {
    this.init();
    this.getDictionary();
    this.getTreeList();
    this.getcustList();
    // com.addKeepAlive(this) //添加keep-alive
  },
  watch: {},
  mounted() {},
  methods: {
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
        this.dictionary.resourcesType = selectDic(getData, 'resources_type'); //资源类型
        this.dictionary.handleType = selectDic(getData, 'handle_type'); //办理类型
        this.dictionary.carrierGoods = selectDic(getData, 'carrier_goods');
        this.dictionary.invoiceMode = selectDic(getData, 'invoice_mode');
        this.dictionary.oilGas = selectDic(getData, 'oil_gas');
        this.dictionary.projectLevel = selectDic(getData, 'project_level');
        this.dictionary.trusteeshiptChannel = selectDic(getData, 'trusteeshipt_channel');
        this.dictionary.yesNo = selectDic(getData, 'yes_no');
        this.dictionary.projectType = selectDic(getData, 'project_type');
      });
    },
    getTreeList() {
      com.covertHttp(api.orgAndUserInfo, { queryType: '2' }).then(rtn => {
        var list = com.addTreePeopel(rtn.data);
        var peopelList = com.hasChildren(list);
        this.impleLeaderList = com.clone(peopelList);
      });
    },
    init() {
      com.comGetStorage('userInfo').then(res => {
        this.baseInfo = res;
      });
      if (this.$route.params.type == 'apply') {
        // 新增
      } else if (this.$route.params.type == 'jump') {
        com
          .covertHttp(api.custInfoDetail, {
            id: this.$route.params.id
          })
          .then(rtn => {
            this.applyData.custId = this.$route.params.id;
            this.applyData.custName = rtn.data.custName;
            this.applyData.projectName = rtn.data.custName;
            this.linkMan = [];
            rtn.data.custLinkmanResponse.forEach((item, index) => {
              this.linkMan.push({
                linkmanName: item.linkmanName, //联系人姓名
                linkmanPhone: item.linkmanPhone, //联系人电话
                linkmanPost: item.linkmanPost, //联系人职位
                remarks: item.remarks
              });
            });
          });
      } else if (this.$route.params.type == 'edit') {
        // 编辑
        this.applyData.id = this.$route.params.id;
        // return
        this.getDetail().then(rtnData => {
          this.applyData = rtnData.projectApprovalFlowResp;
          // 基础参数赋值

          this.applyData.onlinePlanTime = com.timeFormat(
            rtnData.projectApprovalFlowResp.onlinePlanTime
          );
          this.linkMan = rtnData.projectApprovalFlowResp.projectApprovalLinkman || [
            {
              linkmanName: '', //联系人姓名
              linkmanPhone: '', //联系人电话
              linkmanPost: '', //联系人职位
              remarks: ''
            }
          ];
          console.log(this.applyData);
        });
      }
    },
    getDetail() {
      return new Promise((resolve, reject) => {
        com
          .covertHttp(api.projectflowdetail, {
            projectApprovalFlowId: this.$route.params.id
          })
          .then(rtn => {
            resolve(rtn.data);
          });
      });
    },
    getcustList() {
      var _this = this;
      com.covertHttp(api.queryMyCustInfos).then(rtn => {
        rtn.data.forEach(function(item, index) {
          _this.custList.push({
            ...item,
            value: item.custName,
            key: item.custId
          });
        });
      });
    },
    changeCust() {
      this.custList.forEach((item, index) => {
        if (item.custId == this.applyData.custId) {
          this.applyData.projectName = item.custName;
          this.linkMan = [];
          item.custLinkman.forEach((itm, idx) => {
            this.linkMan.push({
              linkmanName: itm.linkmanName, //联系人姓名
              linkmanPhone: itm.linkmanPhone, //联系人电话
              linkmanPost: itm.linkmanPost, //联系人职位
              remarks: itm.remarks
            });
          });
        }
      });
    },
    addItem() {
      var arr = com.clone(this.linkMan);
      arr.push({
        linkmanName: '', //联系人姓名
        linkmanPhone: '', //联系人电话
        linkmanPost: '', //联系人职位
        remarks: ''
      });
      this.linkMan = arr;
    },
    delItem(index) {
      var _this = this;
      this.$vux.confirm.show({
        title: '是否删除？',
        onCancel() {},
        onConfirm() {
          if (_this.linkMan.length > 1) {
            _this.linkMan.splice(index, 1);
          } else {
            _this.$vux.toast.text('无法继续删除');
          }
        }
      });
    },
    submit() {
      var _this = this;
      if (!Utils.valid(this)) return; //校验
      if (!Utils.vailLinkMan(this)) return; //校验
      var postData = {
        ...this.applyData,
        projectApprovalLinkman: this.linkMan,
        onlinePlanTime: com.timeParse(this.applyData.onlinePlanTime)
      };
      this.disSubmit = true;
      this.$vux.confirm.show({
        title: '提交申请',
        content: '确定执行操作？',
        onCancel() {
          _this.disSubmit = false;
        },
        onConfirm() {
          _this.handleApply(postData);
        }
      });
    },
    handleApply(postData) {
      var _this = this;
      com
        .covertHttp(api.projectApprovalApply, {
          ...postData
        })
        .then(rtn => {
          if (rtn.status == 0) {
            this.$router.push({ path: '/userIndex' });
            com.delKeepAlive(this, [
              'TaskOption',
              'UserIndex',
              'ProjectApprovalListRecived',
              'ProjectApprovalListSend'
            ]);
          }
          _this.disSubmit = false;
        });
    },
    draft() {
      // var AssignData = this.validAssign();
      if (!Utils.valid(this)) return; //校验
      if (!Utils.vailLinkMan(this)) return; //校验
      this.disDraft = true;
      var postData = {
        ...this.applyData,
        onlinePlanTime: com.timeParse(this.applyData.onlinePlanTime)
      };
      var id = this.$route.params.id == 0 ? '' : this.$route.params.id;
      com
        .covertHttp(api.saveResourcesHandleInfo, {
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
              'ProjectApprovalListRecived',
              'ProjectApprovalListSend'
            ]);
          } else {
          }
          this.disDraft = false;
        });
    },
    changProject() {
      this.projectNameOpt.forEach((item, index) => {
        if (item.key == this.applyData.projectId) {
          this.applyData.projectPersonel = item.projectLeaderName;
        }
      });
    },
    changeCompany(el) {
      // this.applyData.companyName = el.companyName
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
}
</style>

