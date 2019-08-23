<template>
  <div>
    <group :title="gTitle" label-margin-right="1em">
      <cell title="报销申请" @click.native="goList(1)" is-link v-if="permission.approval == 1">
        <badge v-if="approvalNum != 0" :text="approvalNum"></badge>
      </cell>
      <cell title="接待申请" @click.native="goList(5)" is-link v-if="permission.reception == 1">
        <badge v-if="receptionNum != 0" :text="receptionNum"></badge>
      </cell>
      <cell title="出差申请" @click.native="goList(4)" is-link v-if="permission.trip == 1">
        <badge v-if="travelFlow != 0" :text="travelFlow"></badge>
      </cell>
      <cell title="资源申请" @click.native="goList(6)" is-link v-if="permission.resource == 1">
        <badge v-if="resourcesApply != 0" :text="resourcesApply"></badge>
      </cell>
      <cell title="资源申请办理" @click.native="goList(7)" is-link v-if="permission.resHandle == 1">
        <badge v-if="resourcesHandle != 0" :text="resourcesHandle"></badge>
      </cell>
      <cell title="合同审核" @click.native="goList(9)" is-link v-if="permission.contract == 1">
        <badge v-if="contract != 0" :text="contract"></badge>
      </cell>
      <cell
        title="项目立项"
        @click.native="goList(10)"
        is-link
        v-if="permission.projectApproval == 1"
        ><badge v-if="projectApprovalCount != 0" :text="projectApprovalCount"></badge
      ></cell>
      <!-- <cell title="市场需求申请" @click.native="goList(2)" is-link>
                <badge v-if="marketNum != 0" :text="marketNum"></badge>
            </cell>
            <cell title="实施需求发起" @click.native="goList(3)" is-link>
                <badge v-if="implementationNum != 0" :text="implementationNum"></badge>
            </cell> -->
      <!-- <cell title="工作内务管理" v-if="false" @click.native="goList(4)" is-link>
                <badge v-if="sendNum != 0" :text="sendNum"></badge>
            </cell> -->
    </group>
  </div>
</template>
<script>
import Vue from 'vue';
import axios from '@/assets/api/axios';
import com from '@/assets/js/common';
import api from '@/assets/api/index.api';
import { Group, Cell, Badge } from 'vux';

