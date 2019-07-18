<template>
  <div>
    <div>
      <!-- 我未审批 -->
      <search
        @on-submit="goSearch"
        :auto-fixed="false"
        v-model.trim="conflictName"
        @on-cancel="onSearchCancel"
        @on-clear="onSearchCancel"
        placeholder="查冲突"
      ></search>
      <group title="客户信息管理" label-margin-right="1em">
        <cell title="公海" @click.native="goList('highSea')" is-link>
          <span slot="title"
            >公海<span v-if="listData.highSeasNum != 0">（{{ listData.highSeasNum }}）</span></span
          >
        </cell>
        <cell title="区域公海" @click.native="goList('regionSea')" is-link>
          <span slot="title"
            >区域公海<span v-if="listData.regionSeasNum != 0"
              >（{{ listData.regionSeasNum }}）</span
            ></span
          >
        </cell>
        <cell title="其他个人/区域用户" @click.native="goList('otherUser')" is-link>
          <span slot="title"
            >其他个人/区域用户<span v-if="listData.otherNum != 0"
              >（{{ listData.otherNum }}）</span
            ></span
          >
        </cell>
        <cell title="个人用户" @click.native="goList('own')" is-link>
          <span slot="title"
            >个人用户<span v-if="listData.ownNum != 0">（{{ listData.ownNum }}）</span></span
          >
        </cell>
        <cell title="签约用户" @click.native="goList('signing')" is-link>
          <span slot="title"
            >签约用户<span v-if="listData.signingNum != 0"
              >（{{ listData.signingNum }}）</span
            ></span
          >
        </cell>
      </group>
      <div class="add-btn mb-15">
        <span class="pointer" @click="addCus()">新增客户</span>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/assets/api/index.api';
import com from '@/assets/js/common';
import XHR from '@/assets/js/XHR';
import {
  Tab,
  TabItem,
  Group,
  Cell,
  Search,
  CellBox,
  Icon,
  XInput,
  Badge,
  XButton,
  Popup,
  Box,
  Flexbox,
  FlexboxItem,
  TransferDomDirective as TransferDom
} from 'vux';
export default {
  name: 'CustomerCusType',
  directives: {
    TransferDom
  },
  components: {
    Tab,
    TabItem,
    Group,
    Cell,
    Search,
    CellBox,
    Icon,
    XInput,
    Badge,
    XButton,
    Flexbox,
    FlexboxItem,
    Popup,
    Box
  },
  data: function() {
    return {
      conflictName: '',
      // 搜索条件
      listData: {
        highSeasNum: 0,
        regionSeasNum: 0,
        otherNum: 0,
        ownNum: 0,
        signingNum: 0
      },
      searchOpts: {
        custInfoName: '', // 客户名称
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      // 发送请求实际字段
      axiosOpts: {},
      todayDate: com.timeFormat(new Date().getTime()),
      searchTest: '',
      custMaxCount: 30,
      dict: []
    };
  },
  created() {
    this.goSearch();
    // this.getDictionary()
    this.init();
    com.addKeepAlive(this); //添加keep-alive
  },
  computed: {},

  methods: {
    init() {
      var _this = this;
      com.comGetStorage('queryDict').then(data => {
        var getData = data.dict;
        // console.log(this.dict)
        getData.forEach((item, index) => {
          if (item.type == 'cust_max_count') {
            _this.custMaxCount = item.name;
          }
        });
      });
    },
    onSearchCancel() {
      // console.log("123")
      this.conflictName = '';
      this.goSearch();
    },
    // getDictionary() {
    //     com.covertHttp(api.queryDict).then(res => {
    //         var getData = res.data;
    //         getData.forEach((item,index)=>{
    //             if(item.type == "cust_max_count"){
    //                 this.custMaxCount = item.name
    //             }
    //         })
    //     });
    // },
    goSearch() {
      var reg = new RegExp(
        "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%_]"
      );
      if (reg.test(this.conflictName)) {
        this.$vux.toast.text('请勿输入非法字符');
        return;
      }
      com
        .covertHttp(api.custInfoListNum, {
          conflictName: this.conflictName
        })
        .then(rtn => {
          if (rtn.status == 0) {
            this.listData = rtn.data;
          }
        });
    },
    goList(num) {
      var search = this.conflictName == '' ? '_' : this.conflictName;
      this.$router.push({ path: `/customer/${num}/list/${search}` });
    },
    addCus() {
      var _this = this;
      if (this.listData.ownNum >= this.custMaxCount) {
        this.$vux.confirm.show({
          title: '无法新增客户',
          content: `个人客户已超过${_this.custMaxCount}家，请先开放部分客户后才可新增或捡入`,
          onCancel() {},
          onConfirm() {}
        });
      } else {
        this.$router.push({ path: '/customer/apply/0' });
      }
    }
  }
};
</script>
<style>
.fixed-btn {
  position: fixed;
  bottom: 40px;
  right: 10px;
}
.smallbtn {
  display: block !important;
}
.maintainbox {
  position: relative;
}
.maintain {
  position: absolute;
  right: 15px;
  bottom: 10px;
}
.slide {
  padding: 0 20px;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
}
.animate {
  max-height: 9999px;
  transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
  transition-delay: 0s;
}
</style>


