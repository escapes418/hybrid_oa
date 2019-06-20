import TripForm from '@/views/trip/Form.vue' // 出差申请表单
import TripListRecived from '@/views/trip/ListRecived.vue' //
import TripListSend from '@/views/trip/ListSend.vue' //
import TripDetail from '@/views/trip/Detail.vue' //

export default [
    {
        // 出差申请 - 表单
        path: '/trip/form/:id',
        name: 'TripForm',
        component: TripForm,
        meta: {
            docTitle: "出差申请"
        }
    }, {
        path:'/trip/listRecived',
        name:'TripListRecived',
        component:TripListRecived,
        meta:{
            docTitle:'出差申请列表'
        }
    }, {
        path:'/trip/listSend',
        name:'TripListSend',
        component:TripListSend,
        meta:{
            docTitle:'出差申请列表'
        }
    }, {
        path: '/trip/detail/:id/:type/:taskId',
        name: 'TripDetail',
        component: TripDetail,
        meta: {
            docTitle: "出差申请详情"
        }
    },
];