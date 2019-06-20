import ImplementationApplyOriginate from '@/views/implementation/Apply.vue' //实施需求申请
import OriginateApproval from '@/views/implementation/Detail.vue' //实施需求申请详情
import ImplementationApplyOriginateSend from '@/views/implementation/ListSend.vue' //我的实施需求申请列表
import ImplementationApplyOriginateRecived from '@/views/implementation/ListRecived.vue' //待我审批实施需求申请列表

export default [
    {
        path: '/implementation/listSend',
        name: 'ImplementationApplyOriginateSend',
        component: ImplementationApplyOriginateSend,
        meta: {
            docTitle: "实施发起列表"
        }
    }, {
        path: '/implementation/listRecived',
        name: 'ImplementationApplyOriginateRecived',
        component: ImplementationApplyOriginateRecived,
        meta: {
            docTitle: "实施发起列表"
        }
    }, {
        path: '/implementation/apply/:id',
        name: 'ImplementationApplyOriginate',
        component: ImplementationApplyOriginate,
        meta: {
            docTitle: "实施需求发起"
        }
    }, {
        path: '/implementation/detail/:id/:type/:taskId',
        name: 'OriginateApproval',
        component: OriginateApproval,
        meta: {
            docTitle: "实施需求发起审批"
        }
    },
];