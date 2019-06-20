import CustomerApply from '@/views/customer/Apply.vue' //客户信息管理
import CustomerList from '@/views/customer/List.vue' //客户信息管理列表
import CustomerCusType from '@/views/customer/CusType.vue' //客户信息管理分类
import CustomerMaintain from '@/views/customer/maintain.vue' //维护管理
import CustomerDetail from '@/views/customer/Detail.vue' //客户信息详情

export default [
    {
        path: '/customer/apply/:id',
        name: 'CustomerApply',
        component: CustomerApply,
        meta: {
            docTitle: "客户信息管理"
        }
    }, {
        path: '/customer/list/:type/:search',
        name: 'CustomerList',
        component: CustomerList,
        meta: {
            docTitle: "客户信息管理列表"
        }
    }, {
        path: '/customer/maintain/:id',
        name: 'CustomerMaintain',
        component: CustomerMaintain,
        meta: {
            docTitle: "维护管理"
        }
    }, {
        path: '/customer/cusType',
        name: 'CustomerCusType',
        component: CustomerCusType,
        meta: {
            docTitle: "客户信息管理"
        }
    }, {
        path: '/customer/detail/:id/:type',
        name: 'CustomerDetail',
        component: CustomerDetail,
        meta: {
            docTitle: "客户信息管理详情"
        }
    },
];
