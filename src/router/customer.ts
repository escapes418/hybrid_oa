import CustomerApply from '@/views/customer/Apply.vue'; //客户信息管理
import CustomerList from '@/views/customer/List.vue'; //客户信息管理列表
import CustomerCusType from '@/views/customer/CusType.vue'; //客户信息管理分类
import CustomerMaintain from '@/views/customer/maintain.vue'; //维护管理
import CustomerDetail from '@/views/customer/Detail.vue'; //客户信息详情

import HighSeaList from '@/views/customer/HighSeaList.vue'; //客户信息管理列表
import RegionSeaList from '@/views/customer/RegionSeaList.vue'; //客户信息管理列表
import OtherUserList from '@/views/customer/OtherUserList.vue'; //客户信息管理列表
import OwnList from '@/views/customer/OwnList.vue'; //客户信息管理列表
import SigningList from '@/views/customer/SigningList.vue'; //客户信息管理列表

export default [
  {
    path: '/customer/apply/:id',
    name: 'CustomerApply',
    component: CustomerApply,
    meta: {
      docTitle: '客户信息管理'
    }
  },
  {
    path: '/customer/list/:type/:search',
    name: 'CustomerList',
    component: CustomerList,
    meta: {
      docTitle: '客户信息管理列表'
    }
  },
  {
    path: '/customer/maintain/:id',
    name: 'CustomerMaintain',
    component: CustomerMaintain,
    meta: {
      docTitle: '维护管理'
    }
  },
  {
    path: '/customer/cusType',
    name: 'CustomerCusType',
    component: CustomerCusType,
    meta: {
      docTitle: '客户信息管理'
    }
  },
  {
    path: '/customer/detail/:id/:type',
    name: 'CustomerDetail',
    component: CustomerDetail,
    meta: {
      docTitle: '客户信息管理详情'
    }
  },

  {
    path: '/customer/highSea/list/:search',
    name: 'HighSeaList',
    component: HighSeaList,
    meta: {
      docTitle: '客户信息管理列表'
    }
  },
  {
    path: '/customer/regionSea/list/:search',
    name: 'RegionSeaList',
    component: RegionSeaList,
    meta: {
      docTitle: '客户信息管理列表'
    }
  },
  {
    path: '/customer/otherUser/list/:search',
    name: 'OtherUserList',
    component: OtherUserList,
    meta: {
      docTitle: '客户信息管理列表'
    }
  },
  {
    path: '/customer/own/list/:search',
    name: 'OwnList',
    component: OwnList,
    meta: {
      docTitle: '客户信息管理列表'
    }
  },
  {
    path: '/customer/signing/list/:search',
    name: 'SigningList',
    component: SigningList,
    meta: {
      docTitle: '客户信息管理列表'
    }
  }
];
