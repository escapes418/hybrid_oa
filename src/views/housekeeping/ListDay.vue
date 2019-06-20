<template>
    <div>
        <tab v-model="tabIndex">
            <tab-item selected>任务列表</tab-item>
            <tab-item>草稿箱</tab-item>
        </tab>
        <group v-if="count!==0">
            <cell-box v-for="(el,index) in mysendList" :key="index" @click.native="gotoApprovalDetail(el.id)">
                <div class="w-100">
                    <div class="disc-text">
                        <div class="long-content">
                            <span class="disc-title long-title">日期</span>
                            <span class="long-text">{{el.workYear}}-{{el.workMonth}}-{{el.workDay}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">综合评分</span>
                            <span class="long-text">{{el.score}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">状态</span>
                            <span class="long-text font-orange" v-if="true">已提交内务</span>
                            <span class="long-text font-orange" v-if="false">未提交内务</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>

        <div class="add-btn mb-15" v-if="loadmore">
            <span class="pointer" @click="clickLoadMore()">点击加载更多</span>
        </div>

        <div class="prompt" v-if="count===0">
            <icon type="info" is-msg class="prompt-icon"></icon>
            <div class="mt-10">暂无数据</div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import axios from '@/assets/api/axios'
import api from '@/assets/api/index.api'
import { Group, Cell, CellBox, XButton, Box, Icon, Tab, TabItem } from 'vux';

export default {
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
            page: 1,//当前页数,
            pageTotal: 1,
            pageSize: 10, //固定常量
            userId: this.$route.params.userId,
        }
    },
    created() {
        this.getMysendList(1, this.expenseStatus);
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
            var postData = {
                pageNo: pageNo,
                pageSize: this.pageSize,
                expenseStatus: type,
                billType:1,
            }
            api.dayList(pageNo,this.pageSize,this.userId).then(rtn => {
                this.mysendList = rtn.data.list;
                // 重新计算总页数
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            })
        },
        //加载更多
        clickLoadMore() {
            this.page = this.page + 1;
            api.dayList(this.page, this.pageSize, this.userId).then(rtn => {
                this.mysendList.push(...rtn.data.list);
                // 重新计算总页数
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            })
        },
        // 跳转
        gotoApprovalDetail(id) {
            this.$router.push({ path: "/market/detail/" + id + "/myself" + "/0" })
        }
    }
}
</script>
<style>
.weui-cells {
  margin-top: 10px !important;
}
</style>

