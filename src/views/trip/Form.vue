<template>
  <div class="approval_apply">
    <group title="出差申请" label-margin-right="1em">
      <x-input title="申请人" :value="baseInfo.userName" readonly></x-input>
      <datetime
        format="YYYY-MM-DD"
        class="data-time"
        v-model="baseInfo.currentDate"
        title="申请时间"
        placeholder="请选择时间"
        readonly
      ></datetime>
      <x-input
        title="所属部门"
        :value="baseInfo.officeName"
        placeholder="请选择所属部门"
        readonly
      ></x-input>
      <relatedType
        sTitle="关联类型"
        :isRequired="true"
        sPlaceholder="请选择类型"
        :dataList="relatedTypeJSON"
        :sendData="approvalForm.relType"
        :selectedItem.sync="approvalForm.relType"
        @update:selectedItem="typeSlted"
        @on-change="changeType"
      ></relatedType>
      <!-- 关联主题 -->
      <x-input
        title="关联主题"
        v-if="approvalForm.relType == 1"
        :value="relationThemeName"
        placeholder="请选择"
        @click.native="openTheme = true"
        readonly
      >
        <span slot="label" class="mr-10">关联主题<span class="required">*</span></span>
      </x-input>
      <!-- 关联项目 -->
      <div v-if="approvalForm.relType == 2">
        <proSelector
          :isRequired="true"
          sTitle="关联项目"
          sPlaceholder="请选择项目"
          :sendData="approvalForm.projectId"
          :selectedItem.sync="approvalForm.projectId"
          @on-change="projectSlted(approvalForm.projectId)"
          :sLabel="approvalForm.projectName"
        ></proSelector>
      </div>
      <x-input
        title="项目名称"
        v-if="approvalForm.relType == 1"
        :value="procName"
        placeholder=""
        readonly
      ></x-input>
      <x-input
        title="项目负责人"
        v-if="approvalForm.relType == 1 || approvalForm.relType == 2"
        :value="projectLeaderName"
        placeholder=""
        readonly
      ></x-input>
      <mulSelectors
        sTitle="报销分类"
        :isRequired="true"
        :max="0"
        sPlaceholder="请选择"
        :dataList="dictionary.travelExpenseType"
        :sendData="approvalForm.travelExpenseTypeList"
        :selectedItem.sync="approvalForm.travelExpenseTypeList"
      ></mulSelectors>
      <!-- <mulSelectors sTitle='随行人员' :max="0" sPlaceholder='请选择' :dataList="peopelList" :sendData="approvalForm.entourageList" :selectedItem.sync="approvalForm.entourageList"></mulSelectors> -->
      <multree
        sTitle="随行人员"
        :isPeople="true"
        sPlaceholder="请选择"
        :dataList="peopelList"
        :sendData="approvalForm.entourageList"
        :selectedItem.sync="approvalForm.entourageList"
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
      :title="'出差明细' + (index + 1)"
      label-margin-right="1em"
      v-for="(item, index) in itemDatas"
      :key="index"
    >
      <recItem ref="recItem" :itemData="item" :index="index" :items="itemDatas"></recItem>
    </group>
    <div class="add-btn">
      <span class="pointer" @click="addItem">新增明细</span>
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
        <flexbox-item v-if="paramsId == 0">
          <x-button type="default" class="mt-15" :disabled="disDraft" @click.native="draft"
            >存为草稿</x-button
          >
        </flexbox-item>
      </flexbox>
    </box>
    <div v-transfer-dom>
      <confirm
        v-model="isSubmit"
        title="提交出差申请"
        @on-cancel="isSubmit = false"
        @on-confirm="submit(true)"
      >
        <p style="text-align:center;">{{ '确定执行操作?' }}</p>
      </confirm>
    </div>
    <!-- 关联主题 -->
    <div v-transfer-dom>
      <popup v-model="openTheme" height="100%">
        <div class="popup1">
          <group v-if="relatedThemeJSON.length != 0">
            <cell-box
              v-for="(el, index) in relatedThemeJSON"
              :key="index"
              @click.native="themeConfirm(index)"
            >
              <div class="w-100">
                <div class="disc-text">
                  <div class="long-content">
                    <span class="disc-title long-title">流程编号</span>
                    <span class="long-text">{{ el.procCode }}</span>
                  </div>
                  <div class="long-content">
                    <span class="disc-title long-title">招待主题</span>
                    <span class="long-text">{{ el.procName }}</span>
                  </div>
                  <div class="long-content">
                    <span class="disc-title long-title">申请人</span>
                    <span class="long-text">{{ el.applyPerName }}</span>
                  </div>
                  <div class="long-content">
                    <span class="disc-title long-title">发起类型</span>
                    <span class="long-text font-orange">{{ el.handleTypeValue }}</span>
                  </div>
                </div>
              </div>
            </cell-box>
          </group>
          <div class="add-btn mb-15" v-if="loadThemeMore">
            <span class="pointer" @click="clickLoadMore()">点击加载更多</span>
          </div>
          <div class="pointout" v-if="relatedThemeJSON.length == 0">
            <icon type="info" is-msg class="pointout-icon"></icon>
            <div class="mt-10">暂无数据</div>
          </div>
        </div>
      </popup>
      <box class="checklistbtn" v-if="openTheme">
        <flexbox>
          <flexbox-item>
            <x-button type="primary" @click.native="openTheme = false">取消</x-button>
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
import sinSelector from '@/components/sinSelector';
import proSelector from '@/components/proSelector';
import mulSelectors from '@/components/mulSelectors';
import multree from '@/components/multree.vue';
import XHR from '@/assets/js/XHR';
import Utils from './utils';
import { mapState, mapGetters } from 'vuex';
import {
  Picker,
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
  name: 'TripForm',
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
    Picker,
    XDialog,
    recItem,
    multree,
    relationTheme: sinSelector,
    relationProject: sinSelector,
    relatedType: sinSelector,
    proSelector: proSelector,
    mulSelectors
  },

  data: function() {
    return {
      isSubmit: false,
      openTheme: false,
      relationTheme: '',
      baseInfo: {}, // 本地取申请人信息
      paramsId: this.$route.params.id,
      approvalForm: {
        id: '',
        procCode: '',
        procInsId: '',

        relType: 2, //关联类型(1:关联主题 2：关联项目)

        projectId: '', // 关联项目id
        relationTheme: '', // 关联主题id
        remarks: '',
        entourageList: [],
        travelExpenseTypeList: []
      },
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
      procName: '',
      relatedTypeJSON: [
        { key: '2', value: '关联项目' },
        { key: '1', value: '关联主题' },
        { key: '3', value: '不关联' }
      ],
      relatedThemeJSON: [], // 关联主题JSON
      relatedProjectJSON: [], // 关联项目JSON
      projectLeaderName: '',
      relationThemeName: '',
      projectName: false,
      theme: {
        pageNo: 1, //当前页数,
        pageTotal: 1,
        pageSize: 10, //固定常量
        count: -1
      },
      peopelList: [],
      dictionary: {
        travelExpenseType: []
      },
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
    ...mapGetters(['preExpenseAmt']),
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
    this.getThemeList();
    if (this.addressData.length == 0) this.$store.dispatch('getAddressList');
    if (this.subjectData.length == 0) this.$store.dispatch('getSubjectList');
    // this.getPeopelList();
    this.getTreeList();
    this.getDictionary();
    // com.addKeepAlive(this) //添加keep-alive
  },
  async mounted() {
    // 项目控件赋值
    let projectRtn = await Utils.getProjectJSON();
    this.relatedProjectJSON = projectRtn; // 数组不能整体赋值，只能展开后push

    // 主题控件赋值
    // let themeRtn = await Utils.getThemeJSON();
    // this.relatedThemeJSON = themeRtn;
  },
  methods: {
    // 回调：选择关联项目
    getThemeList() {
      //获取关联主题
      com
        .covertHttp(api.resourcesRelationHandleFlowList, {
          pageNo: this.theme.pageNo,
          pageSize: this.theme.pageSize
        })
        .then(res => {
          this.relatedThemeJSON = res.data.list || [];
          this.theme.count = parseInt(res.data.total) || 0;
          this.theme.pageTotal = Math.ceil(this.theme.count / this.theme.pageSize);
        });
    },
    getPeopelList() {
      com.covertHttp(api.escortEmployee).then(rtn => {
        rtn.data.forEach((item, index) => {
          this.peopelList.push({
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
        this.peopelList = com.clone(peopelList);
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
        this.dictionary.travelExpenseType = selectDic('travel_expense_type'); //异常情况
      });
    },
    clickLoadMore() {
      this.theme.pageNo = this.theme.pageNo + 1;
      com
        .covertHttp(api.resourcesRelationHandleFlowList, {
          pageNo: this.theme.pageNo,
          pageSize: this.theme.pageSize
        })
        .then(res => {
          this.relatedThemeJSON = res.data.list || [];
          this.theme.count = parseInt(res.data.total) || 0;
          this.theme.pageTotal = Math.ceil(this.theme.count / this.theme.pageSize);
        });
    },
    projectSlted(val) {
      this.projectLeaderName = Utils.getJSONValueByCompare(
        'key',
        'projectLeaderName',
        val,
        this.relatedProjectJSON
      );
    },
    // 回调：选择关联类型
    typeSlted(val) {
      if (val == 1) {
        if (this.relatedThemeJSON.length > 0) return;
        // 获取关联主题JSON
      }
    },
    async init() {
      this.baseInfo = await Utils.getUserInfos();
      if (this.$route.params.id == 0) {
        // 添加初始条目
        this.addItem();
      } else {
        // return;
        // 编辑
        // 处理编辑逻辑
        this.approvalForm.id = this.$route.params.id;
        this.getDetail().then(rtnData => {
          this.approvalForm.remarks = rtnData.travelFlowresponse.remarks;
          this.approvalForm.relType = rtnData.travelFlowresponse.relType;
          this.relationThemeName = rtnData.travelFlowresponse.relationThemeName;
          this.procName = rtnData.travelFlowresponse.projectName;
          this.projectLeaderName = rtnData.travelFlowresponse.projectPersonel;
          this.approvalForm.relationTheme = rtnData.travelFlowresponse.relationTheme;
          this.approvalForm.projectId = rtnData.travelFlowresponse.projectId || '';
          this.projectLeaderName = rtnData.travelFlowresponse.projectPersonel || '';
          this.approvalForm.entourageList = rtnData.travelFlowresponse.entourageList || [];
          this.approvalForm.travelExpenseTypeList =
            rtnData.travelFlowresponse.travelExpenseTypeList || [];
          this.approvalForm.procInsId = rtnData.travelFlowresponse.procInsId;
          this.approvalForm.projectName = rtnData.travelFlowresponse.projectName || [];
          var items = rtnData.budgetDetailList || []; //兼容性处理，如果没有图片，则图片数组赋值一个空数组
          items.forEach((val, idx) => {
            val.subConfList = val.subConfList || [];
          });
          var newItemDatas = com.ObjToStamp(items, ['startDate', 'endDate']);
          // 动态参数赋值
          this.$store.dispatch('fullItemDatas', newItemDatas);
        });
      }
    },
    addItem() {
      var obj = Object.assign({}, this.initData);
      this.$store.dispatch('addItemDatas', obj);
    },
    getDetail() {
      return new Promise((resolve, reject) => {
        com
          .covertHttp(api.retravelFlowDetail, {
            travelFlowId: this.$route.params.id
          })
          .then(rtn => {
            resolve(rtn.data);
          });
      });
    },
    submit() {
      var _this = this;
      if (!this.valid()) return; //校验
      this.disSubmit = true;
      this.$vux.confirm.show({
        title: '提交出差申请',
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
      if (!this.valid()) return;
      var postData = {
        ...this.approvalForm,
        demandBudgetList: com.changeItemtimestamp(this.itemDatas, ['startDate', 'endDate'])
      };
      com
        .covertHttp(api.travelApply, {
          ...postData
        })
        .then(rtn => {
          if (rtn.status == 0) {
            this.$router.push({ path: '/userIndex' });
            com.delKeepAlive(this, ['TaskOption', 'UserIndex', 'TripListRecived', 'TripListSend']);
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
        demandBudgetList: com.changeItemtimestamp(this.itemDatas, ['startDate', 'endDate'])
      };
      var id = this.$route.params.id == 0 ? '' : this.$route.params.id;
      com
        .covertHttp(api.saveTravelFlowInfo, {
          ...postData,
          id: id
        })
        .then(rtn => {
          if (rtn.status == 0) {
            this.$vux.toast.text(rtn.message || '申请发起成功');
            this.$router.push({ path: '/userIndex' });
            com.delKeepAlive(this, ['TaskOption', 'UserIndex', 'TripListRecived', 'TripListSend']);
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
      var flag = true;
      var _this = this;
      if (this.approvalForm.relType == '') {
        this.$vux.toast.text('请选择关联类型');
        return (flag = false);
      }
      if (this.approvalForm.relType == 1) {
        if (this.approvalForm.relationTheme == '') {
          this.$vux.toast.text('请关联主题');
          return (flag = false);
        }
      }
      if (this.approvalForm.relType == 2) {
        if (this.approvalForm.projectId == '') {
          this.$vux.toast.text('请关联项目');
          return (flag = false);
        }
      }
      if (
        !this.approvalForm.travelExpenseTypeList ||
        this.approvalForm.travelExpenseTypeList.length == 0
      ) {
        this.$vux.toast.text('请选择报销分类');
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
    changeType() {
      this.approvalForm.relationTheme = '';
      this.approvalForm.projectId = '';
      this.projectLeaderName = '';
      this.relationThemeName = '';
      this.procName = '';
    },
    themeConfirm(idx) {
      this.relationThemeName = this.relatedThemeJSON[idx].procName;
      this.procName = this.relatedThemeJSON[idx].projectName;
      this.projectLeaderName = this.relatedThemeJSON[idx].projectPersonel;
      this.approvalForm.relationTheme = this.relatedThemeJSON[idx].procCode;
      this.openTheme = false;
    }
  }
};
</script>
<style lang="less">
@import '../../assets/css/trip.less';
</style>

