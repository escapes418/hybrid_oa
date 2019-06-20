import excList from '@/views/excTicket/excList.vue' //异常单列表
import comList from '@/views/excTicket/comList.vue' //异常单
import excListDetail from '@/views/excTicket/Detail.vue' //异常单详情

export default [
    {
        path: '/excTicket/excList/:id',
        name: 'excList',
        component: excList,
        meta: {
            docTitle: "异常单列表"
        }
    }, {
        path: '/excTicket/comList',
        name: 'comList',
        component: comList,
        meta: {
            docTitle: "异常单"
        }
    }, {
        path: '/excTicket/detail',
        name: 'excListDetail',
        component: excListDetail,
        meta: {
            docTitle: "异常单详情"
        }
    },
];