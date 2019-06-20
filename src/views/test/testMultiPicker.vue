<template>
    <div class="multiPicker">
        <group>
            <!-- <input id="targetInput" type="text" placeholder="点我~~看固定效果" disabled/> -->
            <div type="text" class="selectbox" id="trigger3">
                <div id="targetInput" class="stitle">{{sTitle}}<span class="srequired" v-if="isRequired">*</span></div>
                <div class="svalue">{{sValue}}</div>
                <div class="svalue" style="color:#999" v-if="sValue === ''">{{sPlaceholder}}</div>
            </div>
        </group>
        <!-- <group title='基本信息' label-margin-right="1em"    >
            <x-input id="targetInput" title="科目" placeholder="请选择"  type="text" readonly ></x-input>
        
        </group> -->
        <div id="targetContainer"></div>
    </div>
</template>
<script lang="ts">
// 内网地址 http://localhost:9528/#/inforManage/staffWork
// vuex git地址 https://github.com/ktsn/vuex-class
/*
module path写法详见vc3-ts-demo项目
*/
import { Vue, Component, Prop} from "vue-property-decorator";
import { Tab, TabItem, Group, Cell, CellBox, Icon, XInput,Selector,XAddress, Datetime,PopupPicker,XButton,Popup,Box,Flexbox,XTextarea,Checklist,Confirm,  FlexboxItem, TransferDomDirective as TransferDom} from 'vux';
import { State, Getter, Mutation, Action } from "vuex-class";
// import MultiPicker from 'mob-multi-picker';
import MobileSelect from 'mobile-select'
import json from './json.js';
// export default Vue.extend({});

@Component({
    components: {
        Tab,
        TabItem,
        Group,
        Cell,
        CellBox,
        Icon,
        Selector,
        XInput,
        Datetime,
        Confirm,
        XButton,
        XAddress,
        Flexbox,
        FlexboxItem,
        XTextarea,
        Popup,
        Box,
        Checklist,
        PopupPicker
        // sinSelector,
        // mulSelectors,
        // MapInfo,
        // RemoteSearch,
        // departTree2,
    }
})
export default class List extends Vue {

    @Prop({ type: [String, Boolean, Number, Array], default: "请选择" })
    sTitle:any

    // @Prop({ type: [String, Boolean, Number, Array], default: "" })
    // sValue:any

    @Prop({ type: [String, Boolean, Number, Array], default: "请选择" })
    sPlaceholder:any

    @Prop({ type: [String, Boolean, Number, Array], default: false })
    isRequired:any

    /* store */
    maskValue= '123456789'
    maskValue2= ''
    popupValue = []
    sValue = ""
    aaa=[]
    applyData = {
        projectName:"",
    }
    showSubject = false;
    jsondata = json
    
    @State("staffWork") staffWork;
    @State(state => state.staffWork) staffWork1;
    //   @Action("setName") setName;
    @Action setName;

    created() {
        
    }
    mounted(): void {
        // new MultiPicker({
        //     input: 'targetInput',//点击触发插件的input框的id
        //     container: 'targetContainer',//插件插入的容器id
        //     jsonData: json.$data,
        //     success: function (arr) {
        //         // alert('页面会显示最终结果');
        //         console.log(arr)
        //         // document.getElementById('showBlock').innerHTML = JSON.stringify(arr);
        //     }//回调
        // });
        var _this = this
        var mobileSelect3 = new MobileSelect({
            trigger: '#trigger3',
            // title: '地区选择-联动',
            triggerDisplayData:false,
            ensureBtnColor:"#00B300",
            wheels: [{
                data:json.UplinkData
                }],
            position:[0,0],
            callback:function(indexArr, data){
                console.log(indexArr)
                console.log(data); //返回选中的json数据
                var d = []
                data.forEach((item,index) => {
                    d.push(item.value)
                })
                _this.sValue = d.join('-');
            }
            
        });
        mobileSelect3.locatePosition(0,1)
        mobileSelect3.locatePosition(1,2)
        mobileSelect3.locatePosition(2,2)
    }


    /* methods */
    foo: { (): void } = () => {
    };
    callFoo(): void {
        this.foo();
    }
    fetchDeviceCode(): void{
        console.log("fetchDeviceCode----------------")
        sdk.ability.fetchDeviceCode({
            success: function(res) {
                console.log("success", res);
            },
            fail(res) {
                console.log("获取设备码失败", res);
            }
        });
    }
    hideCb(closeType): void{

    }
}
</script>
<style lang="less" scoped>
.multiPicker {
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


