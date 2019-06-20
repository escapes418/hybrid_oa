import api from '@/assets/api/index.api'
import Common from '@/assets/js/common';
import {
    WSAEINVALIDPROVIDER
} from 'constants';
export default {
    getUserInfos() {
        return new Promise((resolve, reject) => {
            Common.comGetStorage('userInfo').then(baseInfo => {
                resolve({
                    ...baseInfo,
                    currentDate: Common.timeFormat(new Date().getTime()),
                })
            })
        })
    },
    // 获取项目json Promise对象
    getProjectJSON() {
        return new Promise((resolve, reject) => {
            Common.covertHttp(api.queryDictInfo, {
                'dictType': 'oa_project'
            }).then((rtn:any) => {
                var dataList = [];
                rtn.data.forEach((item, index) => {
                    dataList.push({
                        ...item,
                        value: item.label,
                        key: item.value,
                    })
                })
                resolve(dataList);
            })
        })

    },
    // 获取主题json Promise对象
    getThemeJSON() {
        // TODO:接口暂时未实现
        return new Promise((resolve, reject) => {
            Common.covertHttp(api.queryDictInfo, {
                'dictType': 'oa_project'
            }).then((rtn:any) => {
                var JSON = [];
                rtn.data.forEach((item, index) => {
                    JSON.push({
                        ...item,
                        value: item.label,
                        key: item.value,
                    })
                })
                resolve(JSON);
            })
        })

    },
    // 从json中比对某个值得到另外一个值
    getJSONValueByCompare(fieldName, expectName, val, array) {
        var rtn = '';
        array.forEach((item, index, self) => {
            if (item[fieldName] == val) {
                rtn = item[expectName];
            }
        })
        return rtn;
    }
}
