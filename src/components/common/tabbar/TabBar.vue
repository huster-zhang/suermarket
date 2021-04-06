<template>
<!-- 
  tabbar 这个文件夹中的两个东西，在多个项目都可以使用，所以放到common文件夹
-->


  <!--  
  都写在这里显得逻辑太过复杂，tabbar只管好自己的逻辑就行，tabbar只负责自己的东西和样式，不关心item的，
  不用关心里面是什么布局(怎么嵌套的)，所以这里留一个插槽，小东西在开一个组件就行 
-->
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style>
#tab-bar {
  display: flex;
  background-color: #f7f5f7;

  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;

  box-shadow: 0px -1px 1px rgba(100, 100, 100, 0.1);
}
</style>