<template>
  <el-container>
    <el-header>
      <div class="app-side-logo">
        <img src="@/assets/logo.png"
             :width="isCollapse ? '60' : '60'"
             height="60" />
      </div>

      <el-menu default-active="1"
               class="el-menu-demo tab-page"
               mode="horizontal"
               @select="handleSelect"
               active-text-color="#409EFF">
        <el-menu-item index="1">处理中心</el-menu-item>
        <el-submenu index="2">
          <template slot="title">我的工作台</template>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
          <el-menu-item index="2-3">选项3</el-menu-item>
          <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项1</el-menu-item>
            <el-menu-item index="2-4-2">选项2</el-menu-item>
            <el-menu-item index="2-4-3">选项3</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="3"
                      disabled>消息中心</el-menu-item>
        <el-menu-item index="4">
          <a href="#">订单管理</a>
        </el-menu-item>
      </el-menu>

      <div class="app-header-userinfo">
        <el-dropdown trigger="hover"
                     :hide-on-click="false">
              <span class="el-dropdown-link">
                admin
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的消息</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item divided
                              @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <el-aside width="200px" class="app-side app-side-left"
                :class="isCollapse ? 'app-side-collapsed' : 'app-side-expanded'">
        <div style="width: 60px; cursor: pointer;"
             @click.prevent="isCollapse = !isCollapse">
          <i v-show="!isCollapse" class="el-icon-d-arrow-left"></i>
          <i v-show="isCollapse" class="el-icon-d-arrow-right"></i>
        </div>

        <el-menu>
          <el-submenu v-for="(menu1) in slideMenuDataSources" :key="menu1.mid">
            <template slot="title"><i class="el-icon-message"></i>{{menu1.title}}</template>

            <el-menu-item-group v-for="(menu2) in menu1.dataSources" :key="menu2.mid">
              <template slot="title">{{menu2.title}}</template>
              <el-menu-item v-for="(menu3) in menu2.dataSources" :key="menu3.mid">{{menu3.title}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <el-table :data="tableData">
          <el-table-column prop="date" label="日期" width="140">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>

    <el-footer>@2019/2030 迈旭科技 Ltd.</el-footer>
  </el-container>
</template>

<style>
  .el-container {
    height: 100%;
  }
  .el-header {
    background-color: white;
    color: #333;
    line-height: 60px;
    text-align: right;
    font-size: 12px;
  }
  .el-footer {
    background-color: white;
    color: #333;
    line-height: 60px;
    text-align: center;
  }
  .el-aside {
    color: #333;
  }
</style>

<script>
export default {
  data () {
    return {
      isCollapse: false,
      slideMenuDataSources: [
        {
          'mid': 1,
          'title': '首页',
          'iconClass': 'el-icon-message',
          'dataSources': [
            {
              'mid': 2,
              'title': '分组一',
              'dataSources': [
                {
                  'mid': 3,
                  'title': '主页'
                }]
            }]
        }]
    }
  },
  methods: {
    logout () {
      console.log('logout action')
    }
  }
}
</script>
