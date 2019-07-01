<template>
  <div class="wrap">
    <h3>登录</h3>
    <group label-margin-right="1rem">
      <x-input title="帐号" v-model="phone" placeholder="请输入手机号"></x-input>
      <x-input title="密码" v-model="psd" type="password" placeholder="请输入密码"></x-input>
    </group>
    <div class="h20"></div>
    <div class="wrapItem">
      <x-button type="primary" @click.native="submit">确定</x-button>
      <!-- <x-button type="primary" @click.native="test">测试提交</x-button>
            <x-button type="primary" @click.native="previewImage">图片预览</x-button>
            <x-button type="primary" @click.native="setData">设置本地数据</x-button>
            <x-button type="primary" @click.native="getData">读取本地数据</x-button>
            <x-button type="primary" @click.native="removeData">移除本地数据sjboacert</x-button>
            <x-button type="primary" @click.native="showToast">showToast</x-button>
            <x-button type="primary" @click.native="chooseImage">图片上传</x-button> -->
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Group, Cell, XInput, XButton, Loading, XDialog, Actionsheet, Divider } from 'vux';
import { WechatPlugin, ToastPlugin, AlertPlugin, ConfirmPlugin } from 'vux';
import { Grid, GridItem } from 'vux';
import { mapState } from 'vuex';
import store from '@/store/index/index';
import com from '@/assets/js/common';
import api from '@/assets/api/index.api';
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
  created() {},
  computed: {},
  data() {
    return {
      // phone: "15997435050",
      phone: '',
      psd: ''
    };
  },

  methods: {
    // previewImage() {
    //     sdk.components.previewImage({ // 图片预览
    //         url: 'http://120.31.131.193:8121/vfs/13627121431/sijibao/20161031_99be7a9ecf984d278279e7e109fb992c.jpg',
    //         success:function(data) {
    //             console.log(data);
    //         },
    //         fail(data) {
    //             console.log(data)
    //         }
    //     })
    // },
    // chooseImage() {
    //     sdk.ability.chooseImage({
    //         success:function(data) {
    //             console.log('setDataSuccess',data);
    //         },
    //         fail(data) {
    //             console.log('getdatafail',data)
    //         }
    //     })
    // },
    // showToast() {
    //     sdk.components.showToast({ // 错误提示
    //         title: '错误提示信息'
    //     })
    // },
    // setData() {
    //     sdk.ability.setStorage({
    //         key:'testData',
    //         data:{title:12345},
    //         success:function(data) {
    //             console.log('setDataSuccess',data);
    //         }
    //     })
    // },
    // getData() {
    //     sdk.ability.getStorage({
    //         key:'testData',

    //         success:function(data) {
    //             console.log('getDataSuccess',data);
    //         },
    //         fail(data) {
    //             console.log('getdatafail',data)
    //         }
    //     })
    // },
    // removeData() {
    //     sdk.ability.removeStorage({
    //         key:'sjboacert',
    //         success:function(data) {
    //             console.log('removeDataSuccess',data);
    //         }
    //     })
    // },
    submit() {
      var obj = {
        password: this.psd,
        mobile: this.phone
      };
      // if (!/^1[0-9]{10}$/.test(this.phone)) {
      //     this.$vux.toast.text("请输入正确的手机号！");
      //     return false;
      // }
      if (this.phone == '') {
        this.$vux.toast.text('请输入帐号');
        return false;
      }
      if (this.psd == '') {
        this.$vux.toast.text('请输入密码');
        return false;
      }
      this.login().then(res => {
        this.setDate(res);
      });
    },
    login() {
      return new Promise((resolve, reject) => {
        com
          .covertHttp(api.login, {
            loginName: this.phone,
            passWord: this.psd
          })
          .then(rtn => {
            if (rtn.status == 0) {
              resolve(rtn.data);
            }
          });
      });
    },
    setDate(data) {
      // await com.comSetStorage('sjboacert',{phone:data.phone}); // 安卓存储字符串可能读取失败，所以存储对象
      window.localStorage.setItem('sjboacert', JSON.stringify({ phone: data.phone }));
      com.AppLogin(this, data.phone);
      com.delAllKeepAlive(this);
      setTimeout(() => {
        this.$router.replace({ path: '/userIndex' });
      }, 1000);
    },
    test() {
      /* XHR.http(api.login,{
                loginName: this.phone,
                obj:{
                    a:1,
                    b:2,
                    c:3
                },
                arr:[{
                    val:12345
                }]
            }) */
      sdk.components.showLoading({
        title: '转啊转啊',
        success() {}
      });
      sdk.biz.http({
        headers: {
          // 'sjboacertphone': '15997435050'
        },
        params: {
          loginName: this.phone,
          obj: {
            a: 1,
            b: 2,
            c: 3
          },
          arr: [
            {
              val: 12345
            }
          ]
        },
        type: 'normal',
        url: 'http://192.168.11.32:8181/oa/wechat/notify/login',
        success(rtn) {
          console.log('success', rtn);
        },
        complete(rtn) {
          console.log('complete', rtn);
          sdk.components.hideLoading({});
        },
        fail(rtn) {
          console.log('fail', rtn);
        }
      });
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
