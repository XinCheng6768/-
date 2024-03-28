<template>
  <router-view></router-view>
</template>

<script>
export default {

}
</script>

<style lang="scss">
//定义变量
$bgc:blue;
.father{
  width: 200px;
  height: 200px;
  background-color: $bgc;
  .son{
    width: 100px;
    height: 100px;
    background-color: red;
  }

}
</style>
