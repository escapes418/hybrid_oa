<template>
  <div>
    <select>
      <option value="volvo">Volvo</option>
      <option value="saab">Saab</option>
      <option value="opel">Opel</option>
      <option value="audi">Audi</option>
    </select>
    <selectorSmallBtn
      :dataList="dataList"
      :sendData="sendData"
      :selectedItem.sync="sendData"
    ></selectorSmallBtn>
    <div v-for="index in 30" :key="index">发了金黄色的风口浪尖安徽省打李逵发货时了都快放假还</div>
    <!-- <v-chart :data="data" prevent-default>
      <v-scale x :tick-count="3" />
      <v-tooltip :show-item-marker="false" show-x-value />
      <v-line />
    </v-chart> -->
    <div @click="aasdfasdf" style="color: #999999;font-size:14px;margin-left:15px;">报销对比</div>
    <canvas id="mountNode" height="260" style="width:100%"></canvas>
  </div>
</template>
<script lang="ts">
const F2 = require('@antv/f2');
// import F2 from '@antv/f2';
import { Vue, Component } from 'vue-property-decorator';
import selectorSmallBtn from '@/components/selectorSmallBtn.vue';

// import {
//   VChart,
//   VLine,
//   VArea,
//   VBar,
//   VPie,
//   VPoint,
//   VScale,
//   VAxis,
//   VGuide,
//   VTooltip,
//   VLegend
// } from 'vux';
// import MultiPicker from 'mob-multi-picker';
// import testMultiPicker from "./testMultiPicker.vue";
// import json from './json.js';
// export default Vue.extend({});

@Component({
  components: {
    selectorSmallBtn
    // VChart,
    // VLine,
    // VArea,
    // VBar,
    // VPie,
    // VPoint,
    // VScale,
    // VAxis,
    // VGuide,
    // VTooltip,
    // VLegend
  }
})
export default class testBlank extends Vue {
  /* store */
  maskValue = '123456789';
  chart = null;
  dataList = [
    { value: '本月', key: '1' },
    { value: '近三月', key: '2' },
    { value: '近半年', key: '3' }
  ];
  sendData = '1';
  chartData = [
    {
      year: '1月',
      sales: 3400
    },
    {
      year: '2月',
      sales: 2500
    },
    {
      year: '3月',
      sales: 12000
    },
    {
      year: '4月',
      sales: 3500
    },
    {
      year: '5月',
      sales: 260
    },
    {
      year: '6月',
      sales: 18000
    }
  ];
  chartColors = {
    '1月': 'rgb(192, 224, 201)',
    '2月': 'rgb(192, 224, 201)',
    '3月': 'rgb(192, 224, 201)',
    '4月': 'rgb(82, 187, 110)',
    '5月': 'rgb(82, 187, 110)',
    '6月': 'rgb(82, 187, 110)'
  };

  created() {}

  mounted(): void {
    var _this = this;
    this.chart = new F2.Chart({
      id: 'mountNode',
      pixelRatio: 2
      // context: '123'
    });
    this.chart.legend(false);
    // Step 2: 载入数据源
    this.chart.source(_this.chartData, {
      sales: {
        tickCount: 10
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
    // this.chart.guide().text({
    //   position: ['min', 'max'],
    //   content: '单位（元）',
    //   style: {
    //     textBaseline: 'middle',
    //     textAlign: 'start'
    //   }
    //   // offsetY: -23
    // });
    // this.chart.axis("year", config:{
    //   "year":"年",
    //   "sales":"金额"

    // })
    this.chart
      .interval()
      .position('year*sales')
      .color('year', function(val) {
        console.log(val);
        return _this.chartColors[val];
      });
    this.chart.render();
  }

  aasdfasdf(): void {
    // this.chart.changeData(data)//改变数据源
    this.chart.render();
  }
}
</script>
<style lang="less" scoped>
</style>


