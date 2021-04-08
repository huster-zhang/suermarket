<template>
  <swiper class="detail-swiper">
    <swiper-item v-for="item in topImages">
      <img :src="item" alt="" />
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper";

export default {
  components: {
    Swiper,
    SwiperItem,
  },
  props: {
    topImages: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped>
/* 设置成swipper轮播图会不动 小圆点定位是按照 swiper定位的*/
.detail-swiper {
  height: 300px;
  overflow: hidden;
}
</style>