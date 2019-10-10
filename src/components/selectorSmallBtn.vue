<template>
  <div class="selectorSmallBtn">
    <!-- <div class="selectbox"  @click="showPopup=true">
            <div class="stitle">{{sTitle}}<span class="srequired" v-if="isRequired">*</span></div>
            <div class="svalue">{{sValue}}</div>
            <div class="svalue" style="color:#999" v-if="sValue === ''">{{sPlaceholder}}</div>
        </div> -->
    <div @click="showPopup = true">
      <span class="content"
        >{{ sValue }}
        <x-icon type="ios-arrow-down" size="14" style="fill:#333;margin-left:-5px;"></x-icon>
      </span>
    </div>

    <div v-transfer-dom>
      <div class="search" v-if="showPopup">
        <search
          @on-change="goSearch"
          v-model="search"
          @on-cancel="onSearchCancel"
          @on-clear="onSearchCancel"
          placeholder="请输入关键字"
        ></search>
      </div>
      <popup
        v-model="showPopup"
        height="100%"
        :popup-style="{ zIndex: 1000 }"
        style="-webkit-overflow-scrolling:touch;"
      >
        <div class="popup1">
          <group class="checkcontent_sin">
            <checklist
              :max="1"
              label-position="left"
              :options="ArrBox"
              v-model="selectedItem"
            ></checklist>
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
import {
  Popup,
  Checklist,
  Search,
  Box,
  Group,
  XTextarea,
  XButton,
  Flexbox,
  FlexboxItem,
  TransferDomDirective as TransferDom
} from 'vux';
import { setTimeout } from 'timers';
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
    XButton,
    Flexbox,
    FlexboxItem,
    XTextarea
  },
  props: {
    sLabel: [String, Boolean, Number, Array],
    // sTitle: String, //选择框的title
    // sPlaceholder: String, //Placeholder
    sendData: [String, Boolean, Number], //选中的值
    dataList: Array, //传入的数组，格式必须为[{value:"", key:"",}]
    isRequired: Boolean
  },
  data() {
    return {
      showPopup: false,
      sValue: '',
      ArrBox: [],
      search: '', //搜索框
      selectedItem: [] //选中的值
      // sendData: [],
    };
  },
  created() {
    if (this.sLabel) {
      this.sValue = this.sLabel;
    } else {
      this.sValue = '请选择';
    }
    this.ArrBox = this.dataList;
  },
  watch: {
    dataList: function(newVal, oldVal) {
      //传入的list发生变化时，重新匹配数据
      this.getData();
    },
    sendData: function(newVal, oldVal) {
      //传入的key发生变化时，重新匹配数据
      this.getData();
    }
  },
  mounted() {
    var _this = this;
    setTimeout(function() {
      //list比key先加载完，就会选不中
      _this.getData();
    }, 0);
  },
  methods: {
    getData() {
      if (this.sLabel) {
        this.sValue = this.sLabel;
      } else {
        this.sValue = '请选择';
      }
      this.ArrBox = this.dataList;
      this.selectedItem = [];
      this.selectedItem = [this.sendData];
      for (var idx in this.dataList) {
        if (this.dataList[idx].key == this.selectedItem[0]) {
          this.sValue = this.dataList[idx].value;
          return;
        }
      }
    },
    goSearch() {
      if (this.search == '') {
        this.ArrBox = this.dataList;
      } else {
        this.ArrBox = [];
        this.dataList.forEach((item, index) => {
          if (item.value.indexOf(this.search) != -1) {
            this.ArrBox.push(item);
          }
        });
      }
    },
    confirm() {
      var _this = this;
      this.sValue = '';
      this.dataList.forEach((item, index) => {
        if (item.key == _this.selectedItem[0]) {
          _this.sValue = item.value;
        }
      });
      this.search = '';
      this.ArrBox = this.dataList;
      this.showPopup = false;
      if (this.selectedItem.length == 0) {
        this.$emit('update:selectedItem', '');
      } else {
        this.$emit('update:selectedItem', this.selectedItem[0]);
      }
      this.$emit('on-change'); //添加change事件
    },
    cancel() {
      this.search = '';
      this.ArrBox = this.dataList;
      this.showPopup = false;
      // this.$emit("update:selectedItem","")
    },
    onSearchCancel() {
      this.search = '';
      this.ArrBox = this.dataList;
    }
  }
};
</script>

<style lang="less">
.selectorSmallBtn {
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
  .content {
    color: #333;
    font-size: 14px;
    background: #fff;
    border-radius: 10px;
    padding: 5px 8px;
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
// .selectbox{
//     display: flex;
//     height: 24px;
//     padding: 10px 15px;
//     font-size: 17px;
//     .stitle{
//         height: 24px;
//         position: relative;
//         padding-right:2px;
//         .srequired{
//             position: absolute;
//             left: -8px;
//             color: red;
//         }
//     }
//     .svalue{
//         -webkit-box-flex: 1;
//         -ms-flex: 1;
//         flex: 1;
//         height: 24px;
//         width: 100%;
//         text-align: right;
//         overflow: hidden;
//         text-overflow: ellipsis;
//         white-space:nowrap;
//     }
// }
</style>
