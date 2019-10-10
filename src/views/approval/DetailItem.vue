<template>
  <div v-if="isReady" class="approval_detail">
    <group title="" v-if="exceedList.length != 0">
      <x-switch title="仅显示异常明细" v-model="isExceed"></x-switch>
    </group>
    <group
      v-for="(el, idx) in dataArr.flowDetailList"
      :key="idx + 14"
      :title="el.detailNo"
      label-margin-right="1em"
      v-show="!isExceed"
    >
      <cell-box>
        <div class="w-100">
          <div class="detail-text">
            <div class="long-content">
              <span class="detail-title long-title">异常分析</span>
              <span class="long-detail font-orange">{{ el.anomalyAnalysis }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">科目</span>
              <span v-if="el.subjectExceed == 1" class="long-detail font-red">{{
                el.subjectName
              }}</span>
              <span v-else class="long-detail">{{ el.subjectName }}</span>
            </div>
            <div
              v-if="el.subConfList.length > 0"
              v-for="(val, index) in el.subConfList"
              :key="index + 2"
              class="long-content"
            >
              <span class="detail-title long-title">{{ val.confDesc }}</span>
              <div v-if="val.url != ''" class="upload-img">
                <img
                  @click="showImgFn(val.urlPrefix + val.url)"
                  :src="val.urlPrefix + val.url"
                  alt=""
                />
              </div>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">发生日期</span>
              <span class="long-detail">{{ el.startDate | stamp2TextDate }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">起点</span>
              <span class="long-detail">{{ el.startPointName.join(' ') }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">结束日期</span>
              <span class="long-detail">{{ el.endDate | stamp2TextDate }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">终点</span>
              <span class="long-detail">{{ el.endPointName.join(' ') }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">人数</span>
              <span class="long-detail">{{ el.personNum }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">天数</span>
              <span class="long-detail">{{ el.dayNum }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">票据数量</span>
              <span class="long-detail">{{ el.billNum }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">报销金额</span>
              <span v-if="el.expenseAmtExceed == 1" class="long-detail font-red">{{
                el.expenseAmt | thousands(2)
              }}</span>
              <span v-else class="long-detail">{{ el.expenseAmt | thousands(2) }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">备注</span>
              <span class="long-detail">{{ el.remarks }}</span>
            </div>
          </div>
        </div>
      </cell-box>
    </group>

    <group
      v-for="(el, idx) in exceedList"
      :key="idx + 10"
      :title="el.detailNo"
      label-margin-right="1em"
      v-show="isExceed"
    >
      <cell-box>
        <div class="w-100">
          <div class="detail-text">
            <div class="long-content">
              <span class="detail-title long-title">异常分析</span>
              <span class="long-detail font-orange">{{ el.anomalyAnalysis }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">科目</span>
              <span v-if="el.subjectExceed == 1" class="long-detail font-red">{{
                el.subjectName
              }}</span>
              <span v-else class="long-detail">{{ el.subjectName }}</span>
            </div>
            <div
              v-if="el.subConfList.length > 0"
              v-for="(val, index) in el.subConfList"
              :key="index + 3"
              class="long-content"
            >
              <span class="detail-title long-title">{{ val.confDesc }}</span>
              <div v-if="val.url != ''" class="upload-img">
                <img
                  @click="showImgFn(val.urlPrefix + val.url)"
                  :src="val.urlPrefix + val.url"
                  alt=""
                />
              </div>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">发生日期</span>
              <span class="long-detail">{{ el.startDate | stamp2TextDate }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">起点</span>
              <span class="long-detail">{{ el.startPointName.join(' ') }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">结束日期</span>
              <span class="long-detail">{{ el.endDate | stamp2TextDate }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">终点</span>
              <span class="long-detail">{{ el.endPointName.join(' ') }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">人数</span>
              <span class="long-detail">{{ el.personNum }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">天数</span>
              <span class="long-detail">{{ el.dayNum }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">票据数量</span>
              <span class="long-detail">{{ el.billNum }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">报销金额</span>
              <span v-if="el.expenseAmtExceed == 1" class="long-detail font-red">{{
                el.expenseAmt | thousands(2)
              }}</span>
              <span v-else class="long-detail">{{ el.expenseAmt | thousands(2) }}</span>
            </div>
            <div class="long-content">
              <span class="detail-title long-title">备注</span>
              <span class="long-detail">{{ el.remarks }}</span>
            </div>
          </div>
        </div>
      </cell-box>
    </group>
  </div>
</template>
<script>
import Vue from 'vue';
import com from '@/assets/js/common';
import api from '@/assets/api/index.api';
import XHR from '@/assets/js/XHR';
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
  XSwitch,
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
  name: 'DetailItem',
  directives: {
    TransferDom
  },
  components: {
    Box,
    Confirm,
    Group,
    GroupTitle,
    Selector,
    XSwitch,
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
    FlexboxItem
  },
  computed: {
    // ISEDIT: function() {
    //     let result = this.dataArr.detail.modify == "modify" ? true : false;
    //     return result;
    // },
  },
  data() {
    return {
      isReady: false,
      type: '',
      exceedList: [],
      isExceed: false,
      receptionistVal: '',
      dataArr: {}
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      var params = this.$route.params;
      if (params.id) {
        if (params.type && params.type === 'item') {
          this.type = params.type;
          com
            .covertHttp(api.getApprovalDetail, {
              expenseFlowId: params.id
            })
            .then(rtn => {
              if (rtn.status != 0) {
                // this.$vux.toast.text(rtn.message) || "查询不到当前信息";
                this.$router.push({ path: '/userIndex' });
                return;
              }

              this.dataArr.flowDetailList = rtn.data.flowDetailList || [];
              // this.dataArr.flowLoglist = rtn.data.flowLoglist || [];
              this.dataArr.flowDetailList.forEach((item, index) => {
                item.subjectName = rtn.data.flowDetailList[index].subjectName.join(' ');
                if (item.anomalyAnalysis != '' && item.anomalyAnalysis) {
                  this.exceedList.push(item);
                }
              });
              this.isReady = true;
            });
        } else {
          console.log('列表type参数异常');
          console.log(params);
          this.$router.push({ path: '/userIndex' });
        }
      } else {
        console.log('参数异常');
        console.log(params);
        this.$router.push({ path: '/userIndex' });
      }
    },
    showImgFn(url) {
      sdk.components.previewImage({
        // 图片预览
        url: url,
        success: function(data) {
          console.log(data);
        },
        fail(data) {
          console.log(data);
        }
      });
    }
  }
};
</script>
<style>
.weui-switch {
  -webkit-appearance: none;
  appearance: none;
}
</style>
<style lang="less" scoped>
.approval_detail {
  .upload-img {
    width: 100px;
    height: 80px;
    padding: 0 120px 10px;
  }
  .upload-img img {
    width: 100%;
    height: 100%;
  }
}
</style>
