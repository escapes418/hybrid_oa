import Vue from 'vue';
import Router from 'vue-router';
import common from '@/assets/js/common';
import {
    routesObj,
    beforeEachHandler
} from '@/assets/js/hooks';
import Bind from '@/components/Bind.vue';
import UserIndex from '@/views/index/UserIndex.vue';
import Setting from '@/views/index/Setting.vue';
import Login from '@/components/Login.vue';
import TaskOption from '@/views/index/TaskOption.vue';
import Password from '@/views/index/Password.vue';
import messageList from '@/views/index/messageList.vue';


import approval from '@/router/approval';
import market from '@/router/market';
import implementation from '@/router/implementation';
import reception from '@/router/reception';
import clue from '@/router/clue';
import resource from '@/router/resource';
import customer from '@/router/customer';
import log from '@/router/log';
import resHandle from '@/router/resHandle';
import trip from '@/router/trip';
import empStatus from '@/router/empStatus';
import excTicket from '@/router/excTicket';
import contract from '@/router/contract';
import contractFill from '@/router/contractFill';
import coop from '@/router/coop';
import project from '@/router/project';
import calcu from '@/router/calcu';
import test from '@/router/test';

Vue.use(Router)


var router = new Router({
    routes: [{
            path: '/',
            name: 'HelloWorld',
            component: UserIndex,
            meta: {
                docTitle: "主页"
            }
        }, {
            path: '*',
            redirect: "/"
        }, {
            path: '/userIndex',
            name: 'UserIndex',
            component: UserIndex,
            meta: {
                docTitle: "个人主页"
            }
        }, {
            path: '/setting',
            name: 'Setting',
            component: Setting,
            meta: {
                docTitle: "设置"
            }
        }, {
            path: '/bind',
            name: 'Bind',
            component: Bind,
            meta: {
                docTitle: "账号绑定"
            }
        }, {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {
                docTitle: "登录"
            }
        }, {
            path: '/password/:type',
            name: 'Password',
            component: Password,
            meta: {
                docTitle: "密码"
            }
        }, {
            path: '/taskOption/:type',
            name: 'TaskOption',
            component: TaskOption,
            meta: {
                docTitle: "任务条目"
            }
        }, {
            path: '/messageList',
            name: 'MessageList',
            component: messageList,
            meta: {
                docTitle: "消息通知"
            }
        },
        ...approval,
        ...market,
        ...implementation,
        ...reception,
        ...clue,
        ...resource,
        ...customer,
        ...log,
        ...resHandle,
        ...trip,
        ...empStatus,
        ...excTicket,
        ...contract,
        ...contractFill,
        ...coop,
        ...project,
        ...calcu,
        ...test,
    ]
})

//拦截器
router.beforeEach(function (to, from, next) {
    if (to.fullPath == '/login') {
        next();
    }
    if (process.argv[0] == 'H5') { // H5开发直接跳过
        next();
        return;
    }
    common.getStorage('sjboacert').then((res:any) => {
        if (res.status == 0) { // 获取本地数据成功
            next();
        } else {
            /* sdk.components.showToast({
                title: res.message || '获取本地数据失败'
            }) */
            console.log('router beforeEach', res.message);
            next('/login');
        }
    })
})
export default router
