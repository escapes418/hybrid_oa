import ReceptionApply from '@/views/reception/Apply.vue' //接待申请
import ReceptionApplyListRecived from '@/views/reception/ListRecived.vue' //带我审批申请列表
import ReceptionApplyListSend from '@/views/reception/ListSend.vue' //我的接待申请列表
import ReceptionDetail from '@/views/reception/Detail.vue' //接待详情

export default [
    {
        path: '/reception/Apply/:id',
        name: 'ReceptionApply',
        component: ReceptionApply,
        meta: {
            docTitle: "接待申请"
        }
    }, {
        path: '/reception/listRecived',
        name: 'ReceptionApplyListRecived',
        component: ReceptionApplyListRecived,
        meta: {
            docTitle: "接待申请列表"
        }
    }, {
        path: '/reception/listSend',
        name: 'ReceptionApplyListSend',
        component: ReceptionApplyListSend,
        meta: {
            docTitle: "接待申请列表"
        }
    }, {
        path: '/reception/detail/:id/:type/:taskId',
        name: 'ReceptionDetail',
        component: ReceptionDetail,
        meta: {
            docTitle: "接待申请详情"
        }
    },
];
