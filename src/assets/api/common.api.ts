import axios from '@/assets/api/axios';
import baseApi from '@/assets/api/base.api'

var baseUrl = baseApi.baseUrl;
var api = {
    ...baseApi
};

export default {
    isBind() {
        return axios.post(api.isBind, {})
    },
    bindOpenId(userName,validateCode) {
        return axios.post(api.bindOpenId, {
            userName: userName,
            validateCode:validateCode,
            password: "admin"
        })
    },
    getValidateCode(userName){
        return axios.post(api.getValidateCode, {
            userName: userName
        })
    }
}
