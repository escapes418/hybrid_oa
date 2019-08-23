<template>
  <div>
    <group title="个人主页" class="index-cell">
      <cell-box>
        <flexbox>
          <flexbox-item :span="3"
            ><img src="../../assets/img/tx.png" class="img-width60"
          /></flexbox-item>
          <flexbox-item class="font-size16">
            <div class="flex-demo">
              {{ baseInfo.userName }}
              <span class="title-tab ml-5">{{ baseInfo.officeName }}</span>
              <img src="../../assets/img/setting.png" class="settingimg" @click="goSetting" />
              <div class="mesbox" @click="goMessage">
                <img src="../../assets/img/message.png" class="mesimg" />
                <badge v-if="messageCount != '0'" class="mesbadge" :text="messageCount"></badge>
              </div>
            </div>
            <div class="flex-demo lh-25">手机：{{ baseInfo.phone }}</div>
            <div class="flex-demo lh-25">岗位：{{ baseInfo.postName }}</div>
          </flexbox-item>
        </flexbox>
        <!-- <div class="logout" @click="loginConfirm =true">退出登录</div> -->
      </cell-box>
    </group>
    <group title="个人办公" class="index-cell" v-if="myOffice == 1">
      <grid :cols="3" class="mt-15 bg-white">
        <grid-item
          :label="'报销申请'"
          @on-item-click="gotoEditApproval"
          v-if="permission['me-reimForm'] == 1"
        >
          <img slot="icon" src="../../assets/img/approval.png" />
        </grid-item>
        <grid-item
          :label="'接待申请'"
          @on-item-click="gotoReceptionApply"
          v-if="permission['me-recepList'] == 1"
        >
          <img slot="icon" src="../../assets/img/reception.png" />
        </grid-item>
        <grid-item
          :label="'线索管理'"
          @on-item-click="gotoClue"
          v-if="permission['inforManage-clueList'] == 1"
        >
          <img slot="icon" src="../../assets/img/clue.png" />
        </grid-item>
        <grid-item
          :label="'工作日志'"
          @on-item-click="gotoLog"
          v-if="permission['inforManage-logList'] == 1"
        >
          <img slot="icon" src="../../assets/img/log.png" />
        </grid-item>
        <grid-item
          :label="'客户信息管理'"
          @on-item-click="gotoCustomer"
          v-if="permission['inforManage-customerList'] == 1"
        >
          <img slot="icon" src="../../assets/img/customer.png" />
        </grid-item>
        <grid-item
          :label="'出差申请'"
          @on-item-click="gotoTrip"
          v-if="permission['me-travelingList'] == 1"
        >
          <img slot="icon" src="../../assets/img/trip.png" />
        </grid-item>
        <grid-item
          :label="'资源申请'"
          @on-item-click="gotoEditResource"
          v-if="permission['me-resourceList'] == 1"
        >
          <img slot="icon" src="../../assets/img/resource.png" />
        </grid-item>
        <grid-item
          :label="'资源申请办理'"
          @on-item-click="gotoResHandle"
          v-if="permission['me-resHandleList'] == 1"
        >
          <img slot="icon" src="../../assets/img/resHandle.png" />
        </grid-item>
        <grid-item
          :label="'实施状态标记'"
          @on-item-click="gotoempStatus"
          v-if="permission['empStatus'] == 1"
        >
          <img slot="icon" src="../../assets/img/empStatus.png" />
        </grid-item>
        <grid-item
          :label="'合同管理'"
          @on-item-click="gotoContractApply"
          v-if="permission['me-contractCheckList'] == 1"
        >
          <img slot="icon" src="../../assets/img/contract.png" />
        </grid-item>
        <grid-item
          :label="'合同归档'"
          @on-item-click="gotoContractFill"
          v-if="permission['contractFill'] == 1"
        >
          <img slot="icon" src="../../assets/img/contract.png" />
        </grid-item>
        <grid-item
          :label="'协作功能'"
          @on-item-click="gotoCoop"
          v-if="permission['oa-coopList'] == 1"
        >
          <img slot="icon" src="../../assets/img/coop.png" />
        </grid-item>
        <grid-item
          :label="'项目立项'"
          @on-item-click="gotoProjectApproval"
          v-if="permission['projectApproval'] == 1"
        >
          <img slot="icon" src="../../assets/img/btn-01.png" />
        </grid-item>
        <grid-item
          :label="'项目管理'"
          @on-item-click="gotoProject"
          v-if="permission['inforManage-projectList'] == 1"
        >
          <img slot="icon" src="../../assets/img/btn-01.png" />
        </grid-item>
        <!-- <grid-item :label="('工作内务管理')" @on-item-click="gotoHousekeeping">
                    <img slot="icon" src="../../assets/img/btn-cgx.png">
                </grid-item> -->
        <!-- <grid-item :label="('市场需求申请')" @on-item-click="gotoImplementationApply">
                    <img slot="icon" src="../../assets/img/btn-scxqsq.png">
                </grid-item>
                <grid-item :label="('实施需求发起')" @on-item-click="gotoImplementationApplyOriginate">
                    <img slot="icon" src="../../assets/img/btn-ssxqfq.png">
                </grid-item> -->
        <!-- <grid-item :label="('工作内务管理')" @on-item-click="gotoHousekeeping">
                    <img slot="icon" src="../../assets/img/btn-cgx.png">
                </grid-item> -->
        <!-- <grid-item>
                    <div style="height:52px"></div>
                </grid-item> -->
      </grid>
    </group>
    <group title="我的任务" class="index-cell" v-if="myTask == 1">
      <grid :cols="3" class="mt-15 bg-white">
        <grid-item
          class="long-content"
          :label="'待我审批'"
          @on-item-click="gotoApprovalListRecived"
          v-if="permission['listRecived'] == 1"
        >
          <badge v-if="todoCount != 0" class="badge" :text="todoCount"></badge>
          <img slot="icon" src="../../assets/img/listRecived.png" />
        </grid-item>
        <grid-item
          class="long-content"
          :label="'我的申请'"
          @on-item-click="gotoApprovalListSend"
          v-if="permission['listSend'] == 1"
        >
          <badge v-if="myApplyCount != 0" class="badge" :text="myApplyCount"></badge>
          <img slot="icon" src="../../assets/img/listSend.png" />
        </grid-item>
        <grid-item
          :label="'异常单'"
          @on-item-click="gotoExcTicket"
          v-if="permission['excTicket'] == 1"
        >
          <badge
            v-if="errorStockOrderCount != 0"
            class="badge"
            :text="errorStockOrderCount"
          ></badge>
          <img slot="icon" src="../../assets/img/excTicket.png" />
        </grid-item>
      </grid>
    </group>
    <group title="常用工具" class="index-cell" v-if="myTools == 1">
      <grid :cols="3" class="mt-15 bg-white">
        <grid-item
          class="long-content"
          :label="'贸易计算器'"
          @on-item-click="gotoCalcu"
          v-if="listTools['tool-colcu'] == 1"
        >
          <img slot="icon" src="../../assets/img/listRecived.png" />
        </grid-item>
      </grid>
    </group>
    <div v-transfer-dom>
      <confirm
        v-model="loginConfirm"
        title="是否退出登录？"
        @on-cancel="loginConfirm = false"
        @on-confirm="logout"
      >
        <p style="text-align:center;">{{ '确定执行操作?' }}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import com from '@/assets/js/common';
