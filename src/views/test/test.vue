<template>
    <div>
        <p>new modules</p>
        <p>{{company}},{{nickName}}</p>
        <button @click="foo">click</button>

        <div v-for="(item, index) in aaa" :key="index">
            <div v-for="(el, idx) in item" :key="idx">

            </div>
        </div>
        <group title='基本信息' label-margin-right="1em"    >
            <x-input title="项目名称" v-model="applyData.projectName" placeholder='请输入'>
                <span slot="label">项目名称<span class="required">*</span></span>
            </x-input>
            <x-input title="科目" placeholder="请选择" :value="$refs.subjectPicker&&$refs.subjectPicker.getNameValues()" type="text" readonly @click.native="showSubject = true">
                <span slot="label">科目<span class="required">*</span></span>
            </x-input>
            <x-input id="targetInput" title="科目" placeholder="请选择"  type="text" readonly ></x-input>
            <!-- <br/>
                <br/>
                <br/>
                <br/>
                <br/>
              <input id="targetInput" type="text" placeholder="点我~~看固定效果" disabled/>   -->
              <!-- <testMultiPicker></testMultiPicker> -->
        </group>
        <group title="mask">
            <x-input title="手机号码格式化" mask="999 9999 9999" v-model="maskValue" :max="13"></x-input>
            <cell title="value" :value="maskValue"></cell>
            <x-input title="(99) 9-99" mask="(99) 9-99" v-model="maskValue2" :max="9"></x-input>
        </group>
        <!-- <popup-picker ref='subjectPicker' :show.sync="showSubject" v-model="popupValue" :data="jsondata.list4" :columns="4" style="display:none;" @on-hide="hideCb"></popup-picker> -->
        <div id="targetContainer"></div>
    </div>
</template>
<script lang="ts">
// 内网地址 http://localhost:9528/#/inforManage/staffWork
// vuex git地址 https://github.com/ktsn/vuex-class
/*
module path写法详见vc3-ts-demo项目
*/
import { Vue, Component } from "vue-property-decorator";
import { Tab, TabItem, Group, Cell, CellBox, Icon, XInput,Selector,XAddress, Datetime,PopupPicker,XButton,Popup,Box,Flexbox,XTextarea,Checklist,Confirm,  FlexboxItem, TransferDomDirective as TransferDom} from 'vux';
import { State, Getter, Mutation, Action } from "vuex-class";
// import MultiPicker from 'mob-multi-picker';
// import testMultiPicker from "./testMultiPicker.vue";
// import json from './json.js';
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
        PopupPicker,
        // testMultiPicker,
        // sinSelector,
        // mulSelectors,
        // MapInfo,
        // RemoteSearch,
        // departTree2,
    }
})
export default class List extends Vue {
    /* store */
    maskValue= '123456789'
    maskValue2= ''
    popupValue = []
    aaa=[]
    applyData = {
        projectName:"",
    }
    showSubject = false;
    // jsondata = json
    
    @State("staffWork") staffWork;
    @State(state => state.staffWork) staffWork1;
    //   @Action("setName") setName;
    @Action setName;
    /* data */
    company: string = "武汉";

    created() {
        // this.fetchDeviceCode()
        
    }
    /* lifecycle生命周期 */
    mounted(): void {
        // console.log("this is mounted");
        // console.log(this.staffWork);
        // console.log(this.staffWork1);
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
    }

    /* 计算属性 */
    get nickName(): string {
        return this.company + "- 司机宝";
    }

    /* methods */
    foo: { (): void } = () => {
        this.setName("小明");
        // console.log("this is print from foo Function!");
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
        console.log(closeType)
    }
}
</script>
<style lang="less" scoped>

</style>


