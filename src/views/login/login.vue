<template>
  <!-- 
    修改组件样式：
    1.给他加一个类名class，这个类名会自动添加到组件的跟元素上
    2.所有的组件都会严格按照规范，有一个自带的类名：组件名
    -->
  <div class="login-page">
    <el-card>
      <template #header> 黑马面筋 </template>
      <!-- 
        element表单校验：
        表单校验三要素：
        1.el-form：必须要有model属性和rules属性
        -model：表示当前表单绑定的数据对象
        -rules: 表示校验规则
        2.el-form-item: 必须绑定一个'prop'属性来指定校验规则
        3.el-input:绑定'v-model'
       -->
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="用户名:" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item class="tc">
          <el-button @click='login' type="primary">登录</el-button>
          <el-button @click='reset'>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        //trigger:什么时机进行校验 blur:失去焦点时进行校验 change：发生改变时进行校验
        //pattern:正则校验规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 4,
            max: 16,
            message: "长度需在4-16个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码",trigger: ["blur", "change"]},
          { pattern:/^\w{4,10}$/,
            message: "长度需在4-10个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods:{
    login(){
      //兜底校验，校验整个表单是否通过验证
      //ref 可以获取dom元素 也可以获取组件对象
      this.$refs.form.validate(async valid=>{
        if(!valid) return
      // try{
          // console.log('我要登录');
        //注意：dispatch 触发actions 的执行，由于actions 中做的是异步任务，所以无法立即获取到结果
        await this.$store.dispatch('user/loginAction',this.form)
        this.$router.push('/')
        this.$message.success('登入成功')
      // }catch(e){
      //   this.$message.error(e.response.data.message)
      // }
      })
    },
    reset(){
      this.$refs.form.resetFields()
    },
  }
};
</script>

<style lang="scss" scoped>
//scoped 只能给当前组件内的所有标签添加 data-v-hash
//但是,el-card 里面的元素没有被添加这个唯一标识，所以直接设置样式无法生效
//解决方案：深度作用选择器
//less: 在选择器前面添加 /deep/
//scss: 在选择器前面添加 ::v-deep
.login-page {
  min-height: 100vh;
  background: url(@/assets/login-bg.svg) no-repeat center / cover;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .el-card {
    width: 420px;
    ::v-deep .el-card__header {
      height: 80px;
      background-color: #727cf5;
      text-align: center;
      line-height: 40px;
      color: white;
      font-size: 18px;
    }
  }
  .er-form {
    padding: 0 20px;
  }
  .tc {
    text-align: center;
  }
}
</style>