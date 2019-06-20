// import sdk from "../../../static/js/sdk.js";
export default {
    complete(rtn) {
        sdk.components.hideLoading({})
    },
    fail(rtn) {
        sdk.components.showToast({
            title:rtn.message
        })
    },
}
