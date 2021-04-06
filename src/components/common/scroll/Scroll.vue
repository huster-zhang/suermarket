<template>
  <!-- 
  children还有这个东欧关系
  ref这个东西一般绑定个子组件， div上面也可以绑定，
-->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  props: {
    probeType: {
      type: Number,
      default: 0,
    },
    pullUpLoad: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scroll: null,
    };
  },
  mounted() {
    /* 
      document.querySelector(".wrapper")通过这种方式拿DOM对象，有时候万一外面的类名也是这个，可能拿错
        vue里面拿元素有一个办法，就是给元素绑定一个ref
    */

    // 1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
      // observeDOM: true
    });

    // console.log(this.scroll);

    // 2.监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on("scroll", (position) => {
        // console.log(position);
        this.$emit("scroll", position);
      });
    }

    // 3.监听scroll滚动到底部
    if (this.pullUpLoad) {
      this.scroll.on("pullingUp", () => {
        // console.log('到底了');
        this.$emit("pullingUp");
      });
    }

    // 3.监听上拉加载更多
    // this.scroll.on("pullingUp", () => {
    //   this.$emit('pullingUp')
    // });
  },
  methods: {
    // ES6中可以直接给形参赋值传进去
    // scrollTo(x,y,time=300){ }
    scrollTo(x, y, time = 300) {
      // this.scroll.scrollTo(x, y, time);
      this.scroll && this.scroll.scrollTo(x, y, time);
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    finishPullUp() {
      this.scroll.finishPullUp();
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0;
    },
  },
};
</script>

<style>
</style>