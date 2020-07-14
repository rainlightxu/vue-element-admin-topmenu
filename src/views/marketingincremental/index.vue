<template>
  <div>
    <h1>Marketing Incremental</h1>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    this.changeTitle();
  },
  destroyed() {
    this.$store.dispatch("app/setTitle", "Unilever TW BI Platform");
  },
  methods: {
    changeTitle() {
      this.$store.dispatch("app/setTitle", "Unilever TW Offtake Platform");
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
