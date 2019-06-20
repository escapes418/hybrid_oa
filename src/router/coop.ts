import coopDetail from '@/views/coop/Detail.vue' //协作详情
import coopList from '@/views/coop/List.vue' //协作详情
import coopSchedule from '@/views/coop/Schedule.vue' //协作-增加进度
import coopApply from '@/views/coop/Apply.vue' //协作-增加进度
import coopHisPrincipal from '@/views/coop/HisPrincipal.vue' 
import coopHisProgress from '@/views/coop/HisProgress.vue' 

export default [
    {
        path: '/coop/detail/:id',
        name: 'coopDetail',
        component: coopDetail,
        meta: {
            docTitle: "协作详情"
        }
    }, {
        path: '/coop/list',
        name: 'coopList',
        component: coopList,
        meta: {
            docTitle: "协作列表"
        }
    }, {
        path: '/coop/schedule/:typeId/:needFlowId',
        name: 'coopSchedule',
        component: coopSchedule,
        meta: {
            docTitle: "增加进度"
        }
    }, {
        path: '/coop/apply',
        name: 'coopApply',
        component: coopApply,
        meta: {
            docTitle: "协作功能"
        }
    }, {
        path: '/coop/hisPrincipal/:id',
        name: 'coopHisPrincipal',
        component: coopHisPrincipal,
        meta: {
            docTitle: "历史负责人"
        }
    }, {
        path: '/coop/hisProgress/:id',
        name: 'coopHisProgress',
        component: coopHisProgress,
        meta: {
            docTitle: "历史进度"
        }
    }, 
];
