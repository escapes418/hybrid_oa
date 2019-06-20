<template>
    <div>
        <tab v-model="tabIndex">
            <tab-item selected>进行中</tab-item>
            <tab-item>已完成</tab-item>
            <tab-item>草稿箱</tab-item>
        </tab>
        <group v-if="count!==0">
            <cell-box v-for="(el,index) in mysendList" :key="index" @click.native="gotoApprovalDetail(el.id)">
                <div class="w-100">
                    <div class="disc-text">
                        <div class="long-content">
                            <span class="disc-title long-title">流程编号</span>
                            <span class="long-text">{{el.procCode}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">申请时间</span>
                            <span class="long-text">{{el.createDate}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">费用总额</span>
                            <span class="long-text">{{el.amountSum||0 | thousands(2) }}元</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">当前状态</span>
                            <span class="long-text font-orange">{{el.demandStatusTxt}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">备注</span>
                            <span class="long-text">{{el.remarks}}</span>
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
import com from '@/assets/js/common'
import XHR from "@/assets/js/XHR";
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
            billType: 2,//1:需求申请,2:需求发起,3:报销
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
            // api.queryMyDemandImplementOrMarketList(pageNo, this.pageSize, type, this.billType).then(rtn => {
            //     console.log(rtn.data)
            //     this.mysendList = rtn.data.list;
            //     // 重新计算总页数
            //     this.count = parseInt(rtn.data.total) || 0;
            //     this.pageTotal = Math.ceil(this.count / this.pageSize);
            // })
            com.covertHttp(api.queryMyDemandImplementOrMarketList,{
                pageNo: pageNo,
                pageSize: this.pageSize,
                expenseStatus: type,
                billType: this.billType
            }).then(rtn => {
                this.mysendList = rtn.data.list;
                // 重新计算总页数
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            });
        },
        //加载更多
        clickLoadMore() {
            this.page = this.page + 1;
            // api.queryMyDemandImplementOrMarketList(this.page, this.pageSize, this.expenseStatus ,this.billType).then(rtn => {
            //     this.mysendList.push(...rtn.data.list);
            //     // 重新计算总页数
            //     this.count = parseInt(rtn.data.total) || 0;
            //     this.pageTotal = Math.ceil(this.count / this.pageSize);
            // })
            com.covertHttp(api.queryMyDemandImplementOrMarketList,{
                pageNo: this.page,
                pageSize: this.pageSize,
                expenseStatus: this.expenseStatus,
                billType: this.billType
            }).then(rtn => {
                this.mysendList.push(...rtn.data.list);
                // 重新计算总页数
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            });
            /*
            if (this.page < this.pageTotal) {
                this.getMysendList(this.page, this.expenseStatus);
            }
            if (this.page == this.pageTotal) {
                this.getMysendList(this.page, this.expenseStatus);
                this.loadmore = false;
            }
             */
            /*
            if (this.page)
                api.getMysendList(this.page).then(rtn => {
                    if (rtn.data.list.length > 0) {
                        rtn.data.list.map(item => {
                            this.mysendList.push(item);
                            if (Math.ceil(this.count / 20) < this.page) {
                                this.loadmore = true;
                            } else {
                                this.loadmore = false;
                            }
                        })
                    }
                })
                */
        },
        // 跳转
        gotoApprovalDetail(id) {
            if (id == "") return
            this.$router.push({ path: "/implementation/detail/" + id + "/myself" + "/0" })
        }
    }
}
</script>


