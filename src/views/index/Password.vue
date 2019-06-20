<template>
    <div class="wrap">
        <h3 v-if="type == 'modify'">修改密码</h3>
        <group title=" " v-if="type == 'modify'" label-margin-right="1rem">
            <x-input title="手机号" :max="50" v-model.trim="baseInfo.phone" readonly></x-input>
            <x-input title="当前密码" :max="50" v-model.trim="psd.oldPassword" type="password" placeholder="请输入当前密码">
                <span slot="label">当前密码<span class="required">*</span></span>
            </x-input>
            <x-input title="新密码" :max="50" v-model.trim="psd.newPassword" type="password" placeholder="请输入新密码">
                <span slot="label">新密码<span class="required">*</span></span>
            </x-input>
            <x-input title="确认密码" :max="50" v-model.trim="psd.confirmPassword" type="password" placeholder="请输入确认密码">
                <span slot="label">确认密码<span class="required">*</span></span>
            </x-input>
        </group>
        <h3 v-if="type == 'forget'">忘记密码</h3>
        <group title=" " v-if="type == 'forget'" label-margin-right="1rem">
            <x-input title="手机号" :max="50" v-model.trim="psd.phone"></x-input>
            <x-input title="验证码" readonly>
                <x-button slot="right" type="primary" mini>{{btnContent}}</x-button>
            </x-input>
            <x-input title="密码" :max="50" v-model.trim="psd.password" type="password" placeholder="请输入密码"></x-input>
            <x-input title="确认密码" :max="50" v-model.trim="psd.confirmPassword" type="password" placeholder="请输入密码"></x-input>
        </group>
        <div class="h20"></div>
        <div class="wrapItem">
            <x-button type="primary" @click.native="submit">确定</x-button>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import com from "@/assets/js/common";
import {
  Group,
  Cell,
  XInput,
  XButton,
  Loading,
  XDialog,
  Actionsheet,
  Divider
} from "vux";
import { WechatPlugin, ToastPlugin, AlertPlugin, ConfirmPlugin } from "vux";
import { Grid, GridItem } from "vux";
import { mapState } from "vuex";
import store from "@/store/index/index";
import api from "@/assets/api/index.api";
import XHR from '@/assets/js/XHR';

Vue.use(ToastPlugin);
export default {
    components: {
        Grid,
        GridItem,
        XInput,
        Group,
        XButton
    },
    created() {
        this.init()
    },
    computed: {},
    data() {
        return {
            // phone: "15997435050",
            phone: "",
            psd:{
                phone: "",
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            },
            btnContent:"发送验证码",
            baseInfo:{},
            type:this.$route.params.type,
        };
    },

    methods: {
        init() {
            com.comGetStorage("userInfo").then(res => {
                this.baseInfo = res;
            });
        },
        submit() {
            if(this.type == "modify"){
                if (this.psd.oldPassword == "") {
                    this.$vux.toast.text("请输入当前密码");
                    return false;
                }
                if (this.psd.newPassword == "") {
                    this.$vux.toast.text("请输入新密码");
                    return false;
                }
                if (this.psd.confirmPassword == "") {
                    this.$vux.toast.text("请输入确认密码");
                    return false;
                }
                if (this.psd.confirmPassword != this.psd.newPassword) {
                    this.$vux.toast.text("新密码与确认密码不一致");
                    return false;
                }
                if(!/^\w{6,16}$/.test(this.psd.newPassword)){
                    this.$vux.toast.text("密码只能为6-16位数字、字母、下划线组合");
                    return false;
                }
                this.modify()
            }else if(this.type == "forget"){
                if (!/^1[0-9]{10}$/.test(this.psd.phone)) {
                    this.$vux.toast.text("请输入正确的手机号！");
                    return false;
                }
                if (this.psd.password == "") {
                    this.$vux.toast.text("请输入密码");
                    return false;
                }
                if (this.psd.confirmPassword == "") {
                    this.$vux.toast.text("请输入确认密码");
                    return false;
                }
                if(!/^\w{6,16}$/.test(this.psd.confirmPassword)){
                    this.$vux.toast.text("密码只能为6-16位数字、字母、下划线组合");
                    return false;
                }
            }
        },
        login() {
            return new Promise((resolve,reject) => {
                XHR.http(api.login,{
                    loginName: this.phone,
                    passWord:this.psd,
                }).then(rtn => {
                    resolve(rtn.data);
                });
            })
        },
        async setDate(data) {
            await com.setStorage('sjboacert',{phone:data.phone}); // 安卓存储字符串可能读取失败，所以存储对象
            this.$router.replace({path:'/userIndex'});
        },
        modify() {
            var _this = this;
            this.$vux.confirm.show({
            // 组件除show外的属性
                title:'确定修改密码？',
                onCancel () {

                },
                onConfirm () {
                    com.covertHttp(api.modifyPwd,_this.psd).then(res => { 
                        if(res.status == 0){
                            _this.$vux.toast.text(res.message || "修改密码成功");
                            _this.logout()
                        } else {
                            _this.$vux.toast.text(res.message || "修改密码失败");
                        }
                    })
                }
            })
        },
        logout() {
            var _this = this
            sdk.ability.removeStorage({
                key: 'sjboacert',
                success: function (data) {
                    _this.$router.push({ path: "/login" })
                    com.delAllKeepAlive(_this) //删除所有keep-alive
                }
            })
        },
    }
}
</script>

<style lang="less">
h3 {
  text-align: center;
  font-size: 18px;
  margin: 60px auto 40px;
}

.body {
  height: 100%;
}
</style>
