<template>
  <div>
    <scrollPosition>
      <div>
        <group title="信息管理列表" style="padding-top: 0.1px;">
          <cell-box
            v-for="(el, index) in dataList"
            :key="index"
            @click.native="gotoDetail(el.id)"
            class="maintainbox"
          >
            <div>
              <div class="disc-text custList">
                <div class="long-content">
                  <span class="disc-title long-title">客户编号</span>
                  <span class="long-text">{{ el.custCode }}</span>
                </div>
                <div class="long-content">
                  <span class="disc-title long-title">客户名称</span>
                  <span class="long-text font-orange">{{ el.custName }}</span>
                </div>
                <div class="long-content">
                  <span class="disc-title long-title">所属区域</span>
                  <span class="long-text">{{ el.officeName }}</span>
                </div>
                <div class="long-content" v-if="el.custCompanySize">
                  <span class="disc-title long-title">规模</span>
                  <span class="long-text">{{ el.custCompanySize }}万元/月</span>
                </div>
                <div class="long-content">
                  <span class="disc-title long-title">信用代码</span>
                  <span class="long-text">{{ el.creditCode }}</span>
                </div>
                <div class="long-content">
                  <span class="disc-title long-title">客户分级</span>
                  <span class="long-text">{{ el.custStageName }}</span>
                </div>
                <div class="long-content">
                  <span class="disc-title long-title">跟进人</span>
                  <span class="long-text">{{ el.man }}</span>
                </div>
                <div class="long-content">
                  <span class="disc-title long-title">更新时间</span>
                  <span class="long-text">{{ el.time | stamp2TextDateFull }}</span>
                </div>
              </div>
            </div>
            <!-- <div class="maintain"><x-button mini plain  @click.native.stop="goMaintain(el.id)" type="primary">维护管理</x-button></div> -->
          </cell-box>
        </group>
        <!-- <div class="fixed-btn">
                <x-button class="smallbtn" type="primary" :mini="true" @click.native="showSearchBox">筛选</x-button>
            </div> -->
        <div class="add-btn pb-15" v-if="loadmore">
          <span class="pointer" @click="clickLoadMore()">加载更多</span>
        </div>
        <div class="prompt" v-if="count == 0">
          <icon type="info" is-msg class="prompt-icon"></icon>
          <div class="mt-10">暂无数据</div>
        </div>
      </div>
    </scrollPosition>
    <div v-transfer-dom>
      <popup v-model="showSearch" position="bottom" max-height="50%">
        <group gutter="20px" label-margin-right="1em">
          <sinSelector
            sTitle="所属行业"
            sPlaceholder="请选择"
            :isRequired="true"
            :dataList="dictionary.custTrades"
            :sendData="searchOpts.custTrades"
            :selectedItem.sync="searchOpts.custTrades"
          ></sinSelector>
        </group>
        <box gap="10px 10px">
          <flexbox>
            <flexbox-item>
              <x-button type="default" @click.native="reset">重置</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button type="primary" @click.native="search">搜索</x-button>
            </flexbox-item>
          </flexbox>
        </box>
      </popup>
    </div>
  </div>
