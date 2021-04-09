import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  addCart(context, payload) {
    // addCart({state,commit}, payload) { //对象的解构
    // payload新添加的商品
    // 数组常用的方法有哪些？push/pop/unshift/sort/reverse/map/filter/reduce/join
    /* let oldProduct = null
    for (let item of state.cartList) {
      if (item.iid === payload.iid) {
        oldProduct = item
      }
    }
    // 2.判断oldProduct
    if (oldProduct) {
      oldProduct.count += 1
    } else {
      payload.count = 1
      state.cartList.push(payload)
    } */

    // 查询数组中符合条件的第一个元素，如果没有符合条件的元素则返回undefined
    // 方法为数组中的每个元素都调用一次函数执行,数组中的元素在测试条件时返回 true 时, find() 返回符合条件的元素，之后的值不会再调用执行函数。
    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
    if (oldProduct) {
      // oldProduct.count += 1  //相加放到mutation里面，就可以跟踪了
      context.commit(ADD_COUNTER, oldProduct)
    } else {
      payload.count = 1
      // context.state.cartList.push(payload)
      context.commit(ADD_TO_CART, payload)
    }

  }
}