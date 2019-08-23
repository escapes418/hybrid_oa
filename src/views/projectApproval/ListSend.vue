<template>
  <div>
    <tab v-model="tabIndex" @on-before-index-change="switchTabItem">
      <tab-item selected>进行中</tab-item>
      <tab-item>已完成</tab-item>
    </tab>
    <group v-if="count !== 0">
      <cell-box v-for="(el, index) in mysendList" :key="index" @click.native="gotoDetail(el.id)">
        <div class="w-100">
          <div class="disc-text">
            <div class="content-title">
              {{ el.applyPerName }}
              <span>发起的立项申请</span>
            </div>
            <div class="long-content">
              <span class="disc-title long-title">部门名称</span>
              <span class="long-text">{{ el.officeName }}</span>
            </div>
            <div class="long-content">
              <span class="disc-title long-title">流程编号</span>
              <span class="long-text">{{ el.procCode }}</span>
            </div>
            <div class="long-content">
              <span class="disc-title long-title">项目名称</span>
              <span class="long-text">{{ el.projectName }}</span>
            </div>
            <div class="long-content">
              <span class="disc-title long-title">申请时间</span>
              <span class="long-text">{{ el.applyTime | stamp2TextDateFull }}</span>
            </div>
            <div class="long-content">
              <span class="disc-title long-title">当前状态</span>
              <span class="long-text font-orange">{{ el.contractFlowStatusTxt }}</span>
            </div>
            <div class="long-content">
              <span class="disc-title long-title">备注</span>
              <span class="long-text">{{ el.remarks }}</span>
            </div>
          </div>
        </div>
      </cell-box>
    </group>
    <div class="fixed-btn">
      <x-button type="primary" :mini="true" @click.native="showSearchBox">筛选</x-button>
    </div>
    <div class="add-btn mb-15" v-if="loadmore">
      <span class="pointer" @click="clickLoadMore()">点击加载更多</span>
    </div>

    <div class="prompt" v-if="count === 0">
      <icon type="info" is-msg class="prompt-icon"></icon>
      <div class="mt-10">暂无数据</div>
    </div>
    <div v-transfer-dom>
      <popup v-model="showSearch" position="bottom" max-height="70%">
        <group gutter="20px" label-margin-right="1em">
          <x-input
            title="流程编号"
            :max="50"
            v-model.trim="searchOpts.procCode"
            placeholder="请输入流程编号"
          ></x-input>
          <x-input
            title="姓名/部门"
            :max="50"
            v-model.trim="searchOpts.officeOrName"
            placeholder="请输入申请人姓名/部门"
          ></x-input>
          <x-input
            title="项目名称"
            :max="50"
            v-model.trim="searchOpts.projectName"
            placeholder="请输入项目名称"
          ></x-input>
          <!-- <x-input
            title="合同方名称"
            :max="50"
            v-model.trim="searchOpts.contractPartyName"
            placeholder="请输入合同方名称"
          ></x-input> -->
          <datetime
            format="YYYY-MM-DD"
            v-model="searchOpts.beginApplyTime"
            class="data-time"
            title="开始时间"
            :end-date="todayDate"
            placeholder="请选择申请开始时间"
          ></datetime>
          <datetime
            format="YYYY-MM-DD"
            v-model="searchOpts.endApplyTime"
            class="data-time"
            title="结束时间"
            :end-date="todayDate"
            placeholder="请选择申请结束时间"
          ></datetime>
        </group>
        <box gap="10px 10px">
          <flexbox>
            <flexbox-item>
              <x-button type="default" @click.native="reset">重置</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button type="primary" @click.native="search">搜索</x-button>
            </flexbox-item>
          </flexbox>
        </box>
      </popup>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import api from '@/assets/api/index.api';
import com from '@/assets/js/common';
import XHR from '@/assets/js/XHR';
import sinSelector from '@/components/sinSelector';
import {
  Tab,
  TabItem,
  Group,
  Cell,
  CellBox,
  Icon,
  XInput,
  Datetime,
  XButton,
  Popup,
  Box,
  Flexbox,
  FlexboxItem,
  TransferDomDirective as TransferDom
} from 'vux';

