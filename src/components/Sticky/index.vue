<template>
  <div
    :style="{height:height+'px',lineHeight:height+'px',zIndex:zIndex}"
  >
    <div
      :class="className"
      :style="{top:(isSticky ? stickyTop +'px' : ''),zIndex:zIndex,position:position,width:width,height:height+'px'}"
    >
      <slot>
        <div>sticky</div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sticky",
  props: {
    stickyTop: {
      type: Number,
      default: 70
    },
    zIndex: {
      type: Number,
      default: 10
    },
    className: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      active: false,
      position: "",
      width: undefined,
      height: undefined,
      isSticky: false
    };
  },
  mounted() {
    this.height = this.$el.getBoundingClientRect().height;
    this.lineHeight = this.$el.getBoundingClientRect().height;
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleResize);
  },
  activated() {
    this.handleScroll();
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    sticky() {
      if (this.active) {
        return;
      }
      this.position = "fixed";
      this.active = true;
      this.width = this.width + "px";
      this.isSticky = true;
    },
    handleReset() {
      if (!this.active) {
        return;
      }
      this.reset();
    },
    reset() {
      this.position = "";
      this.width = "auto";
      this.active = false;
      this.isSticky = false;
    },
    handleScroll() {
      const width = this.$el.getBoundingClientRect().width;
      this.width = width || "auto";
      const offsetTop = this.$el.getBoundingClientRect().top;
      if (offsetTop < this.stickyTop) {
        this.sticky();
        return;
      }
      this.handleReset();
    },
    handleResize() {
      if (this.isSticky) {
        this.width = this.$el.getBoundingClientRect().width + "px";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.sub-navbar {
  height: 50px;
  line-height: 50px;
  position: relative;
  width: 100%;
  text-align: right;
  padding-right: 20px;
  -webkit-transition: position 0.6s ease;
  transition: position 0.6s ease;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    from(#20b6f9),
    color-stop(0, #20b6f9),
    color-stop(100%, #2178f1),
    to(#2178f1)
  );
  background: linear-gradient(
    90deg,
    #20b6f9,
    #20b6f9 0,
    #2178f1 100%,
    #2178f1 0
  );
}
</style>