// 生命周期里的函数可以抽取，但是函数内部的东西，不能抽取，会覆盖的 
import { debounce } from "common/utils";
import BackTop from "components/content/backTop/BackTop";
import { BACKTOP_DISTANCE } from "common/const";


export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null,
      refresh: null
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 50);
    // 下面产生了闭包  内部函数一只调用外部 函数mounted的变量refresh，所以每次调用的都是不同的refresh
    this.itemImageListener = () => {
      this.refresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImageListener);
    // console.log('我是混入中的内容');
  },
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backClick() {
      // this.$refs.scroll拿到了这个组件对象，直接访问里面的方法
      // this.$refs.scroll.scroll.scrollTo(0,0,500)  封装进去方法
      this.$refs.scroll.scrollTo(0, 0, 300);
    },
    listenShowBackTip(position) {
      this.isShowBackTop = -position.y > BACKTOP_DISTANCE;
    },
  },
}