export default {
  name: 'ProjectApprovalListSend',
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
    sinSelector,
    Popup,
    Box
  },
  data() {
    return {
      tabIndex: 0,
      mysendList: [],
      count: -1,
      page: 1, //当前页数,
      pageTotal: 1,
      pageSize: 10, //固定常量
      // 搜索条件
      showSearch: false,
      searchOpts: {
        officeOrName: '', // 申请人姓名
        procCode: '',
        projectName: '',
        beginApplyTime: '', // 开始时间
        endApplyTime: '' // 结束时间
      },
      // 发送请求实际字段
      axiosOpts: {},
      todayDate: com.timeFormat(new Date().getTime())
    };
  },
  created() {
    this.getMysendList(this.expenseStatus);
    com.addKeepAlive(this); //添加keep-alive
  },
  watch: {
    expenseStatus(newVal, val) {
      // 切换时重新从第一页开始获取数据
      if (newVal == val) return;
      this.page = 1;
      this.getMysendList(this.expenseStatus);
    }
  },
  computed: {
    expenseStatus() {
      if (this.tabIndex == 0) {
        return 2; // 进行中
      }
      if (this.tabIndex == 1) {
        return 1; // 已完成
      }
      if (this.tabIndex == 2) {
        return 4; // 草稿箱
      }
    },
    loadmore() {
      if (this.page >= this.pageTotal) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    showSearchBox() {
      this.showSearch = !this.showSearch;
    },
    // 获取数据
    getMysendList(type, opts) {
      var postData = {
        pageNo: this.page,
        pageSize: this.pageSize,
        ...this.axiosOpts,
        ...opts
      };
      // console.log(this.searchOpts.applyTimeStart)
      com
        .covertHttp(api.queryMyProjectApprovalFlowList, {
          ...postData,
          beginApplyTime: com.timeParse(this.searchOpts.beginApplyTime),
          endApplyTime: this.searchOpts.endApplyTime
            ? com.timeParse(this.searchOpts.endApplyTime) + 86400000
            : 0,
          projectApprovalStatus: type
        })
        .then(rtn => {
          // console.log('sdsds',rtn);
          this.mysendList = rtn.data.list;
          // 重新计算总页数
          this.count = parseInt(rtn.data.total) || 0;
          this.pageTotal = Math.ceil(this.count / this.pageSize);
        });
    },
    //加载更多
    clickLoadMore(opts) {
      this.page++;
      var postData = {
        // ...postData,
        pageNo: this.page,
        pageSize: this.pageSize,
        ...this.axiosOpts,
        ...opts
      };
      com
        .covertHttp(api.queryMyProjectApprovalFlowList, {
          ...postData,
          beginApplyTime: com.timeParse(this.searchOpts.beginApplyTime),
          endApplyTime: this.searchOpts.endApplyTime
            ? com.timeParse(this.searchOpts.endApplyTime) + 86400000
            : 0,
          projectApprovalStatus: this.expenseStatus
        })
        .then(rtn => {
          this.mysendList.push(...rtn.data.list);
          this.count = parseInt(rtn.data.total) || 0; // 重新计算总页数
          this.pageTotal = Math.ceil(this.count / this.pageSize);
        });
    },
    switchTabItem(index) {
      this.reset();
      this.getMysendList(this.expenseStatus);
    },
    // 跳转
    gotoDetail(id) {
      if (id == '') return;
      this.$router.push({ path: '/projectApproval/detail/' + id + '/myself/0' });
    },
    search() {
      // 搜索
      if (
        this.searchOpts.endApplyTime != '' &&
        new Date(this.searchOpts.endApplyTime) < new Date(this.searchOpts.beginApplyTime)
      ) {
        this.$vux.toast.text('结束时间需大于开始时间');
        return;
      }
      this.axiosOpts = { ...this.searchOpts };
      this.page = 1;
      this.getMysendList(this.expenseStatus);
    },
    reset() {
      // 重置搜索
      this.page = 1;
      this.axiosOpts = {};
      this.searchOpts = {
        officeOrName: '',
        procCode: '',
        projectName: '',
        beginApplyTime: '', // 开始时间
        endApplyTime: '' // 结束时间
      };
    }
  }
};
</script>
<style>
.fixed-btn {
  position: fixed;
  bottom: 10px;
  right: 10px;
}
</style>

