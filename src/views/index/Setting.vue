<template>
    <div class="setting">
        <div class="index-cell container">
            <img src="../../assets/img/tx.png" class="img-width60 userimg" />
            <div class="item_body">
                <group label-margin-right="1em">
                    <cell title="姓名" :value="baseInfo.userName"></cell>
                    <cell title="手机号" :value="baseInfo.phone"></cell>
                    <cell title="部门" :value="baseInfo.officeName"></cell>
                    <cell title="岗位" :value="baseInfo.postName"></cell>
                </group>
                <group label-margin-right="1em">
                    <cell title="修改密码" is-link @click.native="psd"></cell>
                </group>
                <group label-margin-right="1em">
                    <cell title="退出登录" is-link @click.native="loginConfirm =true"></cell>
                </group>
            </div>
        </div>
        <div v-transfer-dom>
            <confirm v-model="loginConfirm" title="是否退出登录？" @on-cancel="loginConfirm=false" @on-confirm="logout">
                <p style="text-align:center;">{{ ('确定执行操作?') }}</p>
            </confirm>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import com from '@/assets/js/common'
import XHR from '@/assets/js/XHR';
import api from '@/assets/api/index.api'
import { Group, Flexbox, Box, FlexboxItem, Loading, Cell, Confirm, CellBox, ConfirmPlugin, Grid, Badge, GridItem, GroupTitle, XButton, TransferDomDirective as TransferDom} from 'vux';
Vue.use(ConfirmPlugin)
export default {
    directives: {
        TransferDom
    },
    components: {
        Grid,
        GridItem,
        GroupTitle,
        Group,
        Box,
        Loading,
        Cell,
        CellBox,
        Badge,
        ConfirmPlugin,
        Confirm,
        Flexbox,
        FlexboxItem,
        XButton
    },
    data() {
        return {
            baseInfo:{
                userName:'',
                officeName:'',
                phone:'',
                roleList:[{
                    name:'',
                }],
            },
            loginConfirm: false,
            recivedNum: "",
            sendNum: "",
        }
    },
    created() {
        this.init();
    },
    computed: {

    },
    methods: {
        init() {
            com.comGetStorage("userInfo").then(res => {
                this.baseInfo = res;
            });
        },
        psd(){
            this.$router.push({ path: "/password/modify" })
        },
        logout() {
            com.logout()
            com.delAllKeepAlive(this) //删除所有keep-alive
            this.$router.push({ path: "/login" })
        },
    }
}
</script>
<style lang="less">
.setting{
    // .weui-grids{
    //     margin-top:0 !important; 
    // }
    .index-cell{
        position: relative;
    }

    .badge{
        position: absolute;
        top: 10px;
        right: 10px;
    }
    .userimg{
        margin: 20px auto 0;
    }
    .vux-no-group-title{
        margin-top: 1.17647059em !important;
    }
}
</style>
