<template>
    <div v-if="isReady" class="approval_detail">
        <group title='基本信息'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">提交人</span>
                            <span class="long-detail">{{dataArr.detail.createBy}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">部门</span>
                            <span class="long-detail">{{dataArr.detail.createByDept}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">提交时间</span>
                            <span class="long-detail">{{dataArr.detail.createTime | stamp2TextDateFull}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">今日工作</span>
                            <span class="long-detail">{{dataArr.detail.todayWork}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">运力池建设</span>
                            <span class="long-detail">{{dataArr.detail.transportPoolBuild}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">回访项目情况</span>
                            <span class="long-detail">{{dataArr.detail.revisitProjectStatus}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">需要协助问题</span>
                            <span class="long-detail">{{dataArr.detail.needAssistProblem}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">今日感想</span>
                            <span class="long-detail">{{dataArr.detail.todayThought}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">备注</span>
                            <span class="long-detail">{{dataArr.detail.remarks}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        <group title='项目情况'  v-if="count!==0">
            <cell-box v-for="(el,index) in list" :key="index">
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">项目名称</span>
                            <span class="long-detail">{{el.projectName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">节点</span>
                            <span class="long-detail">{{el.nodeName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">节点具体地址</span>
                            <span class="long-detail">{{el.nodeAddress}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">节点人数</span>
                            <span class="long-detail">{{el.nodeEmpNum}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">节点具体人员</span>
                            <span class="long-detail">{{el.nodeEmpNames}}</span>
                        </div> 
                        <div class="long-content">
                            <span class="detail-title long-title">异常情况</span>
                            <span class="long-detail">{{el.hasAbnormalStatus}}</span>
                        </div> 
                        <div class="long-content">
                            <span class="detail-title long-title">具体异常说明</span>
                            <span class="long-detail">{{el.anomalyDescription}}</span>
                        </div>                     
                    </div>
                </div>
            </cell-box>
        </group>
        <div class="add-btn mb-15" v-if="loadmore">
            <span class="pointer" @click="clickLoadMore()">点击加载更多</span>
        </div>
        <group title='发送对象'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">发给谁</span>
                            <span class="long-detail">{{dataArr.detail.sendToUserList.join(" ")}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
    </div>
</template>
<script>
import Vue from 'vue'
import com from '@/assets/js/common'
import api from '@/assets/api/index.api'
import XHR from '@/assets/js/XHR';
import sinSelector from "@/components/sinSelector";
import { Box, Confirm, Group, XButton, Timeline, Selector, TimelineItem, Cell,ConfirmPlugin, CellBox, XTextarea, XInput, XDialog, Flexbox, FlexboxItem, TransferDomDirective as TransferDom } from 'vux';
Vue.use(ConfirmPlugin)
export default {
    name: "LogImpDetail",
    directives: {
        TransferDom
    },
    components: {
        Box,
        Confirm,
        Group,
        Selector,
        XButton,
        Timeline,
        TimelineItem,
        Cell,
        CellBox,
        XTextarea,
        XInput,
        XDialog,
        Flexbox,
        FlexboxItem,
        sinSelector,
    },
    data() {
        return {
            isReady: false,
            list:[],
            dataArr: {},
            count: -1,
            page: 1, //当前页数,
            pageTotal: 1,
            pageSize: 10, //固定常量
        }
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
    created() {
        this.init();
    },
    methods: {
        init() {
            if (!this.$route.params.id){
                console.log(params,'参数异常');
                this.$router.push({ path: '/userIndex' });
                return
            }
            var postData = {
                pageNo: this.page,
                pageSize: this.pageSize,
            };
            com.covertHttp(api.queryImplyDailyDetail, {
                ...postData,
                dailyId: this.$route.params.id,
            }).then(rtn => {
                this.dataArr.detail = rtn.data;
                this.list = rtn.data.projectImplementStatusPage.list
                this.count = parseInt(rtn.data.projectImplementStatusPage.count) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
                this.isReady = true;
            });
        
        },
        clickLoadMore(opts) {
            this.page++;
            var postData = {
                pageNo: this.page,
                pageSize: this.pageSize,
                ...opts
            };
            com.covertHttp(api.queryImplyDailyDetail, {
                ...postData,
                dailyId: this.$route.params.id,
            }).then(rtn => {
                this.list.push(...rtn.data.projectImplementStatusPage.list);
                this.count = parseInt(rtn.data.projectImplementStatusPage.count) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            });
        },


    }
}
</script>
<style lang="less">
.approval_detail{
    .upload-img{
    width: 100px;
    height: 80px;
    padding: 0 120px 10px;
    }
    .upload-img img{
        width: 100%;
        height: 100%;
    }
}
.xdialog-group-textarea{
    .weui-textarea{
        text-align:left !important;
    }
}
</style>