</template>
<script>
import api from '@/assets/api/index.api';
import com from '@/assets/js/common';
import XHR from '@/assets/js/XHR';
import sinSelector from '@/components/sinSelector';
import scrollPosition from '@/components/scrollPosition';
import {
  Tab,
  TabItem,
  Group,
  Cell,
  CellBox,
  Icon,
  XInput,
  Datetime,
  XButton,
  Popup,
  Box,
  Flexbox,
  FlexboxItem,
  TransferDomDirective as TransferDom
} from 'vux';
export default {
  name: 'OtherUserList',
  directives: {
    TransferDom
  },
  components: {
    Tab,
    TabItem,
    Group,
    Cell,
    CellBox,
    Icon,
    XInput,
    Datetime,
    XButton,
    Flexbox,
    FlexboxItem,
    Popup,
    Box,
    sinSelector,
    scrollPosition
  },
  data: function() {
    return {
      results: [],
      dataList: [],
      count: -1,

      // listType: this.$route.params.type,
      conflict: this.$route.params.search,
      page: 1, //当前页数
      total: 1,
      pageSize: 10,
      actPageSize: 10,

      showSearch: false,
      // 搜索条件
      searchOpts: {
        custTrades: ''
      },
      // 发送请求实际字段
      axiosOpts: {},
      todayDate: com.timeFormat(new Date().getTime()),
      dictionary: {
        custTrades: [] //所属行业
      }
    };
  },
  created() {
    this.init();
    this.getDictionary();
    com.addKeepAlive(this); //添加keep-alive
  },
  activated() {
    this.getActList({});
  },
  computed: {
    loadmore() {
      if (this.page >= this.total) {
        return false;
      } else {
        return true;
      }
    }
  },

  methods: {
    init() {
      this.page = 1;
      this.reset();
      this.getList({});
    },
    getDictionary() {
      com.comGetStorage('queryDict').then(data => {
        var getData = data.dict;
        function selectDic(type) {
          let temp = [];
          for (var i = 0; i < getData.length; i++) {
            if (getData[i].type == type) {
              temp.push({
                ...getData[i],
                key: getData[i].value,
                value: getData[i].name
              });
            }
          }
          return temp;
        }
        this.dictionary.custTrades = selectDic('cust_trades'); //所属行业
      });
    },
    //我未审批
    getList(opts) {
      var postData = {
        conflictName: this.conflict == '_' ? '' : this.conflict,
        custListPlace: 3,
        pageNo: this.page,
        pageSize: this.pageSize,
        ...this.axiosOpts,
        ...opts
      };
      com
        .covertHttp(api.custInfoList, {
          ...postData
        })
        .then(rtn => {
          this.dataList = rtn.data.list;
          this.count = parseInt(rtn.data.total) || 0;
          this.total = Math.ceil(this.count / this.pageSize);
          this.showSearch = false;
        });
    },
    getActList(opts) {
      var postData = {
        conflictName: this.conflict == '_' ? '' : this.conflict,
        custListPlace: 3,
        pageNo: 1,
        pageSize: this.actPageSize,
        ...this.axiosOpts,
        ...opts
      };
      com
        .covertHttp(api.custInfoList, {
          ...postData
        })
        .then(rtn => {
          this.dataList = rtn.data.list;
          this.count = parseInt(rtn.data.total) || 0;
          this.total = Math.ceil(this.count / this.pageSize);
          this.showSearch = false;
        });
    },
    // goApply(){
    //     this.$router.push({ path: "/customer/apply/0"});
    // },
    goMaintain(id) {
      if (id == '') return;
      this.$router.push({ path: '/customer/maintain/' + id });
    },
    gotoDetail(id) {
      return;
      if (id == '') return;
      // if (this.listType == 3) return
      // this.$router.push({ path: `/customer/detail/${id}/3`});
    },
    search() {
      // 搜索
      this.axiosOpts = { ...this.searchOpts };
      this.getList({});
    },
    showSearchBox() {
      this.showSearch = !this.showSearch;
    },
    clickLoadMore(opts) {
      this.page++;
      this.actPageSize = this.actPageSize + 10;
      var postData = {
        conflictName: this.conflict == '_' ? '' : this.conflict,
        custListPlace: 3,
        pageNo: this.page,
        pageSize: this.pageSize,
        ...this.axiosOpts,
        ...opts
      };
      com
        .covertHttp(api.custInfoList, {
          ...postData
        })
        .then(rtn => {
          this.dataList.push(...rtn.data.list);
          this.count = parseInt(rtn.data.total) || 0;
          this.total = Math.ceil(this.count / this.pageSize);
        });
    },
    reset() {
      // 重置搜索
      this.page = 1;
      this.axiosOpts = {};
      this.searchOpts = {
        custTrades: '' //所属行业
      };
    }
  }
};
</script>
<style scoped>
.fixed-btn {
  position: fixed;
  bottom: 30px;
  right: 10px;
}
.smallbtn {
  display: block !important;
}
.maintainbox {
  position: relative;
}
.cusList .maintain {
  position: absolute;
  right: 10px;
  bottom: 5px;
}
.custList .disc-title {
  width: 5.2em;
}
.custList .long-text {
  margin-left: 6.2em;
}
</style>


