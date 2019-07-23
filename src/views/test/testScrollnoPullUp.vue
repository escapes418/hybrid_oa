<template>
  <div class="scrolllist">
    <tab class="teb" v-model="tabIndex" @on-before-index-change="switchTabItem">
      <tab-item selected>进行中</tab-item>
      <tab-item>已完成</tab-item>
    </tab>
    <div class="wrapper" ref="bsWrapper">
      <div>
        <div class="pulldown-wrapper">
          <div v-show="beforePullDown">
            <span>下拉刷新</span>
          </div>
          <div v-show="!beforePullDown">
            <div v-show="isPullingDown">
              <span>刷新中...</span>
            </div>
            <div v-show="!isPullingDown"><span>刷新成功</span></div>
          </div>
        </div>
        <div v-for="(el, index) in mysendList" :key="index" @click.native="gotoDetail(el.id)">
          <div class="w-100">
            <div class="disc-text">
              <div class="content-title">
                {{ el.applyPerName }}
                <span>发起的合同审核申请</span>
              </div>
              <div class="long-content">
                <span class="disc-title long-title">部门名称</span>
                <span class="long-text">{{ el.officeName }}</span>
              </div>
              <div class="long-content">
                <span class="disc-title long-title">流程编号</span>
                <span class="long-text">{{ el.procCode }}</span>
              </div>
              <div class="long-content">
                <span class="disc-title long-title">申请时间</span>
                <span class="long-text">{{ el.applyTime | stamp2TextDateFull }}</span>
              </div>
              <div class="long-content">
                <span class="disc-title long-title">当前状态</span>
                <span class="long-text font-orange">{{ el.contractFlowStatusTxt }}</span>
              </div>
              <div class="long-content">
                <span class="disc-title long-title">备注</span>
                <span class="long-text">{{ el.remarks }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pullup-wrapper" v-if="count !== 0">
          <div v-if="!isPullUpLoad && showloadmore" class="before-trigger">
            <span class="pullup-txt">上拉加载更多</span>
          </div>
          <div v-if="isPullUpLoad && showloadmore" class="after-trigger">
            <span class="pullup-txt">加载中</span>
          </div>
          <div v-if="!showloadmore && count !== -1" class="after-trigger">
            <span class="pullup-txt">暂无更多</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <group v-if="count!==0">
            <div>asdfasdf</div>
            <cell-box v-for="(el,index) in mysendList" :key="index" @click.native="gotoDetail(el.id)">
                <div class="w-100">
                    <div class="disc-text">
                        <div class="content-title">{{el.applyPerName}}
                            <span>发起的合同审核申请</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">部门名称</span>
                            <span class="long-text">{{el.officeName}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">流程编号</span>
                            <span class="long-text">{{el.procCode}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">申请时间</span>
                            <span class="long-text">{{el.applyTime | stamp2TextDateFull}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">当前状态</span>
                            <span class="long-text font-orange">{{el.contractFlowStatusTxt}}</span>
                        </div>
                        <div class="long-content">
                            <span class="disc-title long-title">备注</span>
                            <span class="long-text">{{el.remarks}}</span>
                        </div>
                    </div>
                </div>
            </cell-box>
        </group>
        </div> -->
    <div class="fixed-btn">
      <!-- <x-button type="primary" :mini="true" @click.native="showSearchBox">筛选</x-button> -->
      <x-button type="primary" :mini="true" @click.native="move2LastPosition">点电脑</x-button>
    </div>
    <!-- <div class="add-btn mb-15" v-if="loadmore">
            <span class="pointer" @click="clickLoadMore()">点击加载更多</span>
        </div> -->
    <!-- <div>{{loadmore}}</div> -->
    <div class="prompt" v-if="count === 0">
      <icon type="info" is-msg class="prompt-icon"></icon>
      <div class="mt-10">暂无数据</div>
    </div>
    <div v-transfer-dom>
      <popup v-model="showSearch" position="bottom" max-height="70%">
        <group gutter="20px" label-margin-right="1em">
          <x-input
            title="姓名"
            :max="50"
            v-model.trim="searchOpts.applyPerName"
            placeholder="请输入申请人姓名"
          ></x-input>
          <x-input
            title="流程/合同编号"
            :max="50"
            v-model.trim="searchOpts.queryText"
            placeholder="请输入流程/合同编号"
          ></x-input>
          <x-input
            title="部门名称"
            :max="50"
            v-model.trim="searchOpts.officeName"
            placeholder="请输入部门名称"
          ></x-input>
          <x-input
            title="合同方名称"
            :max="50"
            v-model.trim="searchOpts.contractPartyName"
            placeholder="请输入合同方名称"
          ></x-input>
          <datetime
            format="YYYY-MM-DD"
            v-model="searchOpts.applyTimeStart"
            class="data-time"
            title="开始时间"
            :end-date="todayDate"
            placeholder="请选择申请开始时间"
          ></datetime>
          <datetime
            format="YYYY-MM-DD"
            v-model="searchOpts.applyTimeEnd"
            class="data-time"
            title="结束时间"
            :end-date="todayDate"
            placeholder="请选择申请结束时间"
          ></datetime>
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
// import Vue from "vue";
import BScroll from 'better-scroll';
import api from '@/assets/api/index.api';
import com from '@/assets/js/common';
// import XHR from "@/assets/js/XHR";
import sinSelector from '@/components/sinSelector';
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
  name: 'ScrollList',
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
    sinSelector,
    Popup,
    Box
  },
  data() {
    return {
      tabIndex: 0,
      mysendList: [],
      count: -1,
      page: 1, //当前页数,
      pageTotal: 1,
      pageSize: 50, //固定常量
      // 搜索条件
      showSearch: false,
      // scroll:null,
      movePosition: {
        x: 0,
        y: -20
      },
      searchOpts: {
        applyPerName: '', // 申请人姓名
        queryText: '',
        officeName: '', // 部门名称
        applyTimeStart: '', // 开始时间
        applyTimeEnd: '', // 结束时间
        officeId: '',
        contractPartyName: ''
      },
      // 发送请求实际字段
      axiosOpts: {},
      todayDate: com.timeFormat(new Date().getTime()),
      beforePullDown: true,
      isPullingDown: false,
      isPullUpLoad: false,
      showloadmore: false,
      TIME_STOP: 600,
      TIME_BOUNCE: 800
    };
  },
  created() {
    this.getMysendList(this.expenseStatus);
    com.addKeepAlive(this); //添加keep-alive
  },
  mounted() {
    var _this = this;
    this.$nextTick(() => {
      if (!this.scroll) {
        // let wrapper = document.querySelector('.wrapper')
        this.scroll = new BScroll(this.$refs.bsWrapper, {
          probeType: 3,
          click: true
          // pullUpLoad: true,
          // pullUpLoad: {
          //     threshold: -100 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
          // }
          // pullDownRefresh: {
          //     threshold: 70,
          //     stop: 56,
          // }
        });
        this.scroll.on('scrollEnd', e => {
          console.log(e);
          this.movePosition = e;
        });
        // this.scroll.on("pullingUp", () => {
        //     console.log("pullingUp")
        //     setTimeout(() => {
        //         _this.pullingDownUpFinish()
        //     }, 20);
        // });
        // this.scroll.on("pullingUp",this.pullingUp)
        // this.scroll.on('pullingDown',this.pullingDown)
      }
    });
  },
  activated() {},
  watch: {
    async expenseStatus(newVal, val) {
      // 切换时重新从第一页开始获取数据
      if (newVal == val) return;
      // this.page = 1;
      await this.getMysendList(this.expenseStatus);
      console.log('expenseStatus');
      this.refresh();
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
      console.log('loadmore');
      if (this.page >= this.pageTotal) {
        console.log('loadmore');
        this.scroll.openPullUp();
        return false;
      } else {
        console.log('loadmore');
        this.scroll.openPullUp();
        return true;
      }
    }
  },
  methods: {
    move2LastPosition() {
      this.scroll.scrollTo(this.movePosition.x, this.movePosition.y);
    },
    toscroll(e) {
      console.log(e);
    },
    showSearchBox() {
      this.showSearch = !this.showSearch;
    },
    // 获取数据
    getMysendList(type, opts) {
      this.page = 1;
      return new Promise(resolve => {
        var postData = {
          pageNo: this.page,
          pageSize: this.pageSize,
          ...this.axiosOpts,
          ...opts
        };
        // console.log(this.searchOpts.applyTimeStart)
        com
          .covertHttp(api.queryMyContractFlowList, {
            ...postData,
            applyTimeStart: com.timeParse(this.searchOpts.applyTimeStart),
            applyTimeEnd: this.searchOpts.applyTimeEnd
              ? com.timeParse(this.searchOpts.applyTimeEnd) + 86400000
              : 0,
            contractFlowStatus: type
          })
          .then(rtn => {
            // console.log('sdsds',rtn);
            this.mysendList = rtn.data.list;
            // 重新计算总页数
            this.count = parseInt(rtn.data.total) || 0;
            this.pageTotal = Math.ceil(this.count / this.pageSize);
            this.isloadmore();
            resolve();
          });
      });
    },
    //加载更多
    clickLoadMore(opts) {
      console.log('loadmore');
      return new Promise(resolve => {
        this.page++;
        var postData = {
          // ...postData,
          pageNo: this.page,
          pageSize: this.pageSize,
          ...this.axiosOpts,
          ...opts
        };
        com
          .covertHttp(api.queryMyContractFlowList, {
            ...postData,
            applyTimeStart: com.timeParse(this.searchOpts.applyTimeStart),
            applyTimeEnd: this.searchOpts.applyTimeEnd
              ? com.timeParse(this.searchOpts.applyTimeEnd) + 86400000
              : 0,
            contractFlowStatus: this.expenseStatus
          })
          .then(rtn => {
            this.mysendList.push(...rtn.data.list);
            this.count = parseInt(rtn.data.total) || 0; // 重新计算总页数
            this.pageTotal = Math.ceil(this.count / this.pageSize);
            this.isloadmore();
            resolve();
          });
      });
      // this.page++;
      // var postData = {
      //     // ...postData,
      //     pageNo: this.page,
      //     pageSize: this.pageSize,
      //     ...this.axiosOpts,
      //     ...opts
      // };
      // com.covertHttp(api.queryMyContractFlowList, {
      //     ...postData,
      //     applyTimeStart:com.timeParse(this.searchOpts.applyTimeStart),
      //     applyTimeEnd:this.searchOpts.applyTimeEnd?com.timeParse(this.searchOpts.applyTimeEnd)+86400000:0,
      //     contractFlowStatus: this.expenseStatus
      // }).then(rtn => {
      //     this.mysendList.push(...rtn.data.list);
      //     this.count = parseInt(rtn.data.total) || 0; // 重新计算总页数
      //     this.pageTotal = Math.ceil(this.count / this.pageSize);
      //     this.isloadmore()
      // });
    },
    isloadmore() {
      console.log('loadmore');
      if (this.page >= this.pageTotal) {
        console.log('loadmorefalse');
        this.scroll.closePullUp();
        this.showloadmore = false;
      } else {
        console.log('loadmoretrue');
        this.scroll.openPullUp({ threshold: -110 });
        this.showloadmore = true;
      }
    },
    async switchTabItem(index) {
      this.reset();
      await this.getMysendList(this.expenseStatus);
      console.log('switchTabItem');
    },
    // 跳转
    gotoDetail(id) {
      if (id == '') return;
      this.$router.push({ path: '/contract/detail/' + id + '/myself/0' });
    },
    search() {
      // 搜索
      if (
        this.searchOpts.applyTimeEnd != '' &&
        new Date(this.searchOpts.applyTimeEnd) < new Date(this.searchOpts.applyTimeStart)
      ) {
        this.$vux.toast.text('结束时间需大于开始时间');
        return;
      }
      this.axiosOpts = { ...this.searchOpts };
      // this.page = 1;
      this.getMysendList(this.expenseStatus);
    },
    reset() {
      // 重置搜索
      // this.page = 1;
      this.axiosOpts = {};
      this.searchOpts = {
        applyPerName: '',
        queryText: '',
        officeName: '',
        applyTimeStart: '',
        applyTimeEnd: '',
        officeId: '',
        contractPartyName: ''
      };
    },
    requestData() {
      return new Promise(resolve => {
        setTimeout(() => {
          // const dataList = getOneRandomList()
          resolve();
        }, 2000);
      });
    },
    async pullingDown() {
      console.log('pullingDown', new Date());
      this.beforePullDown = false;
      this.isPullingDown = true;
      await this.getMysendList(this.expenseStatus);
      console.log('requestData');
      this.isPullingDown = false;
      this.pullingDownFinish();
      // setTimeout(() => {//getdata
      //     this.beforePullDown = true
      //     this.isPullingDown = true
      //     _this.pullingDownUp()
      // }, 1000);
    },
    async pullingDownFinish() {
      const stopTime = this.TIME_STOP;
      const timeBounce = this.TIME_BOUNCE;
      var _this = this;
      await new Promise(resolve => {
        setTimeout(() => {
          console.log('finishPullDown');
          _this.scroll.finishPullDown();
          resolve();
        }, stopTime);
      });
      setTimeout(() => {
        _this.beforePullDown = true;
        console.log('refresh');
        _this.refresh();
      }, timeBounce);

      // this.scroll.finishPullDown()
      // this.scroll.finishPullUp()
      // this.scroll.refresh() //重新计算元素高度
    },

    async pullingUp() {
      this.isPullUpLoad = true;
      console.log('pullingUp-----------------------');
      await this.clickLoadMore();
      console.log('finishPullUp');
      // this.scroll.finishPullUp()
      this.refresh();
      this.isPullUpLoad = false;
    },
    refresh() {
      // setTimeout(() => {
      //     this.scroll.refresh()
      // }, 20)
      this.$nextTick(() => {
        console.log('refresh');
        this.scroll.refresh();
      });
    }
  }
};
</script>
<style lang="less" scoped>
.fixed-btn {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 12;
}

.scrolllist {
  .teb {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11;
  }
  .wrapper {
    width: 100%;
    // height: 100%;
    position: fixed;
    top: 44px;
    bottom: 0;
    left: 0;
    z-index: 10;
    // padding-bottom: 44px;
    box-sizing: border-box;
    overflow: hidden;
  }
  // .wrapper{
  //     width: 100%;
  //     height: 100%;
  //     position: fixed;
  //     top: 44px;
  //     left: 0;
  //     z-index: 10;
  //     padding-bottom: 44px;
  //     box-sizing: border-box;
  //     overflow: hidden;
  // }
  .pulldown-wrapper {
    position: absolute;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    transform: translateY(-100%) translateZ(0);
    text-align: center;
    color: #999;
  }
  .pullup-wrapper {
    padding: 20px;
    text-align: center;
    color: #999;
  }
}
</style>

