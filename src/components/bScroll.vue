<template>
  <div class="scrolllist">
    <div class="wrapper" ref="bsWrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
export default {
  name: 'bScroll',
  components: {},
  data() {
    return {
      movePosition: {
        x: 0,
        y: 0
      }
    };
  },
  created() {},
  mounted() {
    var _this = this;
    this.$nextTick(() => {
      if (!this.scroll) {
        var bsWrapper = document.querySelector('.wrapper');
        this.scroll = new BScroll(bsWrapper, {
          probeType: 0,
          // momentumLimitTime: 300,
          useTransition: false,
          click: true,
          bounce: false
        });
        this.scroll.on('scrollEnd', e => {
          console.log(e);
          this.movePosition = e;
        });
      }
    });
  },
  activated() {
    console.log(this.movePosition, 'this.movePosition');
    this.move2LastPosition();
  },
  watch: {},
  computed: {},
  methods: {
    move2LastPosition() {
      this.scroll.scrollTo(this.movePosition.x, this.movePosition.y);
    }
  }
};
</script>
<style lang="less">
.scrolllist {
  .wrapper {
    width: 100%;
    position: fixed;
    top: 0px;
    bottom: 0;
    left: 0;
    z-index: 10;
    box-sizing: border-box;
    overflow: hidden;
  }
}
</style>

