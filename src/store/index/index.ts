import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/index/mutations'
import actions from '@/store/index/actions'
// var vuex: any=Vuex;
Vue.use(<any>Vuex);
// Vue.use(vuex);

// 定义vuex
const state = {
    openid: 'oOY0_0b_dMkpw55Pg4Xwpe4vPVP8', //佘//组员
 
    comanyList: null, //本应是array，特殊null类型为做判断,
    baseInfo: {}, //登录人基本信息
    itemDatas: [], // 报销明细
    assignStaff: [], // 指派人员
    testData: [],
    subsList: [],
    firstSub: 0,
    addressData: [],
    subsListKeyVal: {},
    addressList: [], // 地址list
    subjectList: [], // 科目list
    keepAliveList: [],
    logListTabIndex:0,
    messageListTabIndex:0,
}
const getters = {
    preBillNum(state) {
        var billNum = 0;
        state.itemDatas.forEach(function (item, index) {
            billNum += item.billNum;
        })
        return billNum;
    },
    preExpenseAmt(state) {
        var expenseAmt = 0;
        state.itemDatas.forEach(function (item, index) {
            expenseAmt += item.expenseAmt;
        })
        return expenseAmt;
    },
    firstSubList(state) {
        var tempArr = [];
        state.subsList.forEach(function (item, index) {
            if (item.parent == 0) {
                tempArr.push({
                    ...item,
                    key: item.value,
                    value: item.name,

                });
            }
        })
        return tempArr;
    },
    /*
    secondSubList(state){
        var tempArr=[];
        state.subsList.forEach(function (item, index) {
            if(item.parent == state.firstSub){
                tempArr.push(item);
            }
        })
        return tempArr;
    }
    */
    // 指派人员list中数量汇总
    assignedStaff(state) {
        var counts = 0;
        state.assignStaff.map((el, index, self) => {
            counts += el.personelNum*1;
        });
        return counts*1 || 0;
    },
}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
//我们规定每个模块一个文件夹  下面有4个文件 按这个标准写
