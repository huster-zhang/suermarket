// 封装首页数据的请求
// 方便管理整个首页，首页可能用到好几次request
// 增加home.js模块，首页只需要面向这个模块开发，只需要调用这个里面的函数，这个里面对首页请求的url进行统一管理
// Home.vue只需要面向home.js开发
import { request } from './request'

export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}


// 这里使用有参数要传递的，才知道请求的是哪类数据
export function getHomeGoods(type, page) {
  return request({
    url: '/home/data',
    params: {
      type,
      page
    }
  })
}

// 函数里面的东西执行完以后都会被回收了
// 函数调用 -> 压入函数栈(保存函数调用过程中所有变量)
// 函数调用结束 -> 弹出函数栈(释放函数所有的变量)
// function test() {
//   const names = ['why', 'aaa']
// }
//
// test()
//
// test()


// const totalNums = []
// const nums = [20, 11, 222]
// const nums = [111, 22, 333]

/* for (let n of nums1){
  totalNums.push(n)
} */

// totalNums.push(...nusm1)


