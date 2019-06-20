import empStatusList from '@/views/empStatus/List.vue' //实施状态标记列表
import empStatusApply from '@/views/empStatus/Apply.vue' //实施状态标记新增

export default [
    {
        path:'/empStatus/list',
        name:'empStatusList',
        component:empStatusList,
        meta:{
            docTitle:'实施状态标记'
        }
    }, {
        path: '/empStatus/apply/:type',
        name: 'empStatusApply',
        component: empStatusApply,
        meta: {
            docTitle: "实施状态标记"
        }
    },
];