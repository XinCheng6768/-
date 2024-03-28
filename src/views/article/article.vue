<template>
  <div class="article-page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>面经后台</el-breadcrumb-item>
      <el-breadcrumb-item>面经管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="never" border="false">
      <template #header>
        <div class="header">
          <span>共{{ total }}条记录</span>
          <el-button
            @click="open('add')"
            icon="el-icon-plus"
            size="small"
            type="primary"
            round
          >
            添加面经
          </el-button>
        </div>
      </template>
      <!-- 
        el-table 必须要设置data属性，来指定数据，数据是对象数组
        el-table-column 表格的列 用于指定当前列渲染什么数据
        prop属性  label表格的标题  width宽度
       -->
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column prop="stem" label="标题"> </el-table-column>
        <el-table-column prop="creator" label="作者"> </el-table-column>
        <el-table-column prop="likeCount" label="点赞"> </el-table-column>
        <el-table-column prop="views" label="浏览数"> </el-table-column>
        <el-table-column prop="createdAt" label="更新时间"> </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <div class="actions">
              <i @click="open('preview', row.id)" class="el-icon-view"></i>
              <i @click="open('edit', row.id)" class="el-icon-edit-outline"></i>
              <i @click="del(row.id)" class="el-icon-delete"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 
        分页组件
        current-change：当前页发生变化时触发该事件
        :current-page：（绑定属性）当前页
        :page-size: 每页显示多少条
        :total:总条数
        layout:布局 
        -----------------------------------------------  
        size-change="handleSizeChange"
        size-change：页面大小改变（每一页装多少条数据）
        :page-sizes： 分页器的设置，100/页，200/页
       -->
      <el-pagination
        background
        @current-change="hCurrentChange"
        :current-page="current"
        :page-size="pageSize"
        layout=" prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 
      visible:设置抽屉显示或者隐藏
      direction：设置抽屉打开的方向
      :before-close：设置关闭前的回调函数，一旦设置后抽屉就不会自动关闭了，而是会先执行这个函数，在函数内手动关闭
     
      .sync 是一个语法糖，类似于v-model
      1.v-bind 绑定了一个属性visible
      2.v-on 监听了@update:visible事件，修改visible变量
      isShow是父组件传来的值，语法糖在这里起子组件给父组件传值的作用
      -->
    <el-drawer
      :title="title[this.type]"
      :visible.sync="isShow"
      direction="rtl"
      :before-close="hClose"
      size="60%"
    >
      <div v-if="type === 'preview'" class="article-preview">
        <h5>{{ form.stem }}</h5>
        <div v-html="form.content"></div>
      </div>
      <el-form
        v-else
        :rules="rules"
        ref="form"
        :model="form"
        label-width="80px"
      >
        <el-form-item prop="stem" label="标题">
          <el-input placeholder="请输入面经标题" v-model="form.stem"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <quillEditor
            @blur="$refs.form.validateField('content')"
            v-model="form.content"
          ></quillEditor>
        </el-form-item>
        <el-form-item>
          <el-button @click="submit" type="primary">确认</el-button>
          <el-button @click="hClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import {
  addArticle,
  delArticle,
  getArticle,
  getArticleList,
  updateArticle,
} from "@/api/article";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
  name: "article-page",
  components: { quillEditor },
  data() {
    return {
      current: 1,
      pageSize: 10,
      list: [],
      total: 0,
      isShow: false,
      type: "add", //抽屉的状态
      form: {
        stem: "",
        content: "",
      },
      title: {
        //定义枚举
        add: "添加面经",
        preview: "预览面经",
        edit: "修改面经",
      },
      rules: {
        stem: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入标题", trigger: "blur" }],
      },
    };
  },
  created() {
    this.initData();
  },

  methods: {
    async initData() {
      const res = await getArticleList({
        current: this.current,
        pageSize: this.pageSize,
      });
      // console.log(res.data.rows);
      this.list = res.data.rows;
      this.total = res.data.total;
    },
    async del(id) {
      // console.log(id);
      await delArticle(id);
      this.$message.success("删除成功");
      if (this.list.length === 1 && this.current > 1) {
        this.current--;
      }
      this.initData();
    },
    hCurrentChange(val) {
      this.current = val;
      this.initData();
    },
    async open(type, id) {
      this.type = type; //记录状态
      this.isShow = true;
      //除了添加，其他两种情况都需要获取面经详情
      if (type !== "add") {
        const res = await getArticle(id);
        // console.log(res);
        //回显
        // this.form.stem = res.data.stem
        // this.form.content = res.data.content
        // this.form.id = res.data.id
        this.form = { ...res.data };
      }
    },
    hClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.closeDrawer();
        })
        .catch((_) => {});
    },
    async submit() {
      //校验
      await this.$refs.form.validate();
      //发请求
      if (this.type === "add") {
        await addArticle(this.form);
        //提示用户
        this.$message.success("添加成功");
        this.current = 1;
      } else if (this.type === "edit") {
        // id:this.form.id,
        // stem:this.form.stem,
        // content:this.form.content,
        const { id, stem, content } = this.form;
        await updateArticle({
          id,
          stem,
          content,
        });
        this.$message.success("修改成功");
      }

      //关闭抽屉
      this.closeDrawer();
      //重新渲染
      this.initData();
    },
    closeDrawer() {
      this.isShow = false;
      //重置表单
      if (this.type !== "preview") {
        this.$refs.form.resetFields();
      }
      //this.$refs.form &&this.$refs.form.resetFields()

      //重置form数据
      this.form = {
        stem: "",
        content: "",
      };
    },
  },
  // computed:{
  //   title(){
  //     let title = ''
  //     if(this.type ==='add'){
  //       title='添加面经'
  //     }else if(this.type ==='preview'){
  //       title='预览面经'
  //     }else{
  //       title='修改面经'
  //     }
  //     return title
  //   }
  // }
};
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 25px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 16px;
  }
  .actions {
    font-size: 18px;
    display: flex;
    justify-content: space-around;
    color: #666;
    > i:hover {
      color: rgba(114, 124, 245, 1);
      cursor: pointer;
    }
  }
}
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
.el-breadcrumb {
  margin-top: 10px;
}
.el-form {
  padding-right: 40px;
}
.quill-editor {
  ::v-deep .ql-editor {
    height: 300px;
  }
}
.el-rate {
  padding: 10px 0;
}
.article-preview {
  padding: 0 40px 40px 40px;
  > h5 {
    font-size: 20px;
    color: #666;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 30px;
    margin: 0 0 20px 0;
  }
}
</style>