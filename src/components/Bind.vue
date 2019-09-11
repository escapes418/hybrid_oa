<template>
  <div class="wrap">
    <h3>绑定个人信息</h3>
    <group label-margin-right="1rem">
      <x-input title="手机号" v-model="phone"></x-input>
      <x-input title="验证码" v-model="code">
        <x-button
          slot="right"
          type="primary"
          mini
          :text="btnText"
          :disabled="!isBtn"
          @click.native="getCode"
          style="width:100px"
        ></x-button>
      </x-input>
    </group>
    <div class="h20"></div>
    <div class="wrapItem">
      <x-button type="primary" @click.native="submit">确定</x-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import com from '@/assets/js/common';
import XHR from '@/assets/js/XHR';
import { Group, Cell, XInput, XButton, Loading, XDialog, Actionsheet, Divider } from 'vux';
import { WechatPlugin, ToastPlugin, AlertPlugin, ConfirmPlugin } from 'vux';
import { Grid, GridItem } from 'vux';
import { mapState } from 'vuex';
import api from '@/assets/api/common.api';

Vue.use(ToastPlugin);
export default {
  components: {
    Grid,
    GridItem,
    XInput,
    Group,
    XButton
  },
  mounted() {},
  computed: {
    ...mapState({
      openid: state => state.openid
    })
  },
  data() {
    return {
      companyId: '',
      phone: '',
      code: '',
      isBtn: true,
      btnText: '发送验证码',
      time: 60,
      fromPath: ''
    };
  },
  beforeRouteEnter: function(to, from, next) {
    next(function(vm) {
      vm.fromPath = from.fullPath;
    });
  },
  mounted: function() {},
  methods: {
    submit() {
      var obj = {
        openid: this.openid,
        code: this.code,
        mobile: this.phone
      };
      if (!/^1[3456789][0-9]{9}$/.test(this.phone)) {
        this.$vux.toast.text('请输入正确的手机号！');
        return false;
      }
      if (!/^[0-9]{4,6}$/.test(this.code)) {
        this.$vux.toast.text('请输入正确的验证码！');
        return false;
      }
      api.bindOpenId(this.phone, this.code).then(rtn => {
        if (rtn.status == 0) {
          this.$vux.toast.text('绑定成功');
          this.$router.go(-1);
        } else {
          // this.$vux.toast.text(rtn.message || '操作失败');
        }
      });
    },
    getCode() {
      if (!/^1[3456789][0-9]{9}$/.test(this.phone)) {
        this.$vux.toast.text('请输入正确的手机号码');
        return false;
      }
      api.getValidateCode(this.phone).then(rtn => {
        if (rtn.status == 0) {
          this.$vux.toast.text('验证码发送成功!');
          this.countDown();
        } else {
          // this.$vux.toast.text(rtn.message || '操作失败')
        }
      });
    },
    countDown() {
      if (this.time == 0) {
        this.isBtn = true;
        this.btnText = '发送验证码';
        this.time = 10;
        return false;
      } else {
        this.time--;
        this.btnText = `${this.time}s`;
        this.isBtn = false;
        setTimeout(
          function() {
            this.countDown();
          }.bind(this),
          1000
        );
      }
    }
  }
};
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
