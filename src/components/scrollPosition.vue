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
    this.goPosition();
    window.addEventListener('scroll', this.handleScroll);
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  watch: {},
  computed: {},
  methods: {
    handleScroll() {
      this.lastPosition = document.documentElement.scrollTop || document.body.scrollTop;
    },
    goPosition() {
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.lastPosition;
        window.pageYOffset = this.lastPosition;
        document.body.scrollTop = this.lastPosition;
      });
    }
  }
};
</script>
<style lang="less">
</style>

