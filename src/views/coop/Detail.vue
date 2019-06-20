<template>
    <div v-if="isReady">
        <div :class="!showNone?'coopdetail':['coopdetail','coopbottom']">
        <group title='基本信息'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">标题</span>
                            <span class="long-detail font-orange">{{dataArr.detail.title}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">类型</span>
                            <span class="long-detail">{{dataArr.detail.type}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">标签</span>
                            <span class="long-detail">{{dataArr.detail.labelList.join(',')}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">提交人</span>
                            <span class="long-detail">{{dataArr.detail.initiator}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">提交时间</span>
                            <span class="long-detail">{{dataArr.detail.initiateTime | stamp2TextDateFull}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">描述</span>
                            <span class="long-detail">{{dataArr.detail.description}}</span>
                        </div>                  
                    </div>
                </div>
            </cell-box>
        </group>
        <group title='进度情况'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">进度状态</span>
                            <span class="long-detail font-orange">{{dataArr.detail.progressStatus}}<span v-if="dataArr.detail.isEnd==1">(结束状态)</span></span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">状态变更时间</span>
                            <span class="long-detail">{{dataArr.detail.changeTime | stamp2TextDateFull}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">进度负责人</span>
                            <span class="long-detail">{{dataArr.detail.progressPrincipal}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">处理说明</span>
                            <span class="long-detail">{{dataArr.detail.handleExplain}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">需求紧急度</span>
                            <span class="long-detail">{{dataArr.detail.urgency}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">优先级</span>
                            <span class="long-detail">{{dataArr.detail.priority}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">产品端</span>
                            <span class="long-detail">{{dataArr.detail.productEnd}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">预计设计时间</span>
                            <span class="long-detail">{{dataArr.detail.planDesignTime | stamp2TextDate}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">预计开发时间</span>
                            <span class="long-detail">{{dataArr.detail.planDevTime | stamp2TextDate}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">预计提测时间</span>
                            <span class="long-detail">{{dataArr.detail.planTestTime | stamp2TextDate}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">预计上线时间</span>
                            <span class="long-detail">{{dataArr.detail.planReleaseTime | stamp2TextDate}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">实际上线时间</span>
                            <span class="long-detail">{{dataArr.detail.actualReleaseTime | stamp2TextDate}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">培训时间</span>
                            <span class="long-detail">{{dataArr.detail.trainTime | stamp2TextDate}}</span>
                        </div>                 
                    </div>
                </div>
            </cell-box>
        </group>
        <div class="add-btn mb-15">
            <span class="pointer"  @click="goHistory('hisProgress')">查看历史进度</span>
        </div>
        <group title='负责人'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">当前负责人</span>
                            <span class="long-detail">{{dataArr.detail.curPrincipal}}</span>
                        </div>                
                    </div>
                </div>
            </cell-box>
        </group>
        <div class="add-btn mb-15">
            <span class="pointer" @click="goHistory('hisPrincipal')">查看历史负责人</span>
        </div>
        <group title='参与人'>
            <cell-box>
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">参与人</span>
                            <span class="long-detail">{{dataArr.detail.participantList.join(',')}}</span>
                        </div>                
                    </div>
                </div>
            </cell-box>
        </group>
        <group title='评论'  v-if="count!==0">
            <cell-box v-for="(el,index) in commentListData" :key="index">
                <div class="w-100">
                    <div class="detail-text">
                        <div class="long-content">
                            <span class="detail-title long-title">评论人</span>
                            <span class="long-detail">{{el.commentator}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">时间</span>
                            <span class="long-detail">{{el.time | stamp2TextDateFull}}</span>
                        </div>
                        <div class="long-content">
                            <span class="detail-title long-title">评论内容</span>
                            <span class="long-detail">{{el.content}}</span>
                        </div>                    
                    </div>
                </div>
            </cell-box>
        </group>
        <div class="add-btn mb-15" v-if="loadmore">
            <span class="pointer" @click="clickLoadMore()">点击加载更多</span>
        </div>
        </div>
        <box class="coopfixbtn" ref="fixbtn" v-if="bottomType == 0&&!showNone">
            <img v-if="!onlyShowComment" src="../../assets/img/switch1.png" alt="" class="changeicon" @click="changeBttom(1)">
            <textarea class="send_area" ref="sendarea" maxlength="300" v-model="content" @focus="getfocus" @blur="getBlur"></textarea>
            <div class="send_btn" @click="commit">发送</div>
        </box>
        <box class="coopfixbtn" ref="fixbtn" v-if="bottomType == 1&&!onlyShowComment&&!showNone">
            <img v-if="showComment" src="../../assets/img/switch2.png" alt="" class="changeicon" @click="changeBttom(0)">
            <div v-if="showLowerPrincipal" class="btn" @click="showNextPrincipal = true">下级负责人</div>
            <div v-if="showParticipant" class="btn" @click="showEditParticipant = true">编辑参与人</div>
            <div v-if="showParticipant" class="btn green" @click="addProgress">增加进度</div>
        </box>
        <mulNotInput :showPopup="showNextPrincipal" @on-change="submitNextPrincipal" :dataList="linkmanList" @on-cancel="closeMulPup(1)"></mulNotInput>
        <mulNotInput :showPopup="showEditParticipant" @on-change="submitParticipant" :dataList="linkmanList" :max="0" @on-cancel="closeMulPup(2)" :sendData="addPeopleList" :selectedItem.sync="addPeopleList"></mulNotInput>
    </div>
</template>
<script>
import Vue from 'vue'
import com from '@/assets/js/common'
import api from '@/assets/api/index.api'
import XHR from '@/assets/js/XHR';
import mulNotInput from '@/components/mulNotInput'
import { Box, Confirm, Group, XButton,CellFormPreview, Timeline,Popup, Selector, Search, TimelineItem, Cell,ConfirmPlugin, CellBox, XTextarea, XInput, XDialog, Flexbox, FlexboxItem, TransferDomDirective as TransferDom } from 'vux';
import { setTimeout } from 'timers';
Vue.use(ConfirmPlugin)
export default {
    name: "CoopDetail",
    directives: {
        TransferDom
    },
    components: {
        Box,
        Confirm,
        Group,
        Selector,
        CellFormPreview,
        XButton,
        Popup,
        Timeline,
        TimelineItem,
        Cell,
        CellBox,
        Search,
        XTextarea,
        XInput,
        XDialog,
        Flexbox,
        FlexboxItem,
        mulNotInput,
    },
    data() {
        return {
            isReady: false,
            dataArr: {},
            linkmanList:[],
            showNextPrincipal:false,
            showEditParticipant:false,
            bottomType:1,
            scrollInterval:null,
            content:"",
            commentListData: [],
            count: -1,
            page: 1, //当前页数,
            pageTotal: 1,
            pageSize: 10, //固定常量
            onlyShowComment:false,
            showNone:false,
            addPeopleList:[],
        }
    },
    computed: {
        showComment(){
            return this.isShow(1)
        },
        showLowerPrincipal(){
            return this.isShow(2)
        },
        showParticipant(){
            return this.isShow(3)
        },
        showSchedule(){
            return this.isShow(4)
        },
        loadmore() {
            if (this.page >= this.pageTotal) {
                return false;
            } else {
                return true;
            }
        }
    },
    created() {
        this.init();
        this.getLinkmanInfo()
        this.getCommentList()
        this.getCurParticipantList()
    },
    mounted(){

    },
    methods: {
        autoTextAreaHeight(el) {
            var _this = this;
            el.style.height = el.scrollTop + el.scrollHeight + "px";
             var setStyle = function(el) {  
                if(_this.content.length>200) return
                el.style.height = 'auto';  
                el.style.height = el.scrollHeight + 'px';  
            }  
            function delayedResize(el) {  
                setTimeout(function() {  
                    setStyle(el)  
                },0);  
            }  
            if (el.addEventListener) {  
                el.addEventListener('input', function() {  
                    setStyle(el)  
                }, false);  
                setStyle(el)  
            } 
            else if (el.attachEvent) {  
                el.attachEvent('onpropertychange', function() {  
                    setStyle(el)  
                });  
                setStyle(el)  
            }  
            if (window.VBArray && window.addEventListener) {  
                el.attachEvent("onkeydown", function() {  
                    var key = window.event.keyCode;  
                    if (key == 8 || key == 46) delayedResize(el);  

                });  
                el.attachEvent("oncut", function() {  
                    delayedResize(el);  
                })
            }  
        },
        init() {
            var params = this.$route.params;
            if (params.id) {
                com.covertHttp(api.queryNeedDetail,{
                    id: params.id
                }).then(rtn => {
                    if (rtn.status != 0) {
                        // this.$vux.toast.text(rtn.message || "查询不到当前信息");
                        this.$router.push({ path: '/userIndex' });
                        return;
                    }
                    this.dataArr.detail = rtn.data;
                    if(this.dataArr.detail.operationList.length == 1&&this.dataArr.detail.operationList[0] == 1){
                        this.onlyShowComment = true;
                        this.bottomType = 0;
                        setTimeout(()=>{
                            this.autoTextAreaHeight(this.$refs.sendarea)
                        },1)
                    }
                    if(this.dataArr.detail.operationList.length == 0){
                        this.showNone = true;
                    }
                    this.isReady = true;
                })

            } else {
                console.log('参数异常');
                console.log(params);
                this.$router.push({ path: '/userIndex' });
            }
        },
        getLinkmanInfo() {
            com.covertHttp(api.escortEmployee).then(rtn => {
                rtn.data.forEach((item, index)=>{
                    this.linkmanList.push({
                        ...item,
                        value: item.name,
                        key: item.id,
                    });
                });
            });
        },
        getCommentList(opts) {
            var postData = {
                pageNo: this.page,
                pageSize: this.pageSize,
                ...opts
            };
            com.covertHttp(api.queryCommentList, {
                ...postData,
                needFlowId: this.$route.params.id,
            }).then(rtn => {
                this.commentListData = rtn.data.list;
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            });
        },
        clickLoadMore(opts) {
            this.page++;
            var postData = {
                pageNo: this.page,
                pageSize: this.pageSize,
                ...opts
            };
            com.covertHttp(api.queryCommentList, {
                ...postData,
                needFlowId: this.$route.params.id,
            }).then(rtn => {
                this.commentListData.push(...rtn.data.list);
                this.count = parseInt(rtn.data.total) || 0;
                this.pageTotal = Math.ceil(this.count / this.pageSize);
            });
        },
        utf16toEntities(data) {//表情
            var str = com.clone(data)
            var patt = /[\ud800-\udbff][\udc00-\udfff]/g;
            str = str.replace(patt, function(char) {
                var H, L, code;
                if (char.length === 2) {
                    H = char.charCodeAt(0);
                    L = char.charCodeAt(1);
                    code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
                    return "&#" + code + ";";
                } else {
                    return char;
                }
            });
            return str;
        },
        isShow(type){
            var flag = false;
            this.dataArr.detail.operationList.forEach((item,index)=>{
                if(item == type){
                    flag = true;
                }
            })
            return flag
        },
        goHistory(s){
            this.$router.push({ path:`/coop/${s}/${this.$route.params.id}` });
        },
        getCurParticipantList(){
            this.addPeopleList = [];
            com.covertHttp(api.queryCurParticipantList, {
                needFlowId: this.$route.params.id,
            }).then(rtn => {
                rtn.data.forEach((item, index)=>{
                    this.addPeopleList.push(item.userId);
                });
            });
        },
        commit(){
            var _this = this;
            if(this.content == ""){
                this.$vux.toast.text('请输入评论');
                return;
            }
            // var content = this.utf16toEntities(this.content)
            com.covertHttp(api.addComment,{
                needFlowId: this.$route.params.id,
                content:this.content,
            }).then(rtn => {
                if (rtn.status == 0) {
                    this.$vux.toast.text(rtn.message)
                    this.content = "";
                    this.page = 1;
                    com.delKeepAlive(_this,["CoopList"]);
                    setTimeout(()=>{
                        this.autoTextAreaHeight(this.$refs.sendarea)
                        this.getCommentList()
                    },10)
                }
            })
        },
        addProgress() {
            this.$router.push({ path:`/coop/schedule/${this.dataArr.detail.typeId}/${this.$route.params.id}` });
        },
        submitNextPrincipal(el){
            var _this = this;
            if(el.length == 0){
                this.$vux.toast.text('请选择下级负责人');
                return
            }
            com.covertHttp(api.setNextPrincipal,{
                needFlowId: this.$route.params.id,
                userId: el[0],
            }).then(rtn => {
                if (rtn.status == 0) {
                    this.$vux.toast.text(rtn.message)
                    this.init()
                    this.showNextPrincipal = false;
                    com.delKeepAlive(_this,["CoopList"])
                }

            })
        },
        submitParticipant(el){
            var _this = this;
            var d = com.clone(el)
            var userList = Array.from(new Set(d))
            if(userList.length == 0){
                this.$vux.toast.text('请编辑参与人');
                return
            }
            com.covertHttp(api.editParticipantList,{
                needFlowId: this.$route.params.id,
                userIdList: userList,
            }).then(rtn => {
                if (rtn.status == 0) {
                    this.$vux.toast.text(rtn.message)
                    this.init();
                    this.getCurParticipantList();
                    this.showEditParticipant = false;
                    com.delKeepAlive(_this,["CoopList"])
                }
            })
        },
        closeMulPup(type){
            if(type == 1){
                this.showNextPrincipal = false;
            } else {
                this.showEditParticipant = false;
            }
        },
        changeBttom(type) {
            this.bottomType = type
            if(type == 0){
                setTimeout(()=>{
                    this.autoTextAreaHeight(this.$refs.sendarea)
                },10)
            }
        },
        getfocus(e){
            let cnt = 0;
            setInterval( () => {
                if (cnt < 3) {
                    cnt++;
                } else {
                    clearInterval(this.scrollInterval);
                    this.scrollInterval = null;
                    return;
                }
                document.body.scrollTop = document.body.scrollHeight;
            }, 300);
        },
        getBlur(e){
             if (this.scrollInterval) {
                clearInterval(this.scrollInterval);
                this.scrollInterval = null;
            }
        }
    }
}
</script>
<style lang="less">
#app .coopdetail {
    overflow-y:scroll;
    -webkit-overflow-scrolling:touch;
    position:absolute;
    // width: 100%;
    left: 0;
    right: 0;
    top:0px;
    bottom:46px;  
}
#app .coopbottom{
    bottom:0px;  
}
#app .coopfixbtn{
    width: 100%;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;

    box-sizing: border-box;
    z-index: 999;
    background: #f0f0f2;
    display: flex;
    align-items:flex-start;
    .changeicon{
        width: 26px;
        padding: 10px
    }
    .send_btn{
        color: #09BB07;
        padding: 10px
    }
    .btn{
        text-align: center;
        color: #333;
        font-size: 16px;
        flex:1;
        height: 34px;
        line-height:33px;
        background: #F8F8F8;
        border-radius: 5px;
        margin: 6px 0;
        margin-left: 8px;
    }
    .green{
        background: #09BB07;
        margin-right: 8px;
        color: #fff;
    }
    input,textarea{-webkit-appearance: none;appearance: none;}
    .send_area{
        font-size: 14px;
        line-height: 18px;
        resize: none;
        margin: 4px 0 4px 9px;
        padding: 0px 10px;
        height: auto;
        border:#D9D9D9 1px solid;
        border-radius: 10px;
        background: #fff;
        color: #333;
        flex: 1;
    }
}
</style>
