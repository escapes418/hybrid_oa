import Vue from 'vue'
import * as types from '@/store/index/types'
import api from '@/assets/api/index.api'
import com from '@/assets/js/common'
export default {
    // 同步左侧菜单选中
    setOpenId({
        commit
    }, data) {
        commit(types.SET_OPENID, data);
    },
    setAppId({
        commit
    }, data) {
        commit(types.SET_APPID, data);
    },
    setSecret({
        commit
    }, data) {
        commit(types.SET_SECRET, data);
    },
    setUserInfo({
        commit
    }, data) {
        commit(types.SET_USER_INFO, data);
    },
    updateLoading({
        commit
    }, data) {
        commit(types.UPDATE_LOADING, data);
    },
    updateBaseInfo({
        commit
    }, data) {
        commit(types.UPDATE_BASEINFO, data);
    },
    updateItemDatas({
        commit
    }, data) {
        commit(types.UPDATE_ITEMDATAS, data);
    },
    addItemDatas({
        commit
    }, data) {
        commit(types.ADD_ITEMDATAS, data);
    },
    setItemDatas({
        commit
    }, payload) {
        commit(types.SET_ITEMDATAS, payload);
    },
    delItemDatas({
        commit
    }, data) {
        commit(types.DEL_ITEMDATAS, data);
    },
    // 直接全部赋值
    fullItemDatas({
        commit
    }, data) {
        commit(types.FULL_ITEMDATAS, data);
    },
    // subs赋值
    setSubs({
        commit
    }, data) {
        commit(types.SET_SUBS, data);
    },
    //报销明细数组赋空
    delallItemDatas({
        commit
    }, data) {
        commit(types.DELALL_ITEMDATAS, data);
    },
    //省市数据
    setAddressData({
        commit
    }, data) {
        commit(types.SET_ADDRESS_DATA, data);
    },
    //省市数据
    subslistKeyVal({
        commit
    }, data) {
        commit(types.SUBSLIST_KEYVAL, data);
    },
    // 更新item的图片配置
    setItemConfig({
        commit
    }, data) {
        commit(types.SET_ITEM_CONFIG, data)
    },
    // 获取地址字典
    getAddressList({
        commit
    }, data) {
        com.covertHttp(api.areaInfo).then((res:any) => {
            // TODO 需做错误兼容
            commit(types.GET_ADDRESSLIST, res.data || []);
        })
    },
    // 获取科目字典
    getSubjectList({
        commit
    }, data) {
        com.covertHttp(api.querySubInfolistForSecond, {}).then((res:any) => {
            // TODO 需做错误兼容
            commit(types.GET_SUBJECTLIST, res.data.list)
        })
    },
    /* ################ 指派人员组件 ################### */
    addAssignStaff({
        commit
    }, data) {
        commit(types.ADD_ASSIGN_STAFF, data);
    },
    delAssignStaff({
        commit
    }, data) {
        commit(types.DEL_ASSIGN_STAFF, data);
    },
    modAssignStaff({
        commit
    }, data) {
        // data:{idx,newValue}
        commit(types.MOD_ASSIGN_STAFF, data);
    },
    fillAssignStaff({
        commit
    }, data) {
        /* com.covertHttp(api.querySubInfolistForSecond, {}).then(res => {
            // TODO 需做错误兼容
            commit(types.GET_SUBJECTLIST, res.data.list);
        })
        commit(types.FILL_ASSIGN_STAFF, data); */
        commit(types.FILL_ASSIGN_STAFF, data);
    },
    clearAssignStaff({
        commit
    }, data) {
        commit(types.CLEAR_ASSIGN_STAFF);
    },
    addKeepAlive({
        commit
    }, data) {
        commit(types.ADD_KEEP_ALIVE,data);
    },
    delKeepAlive({
        commit
    }, data) {
        commit(types.DEL_KEEP_ALIVE,data);
    },
    delAllKeepAlive({
        commit
    }, data) {
        commit(types.DEL_ALL_KEEP_ALIVE);
    },
    setLogListTabIndex({
        commit
    }, data) {
        commit(types.SET_LOG_LIST_TABINDEX,data);
    },
    setMessageListTabIndex({
        commit
    }, data) {
        commit(types.SET_MESSAGE_LIST_TABINDEX,data);
    }
}
