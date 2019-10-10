import EditApproval from '@/views/approval/Apply.vue'; //报销申请
import ApprovalListSend from '@/views/approval/ListSend.vue'; //我的报销申请列表
import ApprovalListRecived from '@/views/approval/ListRecived.vue'; //带我审批报销申请列表
import ApprovalDetail from '@/views/approval/Detail.vue'; //报销申请详情
import ApprovalDetailItem from '@/views/approval/DetailItem.vue';
import ApprovalHistoryItem from '@/views/approval/HistoryItem.vue';
import ApprovalHistorySum from '@/views/approval/HistorySum.vue';

export default [
  {
    path: '/approval/listSend',
    name: 'ApprovalListSend',
    component: ApprovalListSend,
    meta: {
      docTitle: '报销申请列表'
    }
  },
  {
    path: '/approval/listRecived',
    name: 'ApprovalListRecived',
    component: ApprovalListRecived,
    meta: {
      docTitle: '报销申请列表'
    }
  },
  {
    path: '/approval/apply/:id',
    name: 'EditApproval',
    component: EditApproval,
    meta: {
      docTitle: '报销申请'
    }
  },
  {
    path: '/approval/detail/:id/:type/:taskId',
    name: 'ApprovalDetail',
    component: ApprovalDetail,
    meta: {
      docTitle: '审批详情'
    }
  },
  {
    path: '/approvalDetail/item/:id/:type/:taskId',
    name: 'ApprovalDetailItem',
    component: ApprovalDetailItem,
    meta: {
      docTitle: '查看科目明细'
    }
  },
  {
    path: '/approval/historyItem/:firstSubCode/:secondSubCode/:time/:userLoginName',
    name: 'ApprovalHistoryItem',
    component: ApprovalHistoryItem,
    meta: {
      docTitle: '历史报销明细'
    }
  },
  {
    path: '/approval/historySum',
    name: 'ApprovalHistorySum',
    component: ApprovalHistorySum,
    meta: {
      docTitle: '历史报销记录'
    }
  }
];
