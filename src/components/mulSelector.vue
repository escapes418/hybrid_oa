<template>
    <div class="sinselector">
        <group>
            <x-textarea :title="sTitle" :placeholder='sPlaceholder' :value="sValue" :rows="1" @click.native="showPopup=true" readonly>
                <span slot="label" v-if="isRequired" style="padding-right:20px;">{{sTitle}}<span class="required">*</span></span>
            </x-textarea>
        </group>
        <div v-transfer-dom>
            <popup v-model="showPopup" height="100%" style="-webkit-overflow-scrolling:touch;">
                <div class="popup1">
                    <group class="checkcontent_mul">
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
                        <x-button type="default" @click.native="showPopup = false">取消</x-button>
                    </flexbox-item>
                </flexbox>
            </box>
        </div>
    </div>
</template>

<script>
import { Popup, Checklist, Search, Box, Group, XInput, XTextarea, XButton, Flexbox, FlexboxItem, TransferDomDirective as TransferDom } from "vux";
import { setTimeout } from "timers";
import com from '@/assets/js/common'
export default {
    directives: { TransferDom },
    components: { Popup, Checklist, Box, Search, Group, XInput, XButton, Flexbox, FlexboxItem, XTextarea },
    props: {
        sTitle: String,
        sPlaceholder: String,
        sendData: Array,
        dataList: Array,
        isRequired: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            showPopup: false,
            sValue: "",
            ArrBox: [],
            selectedItem: [],
        };
    },
    created() {
        this.sValue = "";
        this.ArrBox = this.dataList;;

    },
    watch: {
        "dataList": function (newVal, oldVal) {
            this.getData()
        },
        "sendData": function (newVal, oldVal) {
            this.getData()
        }
    },
    mounted() {
        setTimeout(() => {
            this.getData();
        }, 0);
    },
    methods: {
        sltedKey2value() {
            var tempArray = [];
            this.selectedItem.map((el, index, self) => {
                this.dataList.map((_el, _index, _self) => {
                    if (el == _el.key) {
                        tempArray.push(_el.value);
                    }
                })
            });
            this.sValue = tempArray.join(',');
        },
        getData() {
            this.sValue = "";
            this.ArrBox = this.dataList;
            this.selectedItem = com.clone(this.sendData);

            this.sltedKey2value();
        },
        confirm() {
            this.sltedKey2value();

            this.showPopup = false;
            this.$emit("update:selectedItem", this.selectedItem);

            this.$emit("on-change");
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
.checkcontent_mul {
    margin-top: 0px;
}
</style>
