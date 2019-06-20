import calcuForm from '@/views/calcu/Form.vue' 
import calcuDetail from '@/views/calcu/Detail.vue' 

export default [
    {
        path: '/calcu/form',
        name: 'calcuForm',
        component: calcuForm,
        meta: {
            docTitle: "计算器"
        }
    },
    {
        path: '/calcu/detail/:type',
        name: 'calcuDetail',
        component: calcuDetail,
        meta: {
            docTitle: "计算器"
        }
    },
];
