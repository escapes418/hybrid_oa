import contractApply from '@/views/contract/Apply.vue' //合同审核申请
import contractListSend from '@/views/contract/ListSend.vue' //合同审核申请
import contractListRecived from '@/views/contract/ListRecived.vue' //合同审核申请
import contractDetail from '@/views/contract/Detail.vue' //合同审核申请

export default [
    {
        path: '/contract/apply/:id',
        name: 'contractApply',
        component: contractApply,
        meta: {
            docTitle: "合同审核申请"
        }
    }, {
        path: '/contract/listSend',
        name: 'contractListSend',
        component: contractListSend,
        meta: {
            docTitle: "合同审核列表"
        }
    }, {
        path: '/contract/listRecived',
        name: 'contractListRecived',
        component: contractListRecived,
        meta: {
            docTitle: "合同审核列表"
        }
    }, {
        path: '/contract/detail/:id/:type/:taskId',
        name: 'contractDetail',
        component: contractDetail,
        meta: {
            docTitle: "合同审核详情"
        }
    },
];