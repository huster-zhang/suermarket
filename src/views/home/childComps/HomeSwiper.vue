<template>
  <swiper>
    <!-- 封装到这里以后，banner没有数据，所以下面需要props出去banner -->
    <swiper-item v-for="item in banners">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad" />
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper";

export default {
  props: {
    banners: {
      type: Array,
      // 这里默认值必须是个函数
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      isLoad: false,
    };
  },
  components: {
    Swiper,
    SwiperItem,
  },
  methods: {
    imageLoad() {
      if (!this.isLoad) {
        this.$emit("switerImageLoad");
        this.isLoad = true;
      }
    },
  },
};
</script>

<style>
</style>