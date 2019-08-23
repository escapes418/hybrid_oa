import projectApprovalApply from '@/views/projectApproval/Apply.vue';
import projectApprovalDetail from '@/views/projectApproval/Detail.vue'; //资源申请办理详情
import projectApprovalListSend from '@/views/projectApproval/ListSend.vue'; //我的资源申请办理列表
import projectApprovalListRecived from '@/views/projectApproval/ListRecived.vue'; //待我审批资源申请办理列表

export default [
  {
    path: '/projectApproval/apply/:id/:type',
    name: 'projectApprovalApply',
    component: projectApprovalApply,
    meta: {
      docTitle: '项目立项'
    }
  },
  {
    path: '/projectApproval/detail/:id/:type/:taskId',
    name: 'projectApprovalDetail',
    component: projectApprovalDetail,
    meta: {
      docTitle: '项目立项详情'
    }
  },
  {
    path: '/projectApproval/listSend',
    name: 'projectApprovalListSend',
    component: projectApprovalListSend,
    meta: {
      docTitle: '项目立项申请列表'
    }
  },
  {
    path: '/projectApproval/listRecived',
    name: 'projectApprovalListRecived',
    component: projectApprovalListRecived,
    meta: {
      docTitle: '项目立项审批列表'
    }
  }
];
