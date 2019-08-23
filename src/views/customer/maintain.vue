<template>
  <div>
    <group title="基本信息" label-margin-right="1em">
      <datetime
        format="YYYY-MM-DD"
        readonly
        class="data-time"
        v-model="custMaintenanceDate"
        title="维护时间"
        placeholder="请选择时间"
      ></datetime>
      <sinSelector
        :isRequired="true"
        sTitle="客户级别"
        sPlaceholder="请选择"
        :dataList="dictionary.custStage"
        :sendData="applyData.custStage"
        :selectedItem.sync="applyData.custStage"
      ></sinSelector>
      <sinSelector
        :isRequired="true"
        sTitle="联系人"
        sPlaceholder="请选择"
        :dataList="linkmanList"
        :sendData="applyData.linkmanId"
        :selectedItem.sync="applyData.linkmanId"
        @on-change="changeLinkman"
      ></sinSelector>
      <sinSelector
        :isRequired="true"
        sTitle="拜访类型"
        sPlaceholder="请选择"
        :dataList="dictionary.visitType"
        :sendData="applyData.visitType"
        :selectedItem.sync="applyData.visitType"
      ></sinSelector>
      <!-- <x-input title="问题责任人" placeholder="请输入" v-model.trim="applyData.custPersonLiable"></x-input> -->
      <x-textarea
        title="维护内容"
        placeholder="请输入说明"
        :max="1000"
        :rows="3"
        v-model.trim="applyData.custMaintenanceContent"
      >
        <span slot="label" style="padding-right:20px;"
          >维护内容<span class="required">*</span></span
        >
      </x-textarea>
      <!-- <x-textarea title="主要问题" placeholder='请输入说明' v-model.trim="applyData.custMaintenanceProblem"></x-textarea> -->
      <x-textarea
        title="备注"
        placeholder="请输入说明"
        :max="200"
        :rows="3"
        v-model.trim="applyData.remarks"
      ></x-textarea>
    </group>
    <!-- <group title='维护记录' v-if="DetailList.length != 0">
                <cell-box v-for="(el,index)  in DetailList" :key="index" class="maintainbox">
                    <div>
                        <div class="disc-text">
                            <div class="long-content">
                                <span class="mdisc-title mlong-title">维护时间</span>
                                <span class="mlong-text">{{el.custMaintenanceDate|stamp2TextDateFull}}</span>
                            </div>
                            <div class="long-content">
                                <span class="mdisc-title mlong-title">维护人11</span>
                                <span class="mlong-text font-orange">{{el.custPersonLiable}}</span>
                            </div>
                            <div class="long-content">
                                <span class="mdisc-title mlong-title">客户级别</span>
                                <span class="mlong-text">{{el.custStageName}}</span>
                            </div>
                            <div class="long-content">
                                <span class="mdisc-title mlong-title">联系人</span>
                                <span class="mlong-text">{{el.linkmanName}}</span>
                            </div>
                            <div class="long-content">
                                <span class="mdisc-title mlong-title">拜访类型</span>
                                <span class="mlong-text">{{el.visitTypeName}}</span>
                            </div>
                            <div class="long-content">
                                <span class="mdisc-title mlong-title">维护类容</span>
                                <span class="mlong-text">{{el.custMaintenanceContent}}</span>
                            </div>
                            <div class="long-content">
                                <span class="mdisc-title mlong-title">备注</span>
                                <span class="mlong-text">{{el.remarks}}</span>
                            </div>
                        </div>
                    </div>
                </cell-box>
            </group>
            <div class="add-btn mb-15" v-if="loadmore">
                <span class="pointer" @click="clickLoadMore()">加载更多</span>
            </div> -->
    <box gap="10px 10px">
      <flexbox>
        <flexbox-item>
          <x-button
            type="primary"
            class="mt-15"
            :disabled="isSubmit"
            @click.native="isSubmit = true"
            >保存</x-button
          >
        </flexbox-item>
      </flexbox>
    </box>
    <div v-transfer-dom>
      <confirm v-model="isSubmit" title="保存" @on-cancel="isSubmit = false" @on-confirm="submit">
        <p style="text-align:center;">{{ '确定执行操作?' }}</p>
      </confirm>
    </div>
  </div>
