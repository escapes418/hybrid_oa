import * as types from "@/store/index/types";
import Vue from "vue";
// 由mutation来修改state
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
const mutations = {
    [types.SET_OPENID]: function (state, data) {
        state.openid = data;
    },
    [types.SET_APPID]: function (state, data) {
        state.appid = data;
    },
    [types.SET_SECRET]: function (state, data) {
        state.secret = data;
    },
    [types.SET_USER_INFO]: function (state, data) {
        state.userinfo = data;
    },
    [types.UPDATE_LOADING]: function (state, data) {
        state.isLoading = data;
    },
    [types.FILL_ARR]: function (state, data) {
        state.dataArr = data;
    },
    [types.UPDATE_BASEINFO]: function (state, data) {
        state.baseInfo = data;
    },
    [types.SET_FLAG]: function (state, data) {
        state.isBind = data;
    },
    [types.UPDATE_COMPANYLIST]: function (state, data) {
        state.companyList = data;
    },
    [types.UPDATE_ITEMDATAS]: function (state, data) {
        state.itemDatas = data;
    },
    [types.ADD_ITEMDATAS]: function (state, data) {
        state.itemDatas.push(data);
    },
    // 删除某个指定index条目
    [types.DEL_ITEMDATAS]: function (state, data) {
        // var obj = clone(state.itemDatas);
        // obj.splice(data, 1);
        // state.itemDatas = obj;
        state.itemDatas.splice(data, 1);
    },
    [types.SET_ITEMDATAS]: function (state, payload) {
        //整条数据更新 - 更新以废弃
        //Vue.set(state.itemDatas, payload.index, payload.obj);
        //更新每条数据时计算预览对象
        var billNum = 0,
            expenseAmt = 0;
        state.itemDatas.forEach(function (item, index) {
            expenseAmt += item.expenseAmt;
            billNum += item.billNum;
        });
        state.preview.billNum = billNum;
        state.preview.expenseAmt = expenseAmt;
    },
    [types.SET_SUBS]: function (state, data) {
        state.subsList = data;
    },
    [types.FULL_ITEMDATAS]: function (state, data) {
        state.itemDatas = data;
    },
    [types.DELALL_ITEMDATAS]: function (state, data) {
        state.itemDatas = [];
    },
    [types.SET_ADDRESS_DATA]: function (state, data) {
        state.addressData = data;
    },
    [types.SUBSLIST_KEYVAL]: function (state, data) {
        state.subsListKeyVal = data;
    },
    // 更新item的图片配置
    [types.SET_ITEM_CONFIG]: function (state, data) {
        // state.itemDatas = data;
        Vue.set(state.itemDatas, data.idx, data.newValue);
    },
    [types.GET_ADDRESSLIST]: function (state, data) {
        state.addressList = data;
    },
    [types.GET_SUBJECTLIST]: function (state, data) {
        state.subjectList = data;
    },
    /* ################ 指派人员组件 ################### */
    [types.ADD_ASSIGN_STAFF]: function (state, data) {
        // 添加新项
        state.assignStaff.push(data);
    },
    [types.DEL_ASSIGN_STAFF]: function (state, data) {
        // 删除某一项
        state.assignStaff.splice(data, 1);
    },
    [types.MOD_ASSIGN_STAFF]: function (state, data) {
        // 更新某一项 [!!!实际场景可能用不到,引用类型和v-model双向绑定后自动同步，此时视图刷新不通过vuex实现，v-model自动实现]
        Vue.set(state.assignStaff, data.idx, data.newValue);
    },
    [types.FILL_ASSIGN_STAFF]: function (state, data) {
        // 填充整个数组
        state.assignStaff = data;
    },
    [types.CLEAR_ASSIGN_STAFF]: function (state, data) {
        // 清除整个数组
        state.assignStaff = [];
    },
    [types.SET_LOG_LIST_TABINDEX]: function (state, data) {
        // 修改tebindex
        state.logListTabIndex = data;
    },
    [types.SET_MESSAGE_LIST_TABINDEX]: function (state, data) {
        // 修改消息tebindex
        state.messageListTabIndex = data;
    },
    [types.ADD_KEEP_ALIVE]: function (state, data) {
        //添加keep-alive
        for(let i in state.keepAliveList.length){
            if(state.keepAliveList[i] == data) return
        }
        state.keepAliveList.push(data)
        console.log(state.keepAliveList)
    },
    [types.DEL_KEEP_ALIVE]: function (state, data) {
        //删除keep-alive
        var newBox = [];
        var arrBox = JSON.parse(JSON.stringify(state.keepAliveList||[]))
        arrBox.forEach((val,num)=>{
            if(data.indexOf(val) == -1){
                newBox.push(arrBox[num])
            }
        })
        state.keepAliveList = newBox
    },
    [types.DEL_ALL_KEEP_ALIVE]: function (state, data) {
        //删除所有keep-alive
        state.keepAliveList = []
    },
};
export default mutations;
