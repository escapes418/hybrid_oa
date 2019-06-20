import ResHandleApply from '@/views/resHandle/Apply.vue'//资源申请办理
import ResHandleDetail from '@/views/resHandle/Detail.vue'//资源申请办理详情
import ResHandleListSend from '@/views/resHandle/ListSend.vue'//我的资源申请办理列表
import ResHandleListRecived from '@/views/resHandle/ListRecived.vue'//待我审批资源申请办理列表

export default [
    {
        path: '/resHandle/apply/:id',
        name: 'ResHandleApply',
        component: ResHandleApply,
        meta: {
            docTitle: "资源申请办理"
        }
    }, {
        path: '/resHandle/detail/:id/:type/:taskId',
        name: 'ResHandleDetail',
        component: ResHandleDetail,
        meta: {
            docTitle: "资源申请办理详情"
        }
    }, {
        path: '/resHandle/listSend',
        name: 'ResHandleListSend',
        component: ResHandleListSend,
        meta: {
            docTitle: "资源申请办理列表"
        }
    }, {
        path: '/resHandle/listRecived',
        name: 'ResHandleListRecived',
        component: ResHandleListRecived,
        meta: {
            docTitle: "资源申请办理列表"
        }
    },
];