</template>
<script>
import api from '@/assets/api/index.api';
import com from '@/assets/js/common';
import sinSelector from '@/components/sinSelector';
import XHR from '@/assets/js/XHR';
import { mapState, mapGetters } from 'vuex';
import {
  XAddress,
  Box,
  Popup,
  Checklist,
  Search,
  Group,
  Cell,
  XDialog,
  CellBox,
  Icon,
  XButton,
  PopupPicker,
  XInput,
  XTextarea,
  Selector,
  Confirm,
  Calendar,
  Datetime,
  Flexbox,
  FlexboxItem,
  TransferDomDirective as TransferDom
} from 'vux';
export default {
  name: 'CustomerMaintain',
  directives: {
    TransferDom
  },
  components: {
    Box,
    Group,
    Cell,
    CellBox,
    XButton,
    Popup,
    PopupPicker,
    Checklist,
    Datetime,
    Search,
    XInput,
    XTextarea,
    Selector,
    Confirm,
    Icon,
    Calendar,
    Flexbox,
    FlexboxItem,
    XAddress,
    XDialog,
    sinSelector
  },

  data: function() {
    return {
      isSubmit: false,
      paramsId: this.$route.params.id,
      custMaintenanceDate: com.timeFormat(new Date().getTime()),
      linkmanList: [],
      applyData: {
        custId: this.$route.params.id, //客户id
        custMaintenanceContent: '', //维护内容
        custStage: '', //客户级别
        linkmanId: '', //联系人ID
        visitType: '', //拜访类型
        linkmanName: '',
        // custMaintenanceDate: new Date().getTime(),//维护时间
        // custMaintenanceProblem: "",//主要问题
        // custMaintenanceType: "",//维护类型:一般客户，高意向客户，已签约，已上线，全上线
        custName: '', //客户名称 ,
        // custPersonLiable: "",//问题责任人
        id: '',
        remarks: ''
      },
      DetailList: [],
      dictionary: {
        //字典
        visitType: [], //拜访类型
        custStage: [] //客户类型
      },
      count: -1,
      page: 1, //当前页数,
      pageTotal: 1,
      pageSize: 10, //固定常量
      disSubmit: false,
      oldCustStage: ''
    };
  },
  computed: {
    loadmore() {
      if (this.page >= this.pageTotal) {
        return false;
      } else {
        return true;
      }
    }
  },
  created() {
    this.init();
    // this.getAddressData();
    this.getCustLinkman(); //获取联系人信息
  },
  watch: {},
  mounted() {
    this.getDictionary();
  },
  methods: {
    // getAddressData() {
    //     if (this.addressData.length == 0) {
    //         com.covertHttp(api.areaInfo).then(res => {
    //             this.$store.dispatch("setAddressData", res.data);
    //         });
    //     }
    // },
    getCustLinkman() {
      com.covertHttp(api.findCustLinkman, { custId: this.paramsId }).then(res => {
        res.data.forEach((item, index) => {
          this.linkmanList.push({
            ...item,
            value: item.linkmanName,
            key: item.id
          });
        });
      });
    },
    changeLinkman() {
      for (let i in this.linkmanList) {
        if (this.applyData.linkmanId == this.linkmanList[i].id) {
          this.applyData.linkmanName = this.linkmanList[i].linkmanName;
          break;
        }
      }
      // console.log(this.applyData.linkmanName)
    },
    getDictionary() {
      com.comGetStorage('queryDict').then(data => {
        var getData = data.dict;
        getData.forEach((item, index) => {
          getData[index] = {
            ...item,
            key: item.value,
            value: item.name
          };
        });
        function selectDic(arr, type) {
          let temp = [];
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].type == type) {
              temp.push(arr[i]);
            }
          }
          return temp;
        }
        this.dictionary.visitType = selectDic(getData, 'visit_type'); //拜访类型
        this.dictionary.custStage = selectDic(getData, 'cust_stage'); //客户级别
      });
    },
    init() {
      if (this.$route.params.id == 0) {
      } else {
        // 编辑
        // 处理编辑逻辑
        this.getDetail().then(rtnData => {
          // 基础参数赋值
          this.DetailList = rtnData.list;
          this.count = parseInt(rtnData.total) || 0;
          this.pageTotal = Math.ceil(this.count / this.pageSize);
          this.oldCustStage = this.DetailList[0].custStage;
          // console.log(this.oldCustStage);
        });
      }
    },
    getDetail() {
      return new Promise((resolve, reject) => {
        com
          .covertHttp(api.custMaintenanceList, {
            custId: this.paramsId,
            pageNo: this.page,
            pageSize: this.pageSize
          })
          .then(rtn => {
            resolve(rtn.data);
          });
      });
    },
    clickLoadMore() {
      this.page = this.page + 1;
      com
        .covertHttp(api.custMaintenanceList, {
          custId: this.paramsId,
          pageNo: this.page,
          pageSize: this.pageSize
        })
        .then(rtn => {
          this.DetailList.push(...rtn.data.list);
          // 重新计算总页数
          this.count = parseInt(rtn.data.total) || 0;
          this.pageTotal = Math.ceil(this.count / this.pageSize);
        });
    },
    submit() {
      var _this = this;
      if (!this.valid()) return;
      com.covertHttp(api.saveCustMaintenance, this.applyData).then(res => {
        if (res.status == 0) {
          this.$vux.toast.text(res.message || '保存成功');
          com.delKeepAlive(_this, ['CustomerCusType']);
          if (
            (this.oldCustStage == 'D' ||
              this.oldCustStage == 'E' ||
              this.oldCustStage == 'F' ||
              this.oldCustStage == 'D') &&
            (this.applyData.custStage == 'A' ||
              this.applyData.custStage == 'B' ||
              this.applyData.custStage == 'C')
          ) {
            _this.$vux.confirm.show({
              // 组件除show外的属性
              title: '温馨提示',
              content: '保存成功，签约客户（C级以上）可以申请立项，是否前去立项？',
              onCancel() {
                _this.$router.push({ path: '/userIndex' });
              },
              onConfirm() {
                _this.$router.push({
                  path: '/projectApproval/apply/' + _this.$route.params.id + '/jump'
                });
                // com.delKeepAlive(_this,["ResHandleApply"])
              }
            });
          } else {
            this.$router.push({ path: '/userIndex' });
          }
        }
      });
    },
    valid() {
      // 整体校验
      var flag = true;
      if (this.applyData.custStage == '') {
        this.$vux.toast.text('请填选择客户级别');
        return (flag = false);
      }
      if (this.applyData.linkmanId == '') {
        this.$vux.toast.text('请填选择联系人');
        return (flag = false);
      }
      if (this.applyData.visitType == '') {
        this.$vux.toast.text('请选择拜访类型');
        return (flag = false);
      }
      if (this.applyData.custMaintenanceContent == '') {
        this.$vux.toast.text('请填写维护内容');
        return (flag = false);
      }

      return flag;
    }
  }
};
</script>
<style scoped lang="less">
.mlong-text {
  float: left;
  margin-left: 6.5em;
}

.mdisc-title {
  position: absolute;
  left: 0;
  top: 0;
  display: inline-block;
  color: #99a9bf;
  width: 6.5em;
  text-align: justify;
  text-align-last: justify;
}
.mlong-text {
  float: left;
  margin-left: 7.5em;
}
</style>

