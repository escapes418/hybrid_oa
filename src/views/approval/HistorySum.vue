<template>
  <div class="approval_detail">
    <div class="toptitle">
      <selectorSmallBtn
        class="sumselect"
        :dataList="sumDataList"
        :sendData="sumData"
        :selectedItem.sync="sumData"
        @on-change="changeMonth"
      ></selectorSmallBtn>
      <div class="sum">
        <span class="sumtitle">已报销费用：</span>
        <span class="sumcontent">￥{{ topSum | thousands(2) }}</span>
      </div>
    </div>
    <div @click="aasdfasdf" style="color: #999999;font-size:14px;margin-left:15px;margin-top:20px">
      报销对比
    </div>
    <canvas id="histogram" height="220" style="width:100%">
      <div style="z-index:1000">123</div>
    </canvas>
    <group
      :title="item.expenseHistoryPerMonthPerSubList[0].title"
      v-for="(item, index) in dataList"
      :key="index"
    >
      <div
        class="selectbox"
        v-for="(el, idx) in item.expenseHistoryPerMonthPerSubList"
        :key="idx"
        @click="goHisItem(el)"
      >
        <div class="stitle" v-if="el.secondSubName == ''">
          {{ el.firstSubName }}<span class="sign" v-if="el.isExceed == 1">异常</span>
        </div>
        <div class="stitle" v-else>
          {{ el.firstSubName }}/{{ el.secondSubName
          }}<span class="sign" v-if="el.isExceed == 1">异常</span>
        </div>
        <div class="svalue">
          ￥{{ el.amt | thousands(2)
          }}<x-icon
            type="ios-arrow-forward"
            v-if="el.amt != 0"
            size="17"
            style="fill:#999;margin-top:-4px;vertical-align:middle"
          ></x-icon>
        </div>
      </div>
    </group>
  </div>
