<template>
  <div>
    <group title="基本信息" label-margin-right="1em">
      <x-input title="标题" :max="50" placeholder="请输入" v-model.trim="applyData.title">
        <span slot="label" class="mr-10">标题<span class="required">*</span></span>
      </x-input>
      <sinSelector
        sTitle="类型"
        :isRequired="true"
        sPlaceholder="请选择"
        :dataList="dictionary.actCategory"
        :sendData="applyData.type"
        :selectedItem.sync="applyData.type"
      ></sinSelector>
      <mulSelectors
        sTitle="标签"
        :max="3"
        :isRequired="true"
        sPlaceholder="请选择"
        :dataList="needLabel"
        :sendData="applyData.labelList"
        :selectedItem.sync="applyData.labelList"
      ></mulSelectors>
      <x-textarea title="描述" :autosize="true" :max="200" v-model.trim="applyData.description">
        <span slot="label" style="padding-right:10px;">描述<span class="required">*</span></span>
      </x-textarea>
    </group>
    <group title="负责人" label-margin-right="1em">
      <!-- <sinSelector sTitle='下级负责人' :isRequired="true" sPlaceholder='请选择' :dataList="linkmanList" :sendData="applyData.principal" :selectedItem.sync="applyData.principal"></sinSelector> -->
      <departTree
        sTitle="下级负责人"
        :isRequired="true"
        :isPeople="true"
        sPlaceholder="请选择"
        :dataList="principalList"
        :sendData="applyData.principal"
        :selectedItem.sync="applyData.principal"
      ></departTree>
    </group>
    <group title="参与人" label-margin-right="1em">
      <!-- <mulSelectors sTitle='参与人' :max="0" :isRequired="true" sPlaceholder='请选择' :dataList="linkmanList" :sendData="applyData.participantList" :selectedItem.sync="applyData.participantList"></mulSelectors> -->
      <multree
        sTitle="参与人"
        :isRequired="true"
        :isPeople="true"
        sPlaceholder="请选择"
        :dataList="participantList"
        :sendData="applyData.participantList"
        :selectedItem.sync="applyData.participantList"
      ></multree>
    </group>
    <box gap="10px 10px">
      <flexbox>
        <flexbox-item>
          <x-button v-if="isReadonly" type="primary" @click.native="backStep">返回</x-button>
          <x-button v-else type="primary" :disabled="disSubmit" @click.native="submit"
            >提交</x-button
          >
        </flexbox-item>
      </flexbox>
    </box>
  </div>
</template>
<script>
import Vue from 'vue';
import com from '@/assets/js/common';
import sinSelector from '@/components/sinSelector';
import mulSelectors from '@/components/mulSelectors';
import departTree from '@/components/departTree.vue';
import multree from '@/components/multree.vue';
import api from '@/assets/api/index.api';
import Utils from './utils';
import {
  Tab,
  TabItem,
  Group,
  Cell,
  CellBox,
  Icon,
  XInput,
  Selector,
  XAddress,
  Datetime,
  XButton,
  Popup,
  Box,
  Flexbox,
  XTextarea,
  Checklist,
  Confirm,
  FlexboxItem,
  TransferDomDirective as TransferDom
} from 'vux';

export default {
  name: 'CoopApply',
  directives: {
    TransferDom
  },
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
    departTree,
    multree,
    sinSelector,
    mulSelectors
  },
  data() {
    return {
      isSubmit: false,
      isReadonly: false,
      applyData: {
        description: '',
        participantList: [],
        labelList: [],
        principal: '',
        title: '',
        type: ''
      },
      projectList: [],
      needLabel: [],
      dictionary: {
        urgency: [],
        priority: [],
        product: [],
        actCategory: []
      },
      linkmanList: [],
      principalList: [],
      participantList: [],
      disSubmit: false
    };
  },
  created() {
    this.init();
    this.getDictionary();
  },
  methods: {
    init() {
      com.comGetStorage('queryDictInfo').then(rtn => {
        rtn.dict.forEach((item, index) => {
          this.projectList.push({
            ...item,
            value: item.label,
            key: item.value
          });
        });
      });
      // this.getLinkmanInfo();
      this.queryNeedLabel();
      this.queryNeedType();
      this.getTreeList();
    },
    queryNeedLabel() {
      com.covertHttp(api.queryNeedLabel).then(rtn => {
        rtn.data.forEach((item, index) => {
          this.needLabel.push({
            ...item,
            value: item.labelName,
            key: item.id
          });
        });
      });
    },
    queryNeedType() {
      com.covertHttp(api.queryNeedType, {}).then(rtn => {
        if (rtn.status == 0) {
          rtn.data.forEach((item, index) => {
            this.dictionary.actCategory.push({
              ...item,
              key: item.id,
              value: item.typeName
            });
          });
        }
      });
    },
    getTreeList() {
      com.covertHttp(api.orgAndUserInfo, { queryType: '2' }).then(rtn => {
        var list = com.addTreePeopel(rtn.data);
        var peopelList = com.hasChildren(list);
        this.principalList = com.clone(peopelList);
        this.participantList = com.clone(peopelList);
      });
    },
    getLinkmanInfo() {
      com.covertHttp(api.escortEmployee).then(rtn => {
        rtn.data.forEach((item, index) => {
          this.linkmanList.push({
            ...item,
            value: item.name,
            key: item.id
          });
        });
      });
    },
    getDictionary() {
      com.comGetStorage('queryDict').then(data => {
        var getData = data.dict;
        function selectDic(type) {
          let temp = [];
          for (var i = 0; i < getData.length; i++) {
            if (getData[i].type == type) {
              temp.push({
                ...getData[i],
                key: getData[i].value,
                value: getData[i].name
              });
            }
          }
          return temp;
        }
        this.dictionary.urgency = selectDic('urgency'); //紧急度
        this.dictionary.priority = selectDic('priority'); //优先级
        this.dictionary.product = selectDic('product'); //优先级
      });
    },
    handleApply() {
      var _this = this;
      com.covertHttp(api.addNeedFlow, this.applyData).then(rtn => {
        if (rtn.status == 0) {
          this.$vux.toast.text(rtn.message);
          this.$router.go(-1);
          com.delKeepAlive(_this, ['CoopList']);
        }
        this.disSubmit = false;
      });
    },
    backStep() {
      this.$router.go(-1);
    },
    submit() {
      var _this = this;
      if (!Utils.valiApply(this)) return; //校验
      this.disSubmit = true;
      this.$vux.confirm.show({
        title: '是否提交',
        content: '确定执行操作？',
        onCancel() {
          _this.disSubmit = false;
        },
        onConfirm() {
          _this.handleApply();
        }
      });
    }
  }
};
</script>
<style lang="less">
@import '../../assets/css/common/reset.fix.less';
@import '../../assets/css/common/base.less';
@import '../../assets/css/index.less';
</style>

