import ImplementationApproval from '@/views/market/Detail.vue' //市场需求申请详情
import ImplementationApply from '@/views/market/Apply.vue' //市场需求申请
import ImplementationApplyListSend from '@/views/market/ListSend.vue' //我的市场需求申请列表
import ImplementationApplyListRecived from '@/views/market/ListRecived.vue' //带我审批市场需求审批列表

export default [
    {
        path: '/market/detail/:id/:type/:taskId',
        name: 'ImplementationApproval',
        component: ImplementationApproval,
        meta: {
            docTitle: "市场需求审批"
        }
    }, {
        path: '/market/apply/:id/:taskId',
        name: 'ImplementationApply',
        component: ImplementationApply,
        meta: {
            docTitle: "市场需求申请"
        }
    }, {
        path: '/market/listSend',
        name: 'ImplementationApplyListSend',
        component: ImplementationApplyListSend,
        meta: {
            docTitle: "市场需求申请列表"
        }
    }, {
        path: '/market/listRecived',
        name: 'ImplementationApplyListRecived',
        component: ImplementationApplyListRecived,
        meta: {
            docTitle: "市场需求审批列表"
        }
    },
];
