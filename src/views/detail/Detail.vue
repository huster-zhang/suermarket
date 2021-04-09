<template>
  <div id="detail">
    <!-- 事件这里是发出什么，还用什么就行 -->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <div>
        <li v-for="item in $store.state.cartList">
          {{ item }}
        </li>
      </div>
      <!-- 属性topImages，传入值top-images -->
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommends" :goods="recommends" />
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";

import { itemListenerMixin, backTopMixin } from "common/mixin";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "network/detail";
import { debounce } from "common/utils";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
    };
  },
  created() {
    // 1.保存传入的iid
    // 这里获取的是iid，要和路由index里面配置的一样
    this.iid = this.$route.params.iid;

    // 2.根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      // 1.获取顶部的图片轮播数据
      // console.log(res);
      const data = res.result;
      this.topImages = data.itemInfo.topImages;

      // 2.获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);

      // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 6.取出评论信息
      // 有的商品没有信息;  这里接口只有一条信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }

      // 1. 第一次获取值不对
      // 值不对的原因：this.$refs.params.$el 压根没有渲染
      /* this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
      console.log(this.themeTopYs); */

      /* this.$nextTick(() => {
        // 2. 第二次获取：值不对
        // 值不对的原因：没有包含图片

        // 根据最新的数据，对应的DOM是已经被渲染出来
        // 但是图片依然没有加载完(目前获取到的offsetTop是依然没有包含图片的)
        // offsetTop值不对，一般都是图片问题
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
        console.log(this.themeTopYs);
      }); */
    });

    // 3. 请求 推荐数据
    getRecommend().then((res) => {
      // console.log(res);
      this.recommends = res.data.list;
    });

    // 4. 给getThemeTopY赋值(对个this.themeTopYs赋值的操作进行防抖  )
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
      // console.log(this.themeTopYs);
    }, 100);
  },

  methods: {
    imageLoad() {
      // if语句判断后刷新
      // this.$refs.scroll.refresh();0

      // 这样直接写是每次都是调用都是新的refresh，没有闭包
      // let refresh = debounce(this.$refs.scroll.refresh, 50);

      // 2. 防抖
      this.refresh();

      this.getThemeTopY();
      /*  this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
      console.log(this.themeTopYs); */
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
    },

    contentScroll(position) {
      // console.log(position);
      // 1. 获取y值
      const positionY = -position.y;

      // 2. positionY和主题中值进行对比
      // for (let i in this.themeTopYs) {
      /* console.log(i);//i这里是个字符串,然后下面i+1 会拼串 */
      // for (let i = 0, length = this.themeTopYs.length; i < length; i++) {
      // console.log(i);
      /* if ( positionY > this.themeTopYs[i] &&positionY < this.themeTopYs[i + 1]
        ) {console.log(i);} */

      /* if (
          this.currentIndex !== i &&
            ((i < length - 1 &&
            positionY >= this.themeTopYs[i] &&
            positionY < this.themeTopYs[i + 1]) ||
          (i === length - 1 && positionY >= this.themeTopYs[i]))
        ) {
          this.currentIndex = i;
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex=this.currentIndex
        } */

      for (let i = 0, length = this.themeTopYs.length; i < length - 1; i++) {
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }

      // 3.是否显示回到顶部
      this.listenShowBackTip(position);
    },
    addToCart() {
      console.log("加入");
      // 1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.lowPrice;
      // iid是这个商品的唯一标示，必须也要传递过去
      product.iid = this.iid;

      // 2.将商品添加到购物车里面
      // this.$store.cartList.push(product) 这样不行，修改任何state数据，都需要通过mutation
      // this.$store.commit("addCart", product);
      this.$store.dispatch('addCart',product)
    },
  },
  /*   updated() {
    this.themeTopYs = [];

    this.themeTopYs.push(0);
    this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
    console.log(this.themeTopYs);
  }, */
  mounted() {
    // console.log("mounted");
  },
  destroyed() {
    // console.log("detail destroyed");
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px - 49px);
}
</style>
