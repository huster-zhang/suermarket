<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive"><slot name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <!-- v-bind 动态绑定style 并且把这个属性抽取到计算属性里面 -->
    <div :style="activeStyle"><slot name="item-text"></slot></div>
  </div>
</template>

<script>
export default {
  props: {
    path: String,
    activeColor: {
      type: String,
      default: "#ff5777",
    },
  },
  data() {
    return {
      // isActive: true,
    };
  },
  // 动态了解那个item是活跃的
  computed: {
    isActive() {
      /* 哪一个路由是活跃的，他就是$route */
      //  /home -> item1(/home) = true
      //  /home -> item1(/category) = false
      //  /home -> item1(/cart) = false
      //  /home -> item1(/profile) = false
      return this.$route.path.indexOf(this.path) !== -1;
      /* 
        indexOf方法
      */
    },
    activeStyle() {
      return this.isActive ? { color: this.activeColor } : {};
    },
  },

  methods: {
    itemClick() {
      /* 到底用router还是route */
      this.$router.replace(this.path);
    },
  },
};
</script>

<style scoped>
.tab-bar-item {
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
}

.tab-bar-item img {
  width: 24px;
  height: 24px;
  margin-top: 3px;
  vertical-align: middle;
  margin-bottom: 2px;
}
</style>