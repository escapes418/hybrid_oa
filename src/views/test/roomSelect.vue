<template>
    <div class="select-page" v-if="show" @click="closeShow">
        <div class="select-box" :style="{ top: (top/75+1.1)+'rem'}">
            <div class="select-item" v-for="(it,idx) in roomList" :key="idx" @click="clooseItem(idx)" :class="idx==index?'active':''">
                <div class="item-line">
                    <p class="line-label">门店名称</p>
                    <p class="line-info">{{it.name}}</p>
                </div>
                <div class="item-line">
                    <p class="line-label">楼栋信息</p>
                    <p class="line-info">{{it.houseInfo}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "roomSelect",
    data() {
        return {
            
        }
    },
    props: {
       roomList: Array,
       top: {
           default: 40,
           type: Number
       },
       show: Boolean,
       index: {         //选中的下标
           default: 0,
           type: Number
       }
    },
    mounted() {
        
    },
    methods: {
        closeShow() {
            this.$emit("update:show",false);
        },
        clooseItem(idx) {
            this.$emit("changeRoom",idx);
        }

    }
};
</script>
<style lang="less" scoped>
.select-page{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11;
    .select-box{
        position: absolute;
        left: .533rem;
        width: 8.933rem;
        padding: .133rem .533rem;
        border-radius: .133rem;
        background-color: #F6FDF4;
        box-shadow: 0 0 .267rem .107rem #F5F5F5;
        &::before {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            right: .44rem;
            top: -0.64rem;
            border: .32rem solid;
            border-color: transparent transparent #F6FDF4 transparent;
        }
        .select-item{
            padding: .267rem 0;
            font-size: .4rem;
            line-height: .667rem;
            color: #838383;
            border-bottom: 1px solid #E3E3E3;
            &:nth-last-child(1){
                border: 0;
            }
            .item-line{
                display: flex;
                .line-label{
                    margin-right: .533rem;
                }
            }
        }
        .select-item.active{
            color: #4C9C38;
        }
    }
}
</style>
