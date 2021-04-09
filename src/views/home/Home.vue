<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control
      :titles="['流行', '精选', '新款']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    />

    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @switerImageLoad="switerImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control
        :titles="['流行', '精选', '新款']"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <goods-list :goods="showGoods" />
      <!-- <goods-list :goods="goods['new'].list" />
    <goods-list :goods="goods['sell'].list" /> -->
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";


import { getHomeMultidata, getHomeGoods } from "network/home";
import {itemListenerMixin,backTopMixin} from 'common/mixin'


export default {
  name: "Home",
  mixins:[itemListenerMixin,backTopMixin],
  data() {
    return {
      // result: null,
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      tabOffseTop: 0,
      isTabFixed: false,
      saveY: 0, 
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
  },
  destroyed() {
    console.log("销毁");
  },
  activated() {
    console.log('actived');
    // 不写这个刷新偶尔会出现不能滚动的现象
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0,this.saveY,0)
  },
  deactivated() {
    // 1.保存Y值
    this.saveY=this.$refs.scroll.getScrollY()

    // 2.取消全局事件的监听
    // 这里还需要传入对应函数，取消的哪个函数，所以要对下面的函数进行封装
    this.$bus.$off('itemImageLoad',this.itemImageListener)
  },
  created() {
    console.log("创建Home");
    // 1.请求多个数据
    // 请求数据是异步操作
    /* getHomeMultidata().then((res) => {
      // 箭头函数的this是网上找作用域就是created里面的this(当前的组件对象)
      // 用变量result引用了res对象,(res指向的是数据那个对象，res保存的是数据对象的地址值，然后result接收了这个地址值)
      // 垃圾回收期把res回收了，数据对象不会被回收，因为result还指向着
      this.banners = res.data.banner.list;
      this.recommends = res.data.recommend.list;
    }); */
    this.getHomeMultidata();

    // 2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");

    // 这里犯错，在created里面因为很可能拿不到对象
    // 3.监听item中图片加载完成
    /*  this.$bus.$on('itemImageLoad',()=>{
      this.$refs.scroll.refresh()
      console.log("itemImageLoad");
    }) */
  },
  mounted() {
    // 1.图片加载完成的 时间监听
   /*  let refresh = debounce(this.$refs.scroll.refresh, 50);
    this.itemImageListener=() => {
      refresh();
    }
    this.$bus.$on("itemImageLoad", this.itemImageListener); */

    /* this.$bus.$on("itemImageLoad", () => {
      refresh();
    }); */

    // 2.获取tabControl的offsetTop
    // 所有的组件都有一个属性$el:用于获取组件中的元素

    // console.log(this.$refs.tabControl.$el.offsetTop);
  },
  methods: {
    /* 
      事件监听相关的方法
    */
    tabClick(index) {
      // console.log(index);
      // case穿透学过吗
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }

      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },

    contentScroll(position) {
      // console.log(position);
      // console.log("111");
      // 1.判断BackYop是否显示
      this.listenShowBackTip(position) 

      // 2.决定tabControl是否吸顶(position:fixed)
      this.isTabFixed = -position.y > this.tabOffseTop;
    },

    loadMore() {
      this.getHomeGoods(this.currentType);

      // this.$refs.scroll.scroll.refresh()
      console.log("上拉加载更多");
    },

    switerImageLoad() {
      // 现在这里可以调用四次，但是我们只需要一张图片加载完成后，高度就确定了，所以只需要调用一次即可
      //  console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffseTop = this.$refs.tabControl2.$el.offsetTop;
    },

    /* 
      网络请求相关的方法
    */
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        // 箭头函数的this是网上找作用域就是created里面的this(当前的组件对象)
        // 用变量result引用了res对象,(res指向的是数据那个对象，res保存的是数据对象的地址值，然后result接收了这个地址值)
        // 垃圾回收期把res回收了，数据对象不会被回收，因为result还指向着
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      // 复用代码的时候需要页码加1
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        // 这里可以通过遍历一个一个将数据添加到goods里面
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp();
      });
    },
  },
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  /* overflow: hidden; */
  height: 100vh;

  position: relative;
}

.home-nav {
  color: #fff;
  background-color: var(--color-tint);

  /* 固定定位是针对浏览器的 */
  /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动 */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

/* .tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
} */

/* 
设置后style scoped 只会针对当前组件的样式其效果
  这里的样式不会对scroll里面的对其他组件的没有影响 
*/

/* .content {
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px;
} */
/* .fixed {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
} */

.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.tab-control {
  position: relative;
  /* z-index只对定位元素起作用，相对定位是相对于原位置 */
  z-index: 9;
}
</style>
