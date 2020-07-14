<template>
  <section class="app-main">
    <breadcrumb class="breadcrumb-container" />

    <transition name="fade-transform" mode="out-in">
      <router-view class="main-inner" :key="key" />
    </transition>
  </section>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";

export default {
  name: "AppMain",
  components: {
    Breadcrumb
  },
  computed: {
    key() {
      return this.$route.path;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 0px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #EAEDF1;
}
.fixed-header + .app-main {
  padding-top: 70px;
  height: 100vh;
  overflow: auto;
}
.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
.breadcrumb-container {
  margin-left: 0 !important;
  height: 50px;
  width: 100%;
  background-color: #fff;
  position: fixed;
  z-index: 9;
  border-top: 1px solid #eee;
}
.main-inner{
  padding-top: 65px;
  height: 100%;
}
</style>
