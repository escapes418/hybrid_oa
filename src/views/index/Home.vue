<template>
    <div id="app">
        <div>
            <keep-alive :include="keepAliveList">
                <router-view class="Router"></router-view>
            </keep-alive>
        </div>
        <loading v-model="isLoading"></loading>
    </div>
</template>
<script>
import Vue from "vue";
import { Loading } from "vux";
import { mapState } from "vuex";
import api from "@/assets/api/index.api";
import com from "@/assets/js/common";
import { WechatPlugin, ToastPlugin } from "vux";
import { POINT_CONVERSION_HYBRID } from "constants";
// import inobounce from 'inobounce'

Vue.use(WechatPlugin);

export default {
    data() {
        return {
        };
    },
    components: {
        Loading
    },
    computed: {
        ...mapState({
            isLoading: state => state.isLoading,
            keepAliveList: state => state.keepAliveList
        })
    },
    created() {
        // inobounce.enable()
        // com.login(this)
        // this.$store.dispatch('getAddressList');
        // this.$store.dispatch('getSubjectList');
        // 每次进入主页，从接口获取最新地址信息
        /* com.covertHttp(api.areaInfo).then(res => {
            console.log('接口返回的地址信息：', res.data);
            com.comSetStorage('addressInfo', res.data);
        }) */
        // 每次进入主页，从接口获取最新地址信息
        /* com.covertHttp(api.querySubInfolistForSecond, {}).then(res => {
            com.comSetStorage('subjectInfo', res.data.list);
        }) */
    }
};
</script>
<style lang="less">
@import "../../assets/css/common/reset.fix.less";
@import "../../assets/css/common/base.less";
@import "../../assets/css/index.less";
</style>


