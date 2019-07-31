import testTest from '@/views/test/test.vue';
import testMarketApply from '@/views/test/MarketApply.vue';
import testimpApply from '@/views/test/ImpApply.vue';
import testMultiPicker from '@/views/test/testMultiPicker.vue';
// import xuanfu from '@/views/test/xuanfu.vue';
import testBlank from '@/views/test/testBlank.vue';
import testScrollList from '@/views/test/testScrollList.vue';
import testScrollnoPullUp from '@/views/test/testScrollnoPullUp.vue';
import testSdk from '@/views/test/testSdk.vue';
// import contractListSend from '@/views/test/ListSend.vue';
// import contractApply from '@/views/test/contractApply.vue';

export default [
  {
    path: '/test/test',
    name: 'testTest',
    component: testTest,
    meta: {
      docTitle: '测试'
    }
  },
  {
    path: '/test/MarketApply',
    name: 'testMarketApply',
    component: testMarketApply,
    meta: {
      docTitle: '测试'
    }
  },
  {
    path: '/test/impApply',
    name: 'testimpApply',
    component: testimpApply,
    meta: {
      docTitle: '测试'
    }
  },
  {
    path: '/test/testMultiPicker',
    name: 'testMultiPicker',
    component: testMultiPicker,
    meta: {
      docTitle: '测试'
    }
  },
  // {
  //   path: '/test/xuanfu',
  //   name: 'xuanfu',
  //   component: xuanfu,
  //   meta: {
  //     docTitle: '悬浮球'
  //   }
  // },
  {
    path: '/test/testBlank',
    name: 'testBlank',
    component: testBlank,
    meta: {
      docTitle: '空白网页'
    }
  },
  {
    path: '/test/testScrollList',
    name: 'testScrollList',
    component: testScrollList,
    meta: {
      docTitle: '列表'
    }
  },
  {
    path: '/test/testScrollnoPullUp',
    name: 'testScrollnoPullUp',
    component: testScrollnoPullUp,
    meta: {
      docTitle: '列表'
    }
  },
  {
    path: '/test/testSdk',
    name: 'testSdk',
    component: testSdk,
    meta: {
      docTitle: '测SDK'
    }
  }
  // {
  //   path: '/test/contractListSend',
  //   name: 'contractListSend',
  //   component: contractListSend,
  //   meta: {
  //     docTitle: '测SDK'
  //   }
  // },
  // {
  //   path: '/test/contractApply/:id',
  //   name: 'contractApply',
  //   component: contractApply,
  //   meta: {
  //     docTitle: '测上传图片'
  //   }
  // }
];
