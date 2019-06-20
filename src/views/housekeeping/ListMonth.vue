<template>
    <div>
        <group v-if="count!==0">
            <cell-box v-for="(el,index) in mysendList" :key="index" @click.native="gotoDayList(el.userInfo.userId)">
                <div class="w-100">
                    <div class="disc-text">
                        <div class="long-content">
                            <span class="disc-title long-title">用户名</span>
                            <span class="long-text font-green">{{el.userInfo.userName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">年份月份</span>
                            <span class="long-text">{{el.workYear}}-{{el.workMonth}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">上班签到次数</span>
                            <span class="long-text">{{el.workSignCount}}次</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">工作照上传次数</span>
                            <span class="long-text">{{el.workPhotoCount}}次</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">内务照上传次数</span>
                            <span class="long-text">{{el.interiorPhotoCount}}次</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">本月评分</span>
                            <span class="long-text">{{el.score}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">操作</span>
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
        }
    },
    created() {
        this.getMysendList(1);
    },
    computed: {
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
        getMysendList(pageNo) {
            var postData = {
                pageNo: pageNo,
                pageSize: this.pageSize,
            }
            api.monthList(pageNo,this.pageSize).then(rtn => {
                this.mysendList = rtn.data.list;
                // 重新计算总页数

                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            })
        },
        //加载更多
        clickLoadMore() {
            this.page = this.page + 1;
            api.monthList(this.page, this.pageSize).then(rtn => {
                this.mysendList.push(...rtn.data.list);
                // 重新计算总页数
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            })
        },
        // 跳转
        gotoDayList(id) {
            this.$router.push({ path: "/housekeepingListDay/" + id })
        }
    }
}
</script>
<style>
.weui-cells {
  /* margin-top: 10px !important; */
}
.disc-title{
    width: 7em;
}
.long-text {
    margin-left:8em;
}
</style>

