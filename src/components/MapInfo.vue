<template>
    <div class="mapinfo">
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
            <popup v-model="showPopup" height="100%" :popup-style="{zIndex: 1000}" style="-webkit-overflow-scrolling:touch;">
                <el-amap-search-box class="map-search-box" :on-search-result="onSearchResult"></el-amap-search-box>
                <el-amap :vid="itemData.uid" ref="map" :center="mapCenter" :zoom="12" class="map-content" :events="mapEvent">
                    <el-amap-marker v-for="(marker,index) in markers" :position="marker.position" :events="marker.events" :key="index"></el-amap-marker>
                    <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>
                </el-amap>
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
} from "vux";
import Vue from 'vue';
import VueAMap from 'vue-amap';
import { setTimeout } from "timers";
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
    key: 'dc6f7d81b97b1e3f13fe76a55949a503',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch','AMap.Geocoder','AMap.Geolocation']
});
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
        sTitle: String, //选择框的title
        sPlaceholder: String, //Placeholder

        itemData: [String, Boolean, Number, Object], //选中的值
        isRequired: Boolean,
        index: Number,
    },
    data() {
        let _this = this;
        return {
            showPopup: false,
            sValue: "",
            search: "", //搜索框
            selectedItem: [], //选中的值
            markers: [],
            mapEvent:{
                init:(o)=>{
                    _this.getCurrent().then(()=>{
                        _this.$nextTick();
                        if(_this.itemData.lng&&_this.itemData.lat){
                            _this.markers.push({
                                position:[_this.itemData.lng,_this.itemData.lat]
                            })
                            _this.mapCenter = [_this.itemData.lng,_this.itemData.lat];
                        }
                    })
                },
                'click': async (e) => {
                    _this.markers = []
                    _this.markers.push({
                        position:[e.lnglat.lng, e.lnglat.lat],
                    });
                    let res = await _this.getAddress([e.lnglat.lng, e.lnglat.lat]);
                    e.lnglat.formattedAddress = res.regeocode.formattedAddress;
                    _this.position = e.lnglat;
                    this.mapCenter = [e.lnglat.lng, e.lnglat.lat];
                }
            },
            mapCenter:[114.42158, 30.4549],
            windows: [],
            window: '',
            position:{},
        };
    },
    created() {
        if(this.sLabel){
            this.sValue = this.sLabel;
        } else {
            this.sValue = "";
        }
        if(this.itemData.nodeAddress != ""){
            this.sValue = this.itemData.nodeAddress
        }
    },
    watch: {

    },
    mounted() {
        
    },
    methods: {
        confirm() {
            var i = this.index || 0;
            if(this.position.formattedAddress){
                this.itemData.nodeAddress = this.position.formattedAddress;
                this.sValue = this.position.formattedAddress;
                this.itemData.lat = this.position.lat;
                this.itemData.lng = this.position.lng;
                this.showPopup = false;
                this.itemData.index = i
                this.$emit("on-change",this.itemData);
            } else {
                this.showPopup = false;
            }
        },
        cancel() {
            this.showPopup = false;
        },
        onSearchCancel() {
            this.search = "";
            this.ArrBox = this.dataList;
        },
        onSearchResult(pois){
            let latSum = 0;
            let lngSum = 0;
            let self = this;
            let windows = [];
            if (pois.length > 0) {
                pois.forEach((poi,index) => {
                    let {lng, lat} = poi;
                    lngSum += lng;
                    latSum += lat;
                    this.markers.push({
                        position:[poi.lng, poi.lat],
                        events:{
                            async click(){
                                self.windows.forEach(window => {
                                    window.visible = false;
                                });
                                self.window = self.windows[index];
                                self.$nextTick(() => {
                                    self.window.visible = true;
                                });
                                let res = await self.getAddress([poi.lng, poi.lat]);
                                poi.formattedAddress = res.regeocode.formattedAddress;
                                self.position = poi;
                            }
                        }
                    });
                    windows.push({
                        position: [poi.lng, poi.lat],
                        content: `<div class="prompt">${ poi.name }</div>`,
                        visible: false
                    });
                    this.windows = windows;
                    let center = {
                        lng: lngSum / pois.length,
                        lat: latSum / pois.length
                    };
                    this.mapCenter = [center.lng, center.lat];
                })
            }
        },
        selectAddress(){
            if(this.position.formattedAddress){
                this.itemData.nodeAddress = this.position.formattedAddress;
                this.itemData.lat = this.position.lat;
                this.itemData.lng = this.position.lng;
            }
        },
        getAddress(lnglat){
            return new Promise((resolve,reject)=>{
                var geocoder = new AMap.Geocoder()  
                geocoder.getAddress(lnglat, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        // result为对应的地理位置详细信
                        resolve(result)
                    }
                })
            })
        },
        getCurrent(){
            return new Promise((resolve,reject)=>{
                let geolocation = new AMap.Geolocation({
                    // 是否使用高精度定位，默认：true
                    enableHighAccuracy: true,
                    // 设置定位超时时间，默认：无穷大
                    timeout: 5000,
                    // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
                    buttonOffset: new AMap.Pixel(10, 20),
                    //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    zoomToAccuracy: true,     
                    //  定位按钮的排放位置,  RB表示右下
                    buttonPosition: 'RB'
                })
                geolocation.getCurrentPosition((status, result) => {
                    if (result && result.position) {
                        self.mapCenter = [result.position.lng, result.position.lat];
                        resolve()
                    }
                });
            })
        },
    }
};
</script>

<style lang="less">
.mapinfo {
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
    .mulsele{
        display: flex;
        padding: 10px 15px;
        font-size: 17px;
        .stitle{
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
}
.map-search-box{
    position: fixed !important;
    top: 0;
    width: 100% !important;
}
.map-content{
    box-sizing: border-box;
    padding-bottom: 62px;
}
</style>