export default {
  name: 'TaskOption',
  components: {
    Group,
    Cell,
    Badge
  },
  data() {
    return {
      type: this.$route.params.type,
      sendNum: '',
      receptionNum: '', //接待申请条数
      approvalNum: '', //报销申请条数 ,
      // implementationNum: "", //实施需求发起条数 ,
      // marketNum: "",  //市场需求申请条数 ,
      travelFlow: '', //出差
      resourcesApply: '', //资源申请
      resourcesHandle: '', //资源申请办理
      ListRecivedData: '',
      ListSendData: '',
      gTitle: '',
      contract: '',
      projectApprovalCount: '',
      permission: {
        approval: 0,
        reception: 0,
        trip: 0,
        resource: 0,
        resHandle: 0,
        contract: 0,
        projectApproval: 0
      }
    };
  },
  computed: {},
  created() {
    this.getPermission();
    this.changeTitle();
    this.init();
    com.addKeepAlive(this); //添加keep-alive
  },
  activated() {
    this.getPermission();
    this.type = this.$route.params.type;
    this.changeTitle();
    this.changeBadge();
  },
  methods: {
    getPermission() {
      com.comGetStorage('userInfo').then(res => {
        if (this.type == 'approvalListRecived') {
          var type = 'listRecived';
        } else if (this.type == 'approvalListSend') {
          var type = 'listSend';
        }
        res[type].forEach((element, index) => {
          for (let key in this.permission) {
            if (key == element) {
              this.permission[key] = 1;
            }
          }
        });
      });
    },
    init() {
      com.covertHttp(api.queryTodoCount).then(rtn => {
        //我的申请
        this.ListRecivedData = rtn.data;
        this.changeBadge();
      });
      com.covertHttp(api.queryMyApplyCount).then(rtn => {
        //带我审批
        this.ListSendData = rtn.data;
        this.changeBadge();
      });
    },
    changeTitle() {
      if (this.type == 'approvalListRecived') {
        this.gTitle = '待我审批';
      } else {
        this.gTitle = '我的申请';
      }
    },
    changeBadge() {
      if (this.type == 'approvalListRecived') {
        this.receptionNum = this.ListRecivedData.recpFlowTodoCount;
        this.approvalNum = this.ListRecivedData.expenseFlowTodoCount;
        // this.implementationNum = this.ListRecivedData.demandManagementImplementTodoCount;
        // this.marketNum = this.ListRecivedData.demandManagementMarketTodoCount;
        this.travelFlow = this.ListRecivedData.travelFlowTodoCount;
        this.resourcesApply = this.ListRecivedData.resourcesApplyTodoCount;
        this.resourcesHandle = this.ListRecivedData.resourcesHandleTodoCount;
        this.contract = this.ListRecivedData.contractFlowTodoCount;
        this.projectApprovalCount = this.ListRecivedData.projectApprovalCount;
      } else if (this.type == 'approvalListSend') {
        this.receptionNum = this.ListSendData.recpFlowApplyCount;
        this.approvalNum = this.ListSendData.expenseFlowApplyCount;
        // this.implementationNum = this.ListSendData.demandManagementImplementApplyCount;
        // this.marketNum = this.ListSendData.demandManagementMarketApplyCount;
        this.travelFlow = this.ListSendData.travelApplyCount;
        this.resourcesApply = this.ListSendData.resourcesApplyCount;
        this.resourcesHandle = this.ListSendData.resourcesHandleCount;
        this.contract = this.ListSendData.contractApplyCount;
        this.projectApprovalCount = this.ListSendData.projectApprovalCount;
      }
    },
    goList(val) {
      // console.log(val)
      if (this.type == 'approvalListRecived') {
        //待我审批进入
        if (val == 1) {
          this.$router.push({ path: '/approval/listRecived' });
        } else if (val == 2) {
          this.$router.push({ path: '/market/listRecived' });
        } else if (val == 3) {
          this.$router.push({ path: '/implementation/listRecived' });
        } else if (val == 4) {
          this.$router.push({ path: '/trip/listRecived' });
        } else if (val == 5) {
          this.$router.push({ path: '/reception/listRecived' });
        } else if (val == 6) {
          this.$router.push({ path: '/resource/listRecived' });
        } else if (val == 7) {
          this.$router.push({ path: '/resHandle/listRecived' });
        } else if (val == 9) {
          this.$router.push({ path: '/contract/listRecived' });
        } else if (val == 10) {
          this.$router.push({ path: '/projectApproval/listRecived' });
        }
      } else if (this.type == 'approvalListSend') {
        //我的申请进入
        if (val == 1) {
          this.$router.push({ path: '/approval/listSend/' });
        } else if (val == 2) {
          this.$router.push({ path: '/market/listSend' });
        } else if (val == 3) {
          this.$router.push({ path: '/implementation/listSend' });
        } else if (val == 4) {
          this.$router.push({ path: '/trip/listSend' });
        } else if (val == 5) {
          this.$router.push({ path: '/reception/listSend' });
        } else if (val == 6) {
          this.$router.push({ path: '/resource/listSend' });
        } else if (val == 7) {
          this.$router.push({ path: '/resHandle/listSend' });
        } else if (val == 9) {
          this.$router.push({ path: '/contract/listSend' });
        } else if (val == 10) {
          this.$router.push({ path: '/projectApproval/listSend' });
        }
      }
    }
  }
};
</script>
<style lang="less">
@import '../../assets/css/common/reset.fix.less';
@import '../../assets/css/common/base.less';
@import '../../assets/css/index.less';
</style>
<style>
.black {
  color: black;
}
.width-7em {
  width: 7em;
}
.weui-cells {
  margin-top: 0 !important;
}
.ml-8em {
  margin-left: 8em;
}
</style>

