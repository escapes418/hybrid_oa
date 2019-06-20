import LogList from '@/views/log/list.vue' //日志列表
import LogMarketApply from '@/views/log/MarketApply.vue' //市场日志表单
import LogMarketDetail from '@/views/log/MarketDetail.vue' //市场日志详情
import LogImpApply from '@/views/log/ImpApply.vue' //实施日志表单
import LogImpDetail from '@/views/log/ImpDetail.vue' //实施日志详情

export default [
    {
        path: '/log/list',
        name: 'LogList',
        component: LogList,
        meta: {
            docTitle: "日志列表"
        }
    }, {
        path: '/log/marketApply',
        name: 'LogMarketApply',
        component: LogMarketApply,
        meta: {
            docTitle: "工作日志"
        }
    }, {
        path: '/log/marketDetail/:id',
        name: 'LogMarketDetail',
        component: LogMarketDetail,
        meta: {
            docTitle: "日志详情"
        }
    }, {
        path: '/log/impDetail/:id',
        name: 'LogImpDetail',
        component: LogImpDetail,
        meta: {
            docTitle: "日志详情"
        }
    }, {
        path: '/log/impApply',
        name: 'LogImpApply',
        component: LogImpApply,
        meta: {
            docTitle: "工作日志"
        }
    },
];