import XHR from '@/assets/js/XHR';
import api from '@/assets/api/index.api';
import {
  Group,
  Flexbox,
  FlexboxItem,
  Loading,
  Cell,
  Confirm,
  CellBox,
  Grid,
  Badge,
  GridItem,
  GroupTitle,
  XButton,
  TransferDomDirective as TransferDom
} from 'vux';

export default {
  name: 'UserIndex',
  directives: { TransferDom },
  components: {
    Grid,
    GridItem,
    GroupTitle,
    Group,
    Loading,
    Cell,
    CellBox,
    Badge,
    Confirm,
    Flexbox,
    FlexboxItem,
    XButton
  },
  data() {
    return {
      baseInfo: {
        userName: '',
        officeName: '',
        phone: '',
        roleList: [
          {
            name: ''
          }
        ]
      },
      loginConfirm: false,
      myApplyCount: '', //我的申请红点
      todoCount: '', //带我审批红点
      errorStockOrderCount: '', //异常单红点
      permission: {
        'me-reimForm': 0, //报销
        'me-recepList': 0, //接待
        'inforManage-clueList': 0, //线索
        'inforManage-logList': 0, //工作日志
        'inforManage-customerList': 0, //客户信息
        'me-travelingList': 0, //出差申请
        'me-resourceList': 0, //资源申请
        'me-resHandleList': 0, //资源申请办理
        empStatus: 0, //实施状态标记
        'me-contractCheckList': 0, //合同
        contractFill: 0, //合同归档
        excTicket: 0, //异常单
        listSend: 0, //我的申请
        listRecived: 0, //待我审批
        'oa-coopList': 0, //协作
        'inforManage-projectList': 0, //项目管理
        projectApproval: 0
      },
      listTools: {
        'tool-colcu': 0 //计算器
      },
      messageCount: '0',
      myTask: 1,
      myOffice: 1,
      myTools: 1
    };
  },
  created() {
    this.getPermission();
    this.init();
    this.phoneInfo();
    this.getDictionary();
    this.setAutoSave();
    this.getRedCount();
    com.addKeepAlive(this); //添加keep-alive
  },
  activated() {
    this.getRedCount();
  },
  computed: {},
  methods: {
    getPermission() {
      com.covertHttp(api.isBind).then(res => {
        if (!res.data.permissionList) {
          this.myOffice = 0;
        } else {
          res.data.permissionList.forEach((element, index) => {
            for (let key in this.permission) {
              if (key == element) {
                this.permission[key] = 1;
              }
            }
          });
        }
        if (!res.data.listTools) {
          this.myTools = 0;
        } else {
          res.data.listTools.forEach((element, index) => {
            for (let key in this.listTools) {
              if (key == element) {
                this.listTools[key] = 1;
              }
            }
          });
        }
        this.baseInfo = {
          ...res.data.userInfo,
          permission: res.data.permissionList,
          listRecived: res.data.listRecived,
          listSend: res.data.listSend
        };

        if (!res.data.listRecived && !res.data.listSend) this.myTask = 0;
        if (res.data.listRecived && res.data.listRecived.length != 0)
          this.permission['listRecived'] = 1;
        if (res.data.listSend && res.data.listSend.length != 0) this.permission['listSend'] = 1;
        com.comSetStorage('userInfo', this.baseInfo);
        // this.myApplyCount = res.data.myApplyCount;
        // this.todoCount = res.data.todoCount;
        // this.errorStockOrderCount = res.data.errorStockOrderCount || 0;
      });
    },
    init() {
      this.$store.dispatch('getAddressList');
      this.$store.dispatch('getSubjectList');
    },
    phoneInfo() {
      if (process.env.NODE_ENV == 'development') {
        // 开发
        if (process.argv[0] == 'H5') {
          // H5 命令行参数
        } else {
          // 混合开发
          this.sendPhoneInfo();
        }
      } else {
        // 正式
        this.sendPhoneInfo();
      }
    },
    sendPhoneInfo() {
      sdk.ability.fetchDeviceCode({
        success: function(res) {
          console.log({
            appVersion: res.data.appVersion,
            phoneType: res.data.phoneType,
            deviceCode: res.data.deviceCode
          });
          com
            .covertHttp(api.getLoginInfo, {
              appVersion: res.data.appVersion,
              phoneType: res.data.phoneType,
              deviceCode: res.data.deviceCode
            })
            .then(rtn => {
              // com.comSetStorage('queryDict', {dict:res.data});
              // console.log(rtn,"设备码")
            });
        },
        fail(res) {
          console.log('获取设备码失败', res);
        }
      });
    },
    setAutoSave() {
      com.comGetStorage('autoSave').then(
        rtn => {
          if (rtn == null) {
            com.comSetStorage('autoSave', {});
          }
        },
        error => {
          if (error.status == 1) {
            com.comSetStorage('autoSave', {});
          }
        }
      );
    },
    getRedCount() {
      com
        .covertHttp(
          api.findRedCount,
          {
            //消息
            readStatus: 0
          },
          false
        )
        .then(rtn => {
          this.messageCount = rtn.data.redCount;
        });
      com.covertHttp(api.queryNotifyTotalCount, {}, false).then(rtn => {
        this.myApplyCount = rtn.data.myApplyCount || 0;
        this.todoCount = rtn.data.todoCount || 0;
        this.errorStockOrderCount = rtn.data.errorStockOrderCount || 0;
      });
    },
    getDictionary() {
      com.covertHttp(api.queryDict).then(res => {
        com.comSetStorage('queryDict', { dict: res.data });
      });
      com
        .covertHttp(api.queryDictInfo, {
          dictType: 'oa_project'
        })
        .then(res => {
          com.comSetStorage('queryDictInfo', { dict: res.data });
        });
    },
    gotoApprovalListSend() {
      //我申请的列表
      this.$router.push({ path: 'TaskOption/approvalListSend' });
    },
    gotoApprovalListRecived() {
      //待我审批
      this.$router.push({ path: 'TaskOption/approvalListRecived' });
    },
    gotoEditApproval() {
      //报销申请
      this.$router.push({ path: '/approval/apply/0' });
    },
    gotoImplementationApply() {
      //市场需求申请
      this.$router.push({ path: '/market/Apply/0/0' });
    },
    gotoImplementationApplyOriginate() {
      //实施需求发起
      this.$router.push({ path: '/implementation/apply/0' });
    },
    gotoResHandle() {
      //工作内务管理
      this.$router.push({ path: '/resHandle/apply/0' });
    },
    gotoReceptionApply() {
      this.$router.push({ path: '/reception/Apply/0' });
    },
    gotoCustomer() {
      this.$router.push({ path: '/customer/cusType' });
    },
    gotoLog() {
      this.$router.push({ path: '/log/list' });
    },
    gotoClue() {
      this.$router.push({ path: '/clue/list' });
    },
    gotoHousekeeping() {
      this.$router.push({ path: '/housekeeping/apply' });
    },
    gotoempStatus() {
      this.$router.push({ path: '/empStatus/list' });
    },
    gotoCoop() {
      this.$router.push({ path: '/coop/list' });
    },
    logout() {
      var _this = this;
      // sdk.ability.removeStorage({
      //   key: "sjboacert",
      //   success: function(data) {
      //     _this.$router.push({ path: "/login" });
      //   }
      // });
      window.localStorage.removeItem('sjboacert');
      this.$router.push({ path: '/login' });
    },
    // 出差申请
    gotoTrip() {
      this.$router.push({ path: '/trip/form/0' });
    },
    goSetting() {
      //设置
      this.$router.push({ path: '/setting' });
    },
    goMessage() {
      this.$router.push({ path: '/messageList' });
    },
    // 资源申请
    gotoEditResource() {
      this.$router.push({ path: '/resource/apply' });
    },
    gotoExcTicket() {
      this.$router.push({ path: '/excTicket/comList' });
    },
    gotoContractApply() {
      this.$router.push({ path: '/contract/apply/0' });
    },
    gotoProject() {
      this.$router.push({ path: '/project/apply' });
    },
    gotoProjectApproval() {
      this.$router.push({ path: '/projectApproval/apply/1/apply' });
    },
    gotoCalcu() {
      this.$router.push({ path: '/calcu/form' });
    },
    gotoContractFill() {
      this.$router.push({ path: '/contractFill/listSend' });
    }
  }
};
</script>
<style>
.weui-grids {
  margin-top: 0 !important;
}
.index-cell {
  position: relative;
}
.logout {
  color: blue;
  position: absolute;
  right: 15px;
  bottom: 10px;
}
.badge {
  position: absolute;
  top: 10px;
  right: 10px;
}
.mesbox {
  position: relative;
  float: right;
  margin-right: 16px;
}
.settingimg {
  width: 20px;
  height: 20px;
  float: right;
}
.mesimg {
  width: 20px;
  height: 20px;
}
.mesbadge {
  position: absolute;
  top: -10px;
  left: 7px;
}
</style>
