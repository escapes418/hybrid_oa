<template>
  <div>
    <tab v-model="tabIndex">
      <tab-item selected>进行中</tab-item>
      <tab-item>已完成</tab-item>
      <tab-item>草稿箱</tab-item>
    </tab>
    <group v-if="count !== 0">
      <cell-box
        v-for="(el, index) in mysendList"
        :key="index"
        @click.native="gotoApprovalDetail(el.id)"
      >
        <div class="w-100">
          <div class="disc-text">
            <div class="content-title">
              {{ el.applyPerName }}
              <span>发起的报销申请</span>
            </div>
            <div class="long-content">
              <span class="disc-title long-title">流程编号</span>
              <span class="long-text">{{ el.procCode }}</span>
            </div>
            <div class="long-content">
              <span class="disc-title long-title">申请时间</span>
              <span class="long-text">{{ el.createDate }}</span>
            </div>
            <div class="long-content">
              <span class="disc-title long-title">费用总额</span>
              <span class="long-text"
                >{{ el.expenseTotal || 0 | thousands(2) }}元</span
              >
            </div>
            <div class="long-content">
              <span class="disc-title long-title">当前状态</span>
              <span class="long-text font-orange">{{
                el.expenseStatusValue
              }}</span>
            </div>
            <div class="long-content">
              <span class="disc-title long-title">备注</span>
              <span class="long-text">{{ el.remarks }}</span>
            </div>
          </div>
        </div>
      </cell-box>
    </group>

    <div class="add-btn mb-15" v-if="loadmore">
      <span class="pointer" @click="clickLoadMore()">点击加载更多</span>
    </div>

    <div class="prompt" v-if="count === 0">
      <icon type="info" is-msg class="prompt-icon"></icon>
      <div class="mt-10">暂无数据</div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import api from "@/assets/api/index.api";
import com from "@/assets/js/common";
import XHR from "@/assets/js/XHR";
import { Group, Cell, CellBox, XButton, Box, Icon, Tab, TabItem } from "vux";

export default {
  name: "ApprovalListSend",
  components: {
    Group,
    Cell,
    CellBox,
    XButton,
    Box,
    Icon,
    Tab,
    TabItem
  },
  data() {
    return {
      tabIndex: 0,
      mysendList: [],
      count: -1,
      page: 1, //当前页数,
      pageTotal: 1,
      pageSize: 10 //固定常量
    };
  },
  created() {
    this.getMysendList(1, this.expenseStatus);
    com.addKeepAlive(this); //添加keep-alive
  },
  watch: {
    expenseStatus(newVal, val) {
      // 切换时重新从第一页开始获取数据
      if (newVal == val) return;
      this.page = 1;
      this.getMysendList(this.page, this.expenseStatus);
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
    // 获取数据
    getMysendList(pageNo, type) {
      console.log(1);
      com
        .covertHttp(api.getMysendList, {
          pageNo: pageNo,
          pageSize: this.pageSize,
          expenseStatus: type
        })
        .then(rtn => {
          console.log("sdsds", rtn);
          var content = rtn.contentstr;
          console.log(content);
let  result;

        // 替换单引
          content = content.replace(/\u0027/g, "'");
          console.log(content, "content1");
          result = JSON.parse(content);
          console.log(result, "result1");


// 替换双引号
          content = content.replace(/\"/g, '\"');
          console.log(content, "content2");
          result = JSON.parse(content);
          console.log(result, "result2");
          console.log(result.data.data.list[0].remarks,'remarks');



          return;
          this.mysendList = rtn.data.list;
          // 重新计算总页数
          this.count = parseInt(rtn.data.total) || 0;
          this.pageTotal = Math.ceil(this.count / this.pageSize);
        });
    },
    //加载更多
    clickLoadMore() {
      this.page++;
      com
        .covertHttp(api.getMysendList, {
          pageNo: this.page,
          pageSize: this.pageSize,
          expenseStatus: this.expenseStatus
        })
        .then(rtn => {
          this.mysendList.push(...rtn.data.list);
          this.count = parseInt(rtn.data.total) || 0; // 重新计算总页数
          this.pageTotal = Math.ceil(this.count / this.pageSize);
        });
    },
    // 跳转
    gotoApprovalDetail(id) {
      if (id == "") return;
      this.$router.push({ path: "/approval/detail/" + id + "/myself/0" });
    }
  }
};
</script>
<style>
.weui-cells {
  /* margin-top: 10px !important; */
}
</style>

