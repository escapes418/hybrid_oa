<template>
  <div class="topdev" ref="topdev">
    <tab v-model="tabIndex">
      <tab-item selected>我的</tab-item>
      <tab-item v-if="showTeam">我的团队</tab-item>
    </tab>
    <group title="我的工作统计" v-if="tabIndex == 0">
      <datetime
        format="YYYY-MM"
        class="data-time"
        v-model="personmonth"
        title="月份选择"
        placeholder="请选择月份"
        @on-change="getPersonalSale"
      >
      </datetime>
      <cell-box>
        <div class="w-100">
          <div class="detail-text">
            <div class="long-content">
              <span class="detail-title long-title">上门拜访</span>
              <span class="long-detail">{{ personalSaleData.dropVisitNum }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">电话拜访</span>
              <span class="long-detail">{{ personalSaleData.phoneVisitNum }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">新增签约数量</span>
              <span class="long-detail">{{ personalSaleData.addSignedNum }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">减少签约数量</span>
              <span class="long-detail">{{ personalSaleData.downSignedNum }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">新增客户数</span>
              <span class="long-detail">{{ personalSaleData.newCustNum }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">捡入客户数</span>
              <span class="long-detail">{{ personalSaleData.pickCustNum }}</span>
            </div>
          </div>
        </div>
      </cell-box>
    </group>
    <group title="我的团队工作统计" v-if="tabIndex == 1">
      <datetime
        format="YYYY-MM"
        class="data-time"
        v-model="teammonth"
        title="月份选择"
        placeholder="请选择月份"
        @on-change="getTeamSale"
      >
      </datetime>
      <cell-box>
        <div class="w-100">
          <div class="detail-text">
            <div class="long-content">
              <span class="detail-title long-title">上门拜访</span>
              <span class="long-detail">{{ monthDate.dropVisitNum }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">电话拜访</span>
              <span class="long-detail">{{ monthDate.phoneVisitNum }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">新增签约数量</span>
              <span class="long-detail">{{ monthDate.addSignedNum }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">减少签约数量</span>
              <span class="long-detail">{{ monthDate.downSignedNum }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">新增客户数</span>
              <span class="long-detail">{{ monthDate.newCustNum }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">捡入客户数</span>
              <span class="long-detail">{{ monthDate.pickCustNum }}</span>
            </div>
          </div>
        </div>
      </cell-box>
    </group>
  </div>
</template>

<script>
import Vue from 'vue';
import api from '@/assets/api/index.api';
import com from '@/assets/js/common';
import { Group, Cell, CellBox, XButton, Datetime, Box, Icon, Tab, TabItem } from 'vux';

export default {
  name: 'salesStatistics',
  components: {
    Group,
    Cell,
    CellBox,
    XButton,
    Box,
    Icon,
    Tab,
    Datetime,
    TabItem
  },
  data() {
    return {
      baseInfo: {},
      personalSaleData: {},
      monthDate: {},
      personmonth: com.timeFormatMonth(new Date().getTime()),
      teammonth: com.timeFormatMonth(new Date().getTime()),
      showTeam: false,
      tabIndex: 0
    };
  },
  created() {
    this.init();
  },
  watch: {
    expenseStatus(newVal, val) {
      if (newVal == val) return;
      console.log(newVal);
      this.teammonth = com.timeFormatMonth(new Date().getTime());
      this.personmonth = com.timeFormatMonth(new Date().getTime());
      if (newVal == 0) {
        this.getPersonalSale();
      } else {
        this.getTeamSale();
      }
    }
  },
  computed: {
    expenseStatus() {
      if (this.tabIndex == 0) {
        return 0;
      }
      if (this.tabIndex == 1) {
        return 1;
      }
    }
  },
  methods: {
    init() {
      this.getIsLeader();
      com.comGetStorage('userInfo').then(res => {
        this.baseInfo = Object.assign({}, this.baseInfo, res);
      });
      this.getPersonalSale();
    },
    getPersonalSale(pageNo, type) {
      com
        .covertHttp(api.personalSale, {
          monthDate: this.personmonth,
          userId: this.baseInfo.userId
        })
        .then(rtn => {
          this.personalSaleData = rtn.data;
        });
    },
    getTeamSale(pageNo, type) {
      com
        .covertHttp(api.teamSale, {
          monthDate: this.teammonth,
          userId: this.baseInfo.userId
        })
        .then(rtn => {
          this.monthDate = rtn.data;
        });
    },
    getIsLeader() {
      com.covertHttp(api.isLeader).then(rtn => {
        this.showTeam = rtn.data;
      });
    }
  }
};
</script>
<style>
</style>