</template>
<script>
const F2 = require('@antv/f2');
import Vue from 'vue';
import com from '@/assets/js/common';
import api from '@/assets/api/index.api';
import selectorSmallBtn from '@/components/selectorSmallBtn';
import {
  Box,
  Confirm,
  Group,
  GroupTitle,
  XButton,
  CellFormPreview,
  Timeline,
  Popup,
  Selector,
  TimelineItem,
  Cell,
  ConfirmPlugin,
  CellBox,
  XTextarea,
  XInput,
  XDialog,
  Flexbox,
  FlexboxItem,
  TransferDomDirective as TransferDom
} from 'vux';
Vue.use(ConfirmPlugin);
export default {
  name: 'HistorySum',
  directives: {
    TransferDom
  },
  components: {
    Box,
    Confirm,
    Group,
    GroupTitle,
    Selector,
    CellFormPreview,
    XButton,
    Popup,
    Timeline,
    TimelineItem,
    Cell,
    CellBox,
    XTextarea,
    XInput,
    XDialog,
    Flexbox,
    FlexboxItem,
    selectorSmallBtn
  },
  computed: {},
  data() {
    return {
      isReady: false,
      chart: null,
      chartData: [],
      chartColors: {},
      oneMonthChartColors: {},
      threeMonthChartColors: {},
      harlfYearChartColors: {},
      topSum: 0,
      oneMonthSum: 0,
      threeMonthSum: 0,
      harlfYearSum: 0,
      sumDataList: [
        { value: '本月', key: '1' },
        { value: '近三月', key: '2' },
        { value: '近半年', key: '3' }
      ],
      oneMonthList: [],
      threeMonthList: [],
      harlfYearList: [],
      dataList: [],
      sumData: '3',
      optMap2: ['key', 'value']
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      var _this = this;
      com
        .covertHttp(api.queryExpenseHistory, { applyPerCode: _this.$route.params.userName })
        .then(rtn => {
          this.harlfYearList = rtn.data.expenseHistoryPerMonthList;
          this.threeMonthList = rtn.data.expenseHistoryPerMonthList.slice(0, 3);
          this.oneMonthList = rtn.data.expenseHistoryPerMonthList.slice(0, 1);
          this.dataList = this.harlfYearList;
          this.chartData = [];
          this.harlfYearList.forEach((item, index) => {
            var sum = 0;
            item.expenseHistoryPerMonthPerSubList.forEach((i, idx) => {
              sum += i.amt;
            });
            this.chartData.push({
              year: item.expenseHistoryPerMonthPerSubList[0].title,
              sales: sum
            });
            if (index <= 0) this.oneMonthSum = sum;
            if (index <= 2) this.threeMonthSum += sum;
            this.harlfYearSum += sum;
          });
          this.topSum = this.oneMonthSum;
          this.chartData = this.chartData.reverse();
          this.chartData.forEach((item, index) => {
            this.oneMonthChartColors[item.year] = 'rgb(82, 187, 110)';
            this.threeMonthChartColors[item.year] = 'rgb(82, 187, 110)';
            this.harlfYearChartColors[item.year] = 'rgb(82, 187, 110)';
            if (index < 5) this.oneMonthChartColors[item.year] = 'rgb(192, 224, 201)';
            if (index < 3) this.threeMonthChartColors[item.year] = 'rgb(192, 224, 201)';
          });
          this.chartColors = this.oneMonthChartColors;
          this.histogram();
        });
    },
    histogram() {
      var _this = this;
      this.chart = new F2.Chart({
        id: 'histogram',
        pixelRatio: 2
        // context: '123'
      });
      this.chart.legend(false);
      // Step 2: 载入数据源
      this.chart.source(_this.chartData, {
        sales: {
          tickCount: 5
        }
      });
      this.chart.tooltip({
        showItemMarker: false,
        onShow: function onShow(ev) {
          var items = ev.items;
          items[0].name = null;
          items[0].name = items[0].title;
          items[0].value = '¥ ' + items[0].value;
        }
      });

      this.chart
        .interval()
        .position('year*sales')
        .color('year', function(val) {
          return _this.chartColors[val];
        });
      this.chart.render();
    },

    goDetailItem() {
      this.$router.push({
        path: '/ApprovalDetail/item/' + this.$route.params.id + '/item/' + this.$route.params.taskId
      });
    },
    aasdfasdf() {
      // this.chart.changeData(data)//改变数据源
      this.chart.render();
    },
    goHisItem(el) {
      if (el.firstSubCode == '') return;
      this.$router.push({
        path: `/approval/historyItem/${el.firstSubCode}/${
          el.secondSubCode == '' ? '0' : el.secondSubCode
        }/${el.time}/${el.userLoginName}`
      });
    },
    changeMonth() {
      if (this.sumData == 1) {
        this.dataList = this.oneMonthList;
        this.topSum = this.oneMonthSum;
        this.chartColors = this.oneMonthChartColors;
      } else if (this.sumData == 2) {
        this.dataList = this.threeMonthList;
        this.topSum = this.threeMonthSum;
        this.chartColors = this.threeMonthChartColors;
      } else if (this.sumData == 3) {
        this.dataList = this.harlfYearList;
        this.topSum = this.harlfYearSum;
        this.chartColors = this.harlfYearChartColors;
      }
      this.chart.render();
    }
  }
};
</script>
<style lang="less" scoped>
.approval_detail {
  .toptitle {
    height: 37px;
    padding: 5px 15px;
    box-sizing: border-box;
    .sumselect {
      float: left;
    }
    .sum {
      float: right;
      .sumtitle {
        font-size: 14px;
        color: #999999;
      }
      .sumcontent {
        font-size: 18px;
        font-weight: 800;
        color: #000;
      }
    }
  }
  .upload-img {
    width: 100px;
    height: 80px;
    padding: 0 120px 10px;
  }
  .upload-img img {
    width: 100%;
    height: 100%;
  }
  .fixbtn {
    width: 100%;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 10px;
    box-sizing: border-box;
    z-index: 499;
    background: #f0f0f2;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .bottombtn {
    margin-top: 0 !important;
    // margin-right:10px;
  }
  .sumtitle {
    font-size: 14px;
    color: #999999;
  }
  .sumcontent {
    font-size: 17px;
    color: #333333;
  }
  .selectbox {
    display: flex;
    height: 24px;
    padding: 10px 15px;
    font-size: 17px;
    .stitle {
      height: 24px;
      position: relative;
      padding-right: 2px;
      .sign {
        font-size: 10px;
        border: 1px red solid;
        padding: 2px;
        position: absolute;
        right: -35px;
        color: red;
      }
    }
    .svalue {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      height: 24px;
      width: 100%;
      text-align: right;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.xdialog-group-textarea {
  .weui-textarea {
    text-align: left !important;
  }
}
.detail-btn {
  // margin-top: 5px;
  margin-bottom: 17px;
  text-align: center;
  text-decoration: underline;
  color: orange;
}
</style>
