<template>
    <div class="sinselector">
        <group>
            <div class="mulsele"  @click="showPopup=true">
                <div class="stitle">{{sTitle}}<span class="srequired" v-if="isRequired">*</span></div>
                <div class="svalue">
                    <div>{{sValue}}</div>
                </div>
                <div class="svalue" style="color:#999" v-if="!sValue">{{sPlaceholder}}</div>
            </div>
        </group>
        <div v-transfer-dom>
            <div class="search" v-if="showPopup">
                <search @on-submit="goSearch" v-model="search" placeholder="请输入关键字"></search>
            </div>
            <popup v-model="showPopup" height="100%" :popup-style="{zIndex: 900}" style="-webkit-overflow-scrolling:touch;">
                <div class="popup1">
                    <group class="checkcontent_sin">
                        <checklist label-position="left" :options="ArrBox" v-model="selectedItem"></checklist>
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
                    <flexbox-item>
                        <x-button type="default" @click.native="empty">清空</x-button>
                    </flexbox-item>
                </flexbox>
            </box> 
        </div>
    </div>
</template>

<script>
import com from "@/assets/js/common";
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
    PopupHeader,
    XDialog,
    CellFormPreview,
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
        PopupHeader,
        XDialog,
        CellFormPreview,
        XTextarea
    },
    props: {
        sLabel: [String, Boolean, Number, Array],
        sTitle: String, //选择框的title
        sPlaceholder: String, //Placeholder
        sendData: [String, Boolean, Number, Array], //选中的值
        isRequired: Boolean,
        rOption: Object,
    },
    data() {
        return {
            showPopup: false,
            sValue: "",
            ArrBox: [],
            search: "", //搜索框
            selectedItem: [], //选中的值
            hisData:[],//搜索过的数据
        };
    },
    created() {

    },
    watch: {
        "sendData": function(newVal, oldVal) {//传入的key发生变化时，重新匹配数据
            this.init()
        }
    },
    mounted() {
        var _this = this;
        setTimeout(function() {//list比key先加载完，就会选不中
            _this.init()
        }, 0);
    },
    methods: {
        init(){
            this.ArrBox = [];
            this.selectedItem = []
            this.selectedItem = this.sendData;
            if(this.sLabel){
                this.sValue = this.sLabel;
            } else {
                this.sValue = "";
                var tempArray = [];
                this.hisData.forEach((item, index) => {
                    this.selectedItem.forEach((el,idx)=>{
                        if(item.key == el){
                            tempArray.push(item.value)
                        }
                    })
                });
                this.sValue = tempArray.join(', ');
            }
        },
        async getList(){
            await com.debounce(500);//防抖
            com.covertHttp(this.rOption.api, {
                ...this.rOption.params,
                [this.rOption.search]: this.search
            }).then(rtn => {
                if(rtn.status == 0){
                    for (var i = 0; i < rtn.data.length; i++) {
                        this.ArrBox.push({
                            ...rtn.data[i],
                            value: rtn.data[i][this.rOption.value],
                            key: rtn.data[i][this.rOption.key] 
                        });
                    }
                    var d = com.clone(this.hisData)
                    this.hisData = this.distinct(d,this.ArrBox)
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
            var _this = this;
            var tempArray = [];
            var emitData = []
            this.hisData.forEach((item, index) => {
                _this.selectedItem.forEach((el,idx)=>{
                    if(item.key == el){
                        tempArray.push(item.value)
                        emitData.push({
                            key: item.key,
                            value: item.value,
                        })
                    }
                })
            });
            this.sValue = tempArray.join(', ');
            this.search = "";
            this.showPopup = false;

            if (this.selectedItem.length == 0) {
                this.$emit("update:selectedItem", this.selectedItem);
            } else {
                this.$emit("update:selectedItem", this.selectedItem);
            }
            this.$emit("on-change",emitData); //添加change事件
        },
        cancel() {
            this.search = "";
            this.showPopup = false;
        },
        empty() {
            this.search = "";
            this.sValue = "";
            this.selectedItem = []
            this.ArrBox = [];
            this.showPopup = false;
            this.$emit("update:selectedItem", this.selectedItem);
        },
        onSearchCancel() {
            this.search = "";
            this.sValue = "";
            this.selectedItem = []
            this.ArrBox = [];
        },
        distinct(list1,list2) {
            var result = [];
            var arr = list1.concat(list2)
            for (var i = 0; i < arr.length; i++) {
                for (var j = i + 1; j < arr.length; j++) {
                    if (arr[i].key === arr[j].key) {
                        j = ++i;
                    }
                }
                result.push(arr[i]);
            }
            return result
        },
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
.search {
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
.mulsele{
    display: flex;
    // height: 24px;
    padding: 10px 15px;
    font-size: 17px;
    .stitle{
        // height: 24px;
        position: relative;
        padding-right:5px; 
        .srequired{
            position: absolute;
            left: -8px;
            color: red;
        }
    }
    .svalue{ //是文本单行向左对齐，多行向右对齐
        line-height: 27px;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        width: 100%;
        text-align: right;
        div{
            width : auto;
            display : inline-block; 
            text-align : left; 
        }
    }
}

</style>
