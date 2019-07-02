import ResourApply from '@/views/resource/Apply.vue'; //资源申请办理
import ResourceListRecived from '@/views/resource/ListRecived.vue'; //资源申请待办列表
import ResourceListSend from '@/views/resource/ListSend.vue'; //我的资源申请列表
import ResourceDetail from '@/views/resource/Detail.vue'; //资源申请详情

export default [
  {
    // 资源申请 - 新增表单
    path: '/resource/apply',
    name: 'ResourceApply',
    component: ResourApply,
    meta: {
      docTitle: '资源申请'
    }
  },
  {
    // 资源申请 - 编辑表单
    path: '/resource/apply/:id',
    name: 'ResourceEditApply',
    component: ResourApply,
    meta: {
      docTitle: '资源申请'
    }
  },
  {
    path: '/resource/listRecived',
    name: 'ResourceListRecived',
    component: ResourceListRecived,
    meta: {
      docTitle: '资源申请列表'
    }
  },
  {
    path: '/resource/listSend',
    name: 'ResourceListSend',
    component: ResourceListSend,
    meta: {
      docTitle: '资源申请列表'
    }
  },
  {
    path: '/resource/detail/:id/:type/:taskId',
    name: 'ResourceDetail',
    component: ResourceDetail,
    meta: {
      docTitle: '资源申请详情'
    }
  }
];
