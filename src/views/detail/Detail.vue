<template>
  <div>{{iid}}</div>
</template>

<script>
export default {
  data() {
    return {
      iid:null
    }
  },
  created() {
    // 这里获取的是iid，要和index里面配置的一样
    this.iid=this.$route.params.iid
  },
}
</script>

<style>

</style>