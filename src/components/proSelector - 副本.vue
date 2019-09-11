<template>
    <div class="sinselector">
        <group>
            <div class="selectbox"  @click="showPopup=true">
                <div class="stitle">{{sTitle}}<span class="srequired" v-if="isRequired">*</span></div>
                <div class="svalue">{{sValue}}</div>
                <div class="svalue" style="color:#999" v-if="!sValue">{{sPlaceholder}}</div>
            </div>
        </group>
        <div v-transfer-dom>
            <div class="search" v-if="showPopup">
                <search @on-submit="goSearch" v-model="search" @on-cancel="onSearchCancel" @on-clear="onSearchCancel" placeholder="请输入关键字"></search>
            </div>
            <popup v-model="showPopup" height="100%" :popup-style="{zIndex: 1000}" style="-webkit-overflow-scrolling:touch;">
                <div class="popup1">
                    <group class="checkcontent_sin">
                        <checklist :max='1' label-position="left" :options="ArrBox" v-model="selectedItem"></checklist>
                    </group>
                </div>
            </popup>
            <box class="schecklistbtn" v-if="showPopup">
                <flexbox>
                    <flexbox-item>
                        <x-button type="primary" @click.native="confirm">确认</x-button>
                    </flexbox-item>
                    <flexbox-item>
                        <x-button type="default" @click.native="cancel">取消</x-button>
                    </flexbox-item>
                </flexbox>
            </box>
        </div>
    </div>
</template>

<script>
import com from "@/assets/js/common";
import api from "@/assets/api/index.api";
import {
    Popup,
    Checklist,
    Search,
    Box,
    Group,
    XInput,
    XTextarea,
    XButton,
    Flexbox,
    FlexboxItem,
    TransferDomDirective as TransferDom
} from "vux";
import { setTimeout } from "timers";
export default {
    directives: {
        TransferDom
    },
    components: {
        Popup,
        Checklist,
        Box,
        Search,
        Group,
        XInput,
        XButton,
        Flexbox,
        FlexboxItem,
        XTextarea
    },
    props: {
        sTitle: String, //选择框的title
        sPlaceholder: String, //Placeholder
        sendData: [String, Boolean, Number], //选中的值
        isRequired: Boolean,
    },
    data() {
        return {
            showPopup: false,
            sValue: "",
            ArrBox: [],
            search: "", //搜索框
            selectedItem: [], //选中的值
            projectList:[],
        };
    },
    created() {
        com.comGetStorage("queryDictInfo").then(res => {
            res.dict.forEach((item, index) => {
                this.projectList.push({
                    ...item,
                    value: item.label,
                    key: item.value
                });
            });
        });
    },
    watch: {
        "sendData":function(newVal, oldVal) {
            this.init()
        }
    },
    mounted() {
        var _this = this
        setTimeout(function() {
            _this.init()
        },100);
    },
    methods: {
        init() {
            this.sValue = "";
            this.selectedItem = []
            this.selectedItem = [this.sendData];
            this.projectList.forEach((item, index) => {
                if (item.key == this.selectedItem[0]) {
                    this.sValue = item.value;
                }
            });
        },
        async getList(){
            await com.debounce(500);//防抖
            com.covertHttp(api.queryDictInfo, {
                dictType: "oa_project",
                projectName:this.search,
            }).then(rtn => {
                if(rtn.status == 0){
                    rtn.data.forEach((item, index) => {
                        this.ArrBox.push({
                            ...item,
                            value: item.label,
                            key: item.value
                        });
                    });
                }
                
            });
        },
        goSearch() {
            if (this.search == "") {
                this.ArrBox = [];
            } else {
                this.ArrBox = [];
                this.getList()
            }
        },
        confirm() {
            this.sValue = "";
            this.projectList.forEach((item, index) => {
                if (item.key == this.selectedItem[0]) {
                    this.sValue = item.value;
                }
            });
            this.showPopup = false;
            if (this.selectedItem.length == 0) {
                this.$emit("update:selectedItem", "");
            } else {
                this.$emit("update:selectedItem", this.selectedItem[0]);
            }
            this.$emit("on-change"); //添加change事件
        },
        cancel() {
            this.showPopup = false;
        },
        onSearchCancel() {
            this.search = "";
            this.sValue = "";
            this.selectedItem = []
            this.ArrBox = [];
        }
    }
};
</script>

<style lang="less">
.sinselector {
    .weui-cells {
        margin-top: 0 !important;
    }
    .vux-no-group-title {
        margin-top: 0 !important;
    }
    .weui-cells:before {
        left: 15px !important;
    }
    .weui-cells:after {
        border-bottom: none !important;
    }
    .weui-textarea {
        text-align: right !important;
    }
}
.schecklistbtn {
    width: 100%;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 10px;
    box-sizing: border-box;
    z-index: 10000;
    background: #eee;
}
.popup1 {
    padding-bottom: 62px;
}
/* .border-top:before{
    border-top: 1px #f0f0f2 solid !important;
} */

.search {
    /* width: 100%; */
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10000;
    background: #eee;
}
.checkcontent_sin {
    margin-top: 43px;
}
.selectbox{
    display: flex;
    height: 24px;
    padding: 10px 15px;
    font-size: 17px;
    .stitle{
        height: 24px;
        position: relative;
        padding-right:2px; 
        .srequired{
            position: absolute;
            left: -8px;
            color: red;
        }
    }
    .svalue{
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        height: 24px;
        width: 100%;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
    }
}
</style>
