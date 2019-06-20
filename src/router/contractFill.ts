import contractFillDetail from '@/views/contractFill/Detail.vue' //合同归档申请
import contractFillSupDetail from '@/views/contractFill/SupDetail.vue' //合同归档申请
import contractFillListSend from '@/views/contractFill/ListSend.vue' //合同归档列表

export default [
    {
        path: '/contractFill/detail/:id/:type/:taskId',
        name: 'contractFillDetail',
        component: contractFillDetail,
        meta: {
            docTitle: "合同归档详情"
        }
    }, {
        path: '/contractFill/SupDetail/:id/:type/:taskId',
        name: 'contractFillSupDetail',
        component: contractFillSupDetail,
        meta: {
            docTitle: "合同附件协议"
        }
    }, {
        path: '/contractFill/listSend',
        name: 'contractFillListSend',
        component: contractFillListSend,
        meta: {
            docTitle: "合同归档列表"
        }
    },
];