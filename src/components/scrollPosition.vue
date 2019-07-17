<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'scrollPosition',
  components: {},
  data() {
    return {
      lastPosition: 0
    };
  },
  created() {},
  mounted() {
    var _this = this;
    window.addEventListener('scroll', this.handleScroll);
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
// .scrolllist {
//   .wrapper {
//     width: 100%;
//     position: fixed;
//     top: 0px;
//     bottom: 0;
//     left: 0;
//     z-index: 10;
//     box-sizing: border-box;
//     overflow: hidden;
//   }
// }
</style>

