import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  // mutations唯一的目的就是修改state中状态
  // mutations中的每个方法尽可能完成的事件比较单一一点
  // (初始时addCart运行即有可能是数量加一，也有可能是添加了新的商品，最好不要这样做)
  // 有判断逻辑的东西也放到actions里面，里面不仅仅放异步操作的东西
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    state.cartList.push(payload)
  }
}