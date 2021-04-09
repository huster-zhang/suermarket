<template>
  <div id="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ Length }})</div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

import { mapGetters } from "vuex";

export default {
  name: "Cart",
  components: {
    NavBar,
  },
  computed: {
    /* cartLength(){
        // 若是使用的地方比较多话，最好封装到getters
        // return this.$store.state.cartList.length
        // 但是这样还是很长，想把getters里面cartLength直接转成计算属性
        // getters里面的cartLength直接搬到这里来用
        // return this.$store.getters.cartLength
      } */

    // 两种语法
    // ...mapGetters(['cartLength','cartList'])
    ...mapGetters({
      length: "cartLength",
      list: "cartList",
    }),
  },
};
</script>

<style scoped>
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 600;
}
</style>
