module.exports={
  configureWebpack:{
    // 解决路径问题
    resolve:{
      // extensions:[], 配置文件后缀，可以省略不写了，已经配置过了
      // 配置别名
      alias:{
        // '@':'src'  默认已经配置过了
        // 脚手架3可以使用@直接代替src
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
        /* 
          router,store 这种只需要一个地方引入，并且其他地方都可以通过$引用 不用配置
        */
      }
    }
  }
}