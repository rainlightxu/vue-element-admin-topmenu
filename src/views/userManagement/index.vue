<template>
  <div class="app-container">
    <el-card>
      <!-- <h1 class="title">用户管理界面</h1> -->
      <div class="filter-container">
        <el-input
          v-model="listQuery.name"
          placeholder="用户名"
          clearable
          class="filter-item"
          @input="handleFilter"
        ></el-input>
        <el-input
          v-model="listQuery.id"
          placeholder="账号"
          clearable
          class="filter-item"
          @input="handleFilter"
        ></el-input>
        <el-select
          v-model="listQuery.group"
          placeholder="分组"
          clearable
          class="filter-item"
          @change="handleFilter"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" class="addUserBtn">添加新用户</el-button>
      </div>
      <el-table :data="list" border style="width: 100%" v-loading="listLoading">
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="id" label="账号" width="180"></el-table-column>
        <el-table-column prop="created_time" label="创建时间"></el-table-column>
        <el-table-column prop="group" label="分组"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination> -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="fetchData"
      />
    </el-card>
  </div>
</template>
<script>
import { getUserList } from "@/api/userList";
import Pagination from "@/components/Pagination";
export default {
  name: "userManagement",
  components: {
    Pagination
  },
  data() {
    return {
      id: "",
      name: "",
      group: "",
      options: [
        {
          value: 0,
          label: "admin"
        },
        {
          value: 1,
          label: "editor"
        },
        {
          value: 2,
          label: "visitor"
        }
      ],
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        id: "",
        name: "",
        group: "",
        page: 1,
        limit: 10,
        sort: ""
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getUserList(this.listQuery).then(res => {
        // console.log(res)
        this.list = res.data.items;
        this.total = res.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.fetchData();
    },
    handleDelete(id) {},
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.fetchData();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.fetchData();
      // console.log(`当前页: ${val}`);
    }
  }
};
</script>
<style lang="scss" scoped>
.addUserBtn {
  float: right;
  margin-right: 100px;
}
</style>