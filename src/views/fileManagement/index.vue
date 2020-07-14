<template>
  <div class="app-container">
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="16">
          <h3>上传列表</h3>
        </el-col>
        <el-col class="btns" :span="8">
          <!-- <el-button
            type="success"
            size="small"
            icon="el-icon-plus"
            @click="dialogFolderVisible = true"
          >新建</el-button>-->
          <el-dropdown trigger="hover" @command="handleCommand" style="margin-right:10px;">
            <el-button type="primary" size="small" icon="el-icon-plus">
              新建
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">
                <!-- <i class="el-icon-folder"></i> -->
                <svg-icon icon-class="folder" class="icons"></svg-icon>
                <span>文件夹</span>
              </el-dropdown-item>
              <!-- <el-dropdown-item command="b">Word 文档</el-dropdown-item>
              <el-dropdown-item command="c">Excel 工作簿</el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="handleFileRemove">删除</el-button>
          <!-- <el-button type="info" size="small" icon="el-icon-rank" @click="handleMove">移动</el-button> -->
          <el-button
            type="primary"
            size="small"
            icon="el-icon-upload"
            @click="dialogUploadVisible = true"
          >上传</el-button>
          <el-button type="primary" size="small" icon="el-icon-download" @click="handleExport">下载</el-button>
          <!--  -->
        </el-col>
      </el-row>
      <div class="directory">
        <span>当前目录：</span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="#" v-for="item in currentPath" :key="item">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </el-card>
    <!-- fileList -->
    <el-card>
      <el-table
        :data="list"
        style="width: 100%;cursor:default;"
        @row-click="handleRowClicked"
        v-loading="listLoading"
        element-loading-text="Loading"
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection"></el-table-column>

        <el-table-column label="名称" align="left">
          <template slot-scope="scope">
            <i v-if="scope.row.Type === ' '" :class="iconMap(scope.row.Type)" class="icons"></i>
            <svg-icon v-else :icon-class="iconMap(scope.row.Type)" class="icons"></svg-icon>
            <el-link href="#">{{scope.row.Name}}</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型">
          <template slot-scope="scope">
            <span>{{scope.row.Type}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上传日期">
          <template slot-scope="scope">
            <span>{{scope.row.CreateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上传人员">
          <template slot-scope="scope">
            <span>{{scope.row.CreateUser}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="大小">
          <template slot-scope="scope">
            <span>{{scope.row.size}}</span>
          </template>
        </el-table-column>-->
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="fetchData"
      />
    </el-card>
    <!-- 新建文件夹对话框 -->
    <el-dialog title="创建文件夹" :visible.sync="dialogFolderVisible" width="20%" @close="addFolderDiaClosed">
      <el-form :model="addFolderForm" ref="addFolderRef" :rules="addFolderRules" label-position="right">
        <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addFolderForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFolderVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddFolder">创 建</el-button>
      </div>
    </el-dialog>
    <!-- 移动文件对话框 -->
    <!-- <el-dialog title="移动到" :visible.sync="dialogMoveVisible" width="20%">
      <el-form :model="form" label-position="right">
        <el-form-item label="文件夹" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择">
            <el-option label="个人报表" value="shanghai"></el-option>
            <el-option label="公司账单" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMoveVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogMoveVisible = false">确 定</el-button>
      </div>
    </el-dialog>-->
    <!-- 上传文件对话框:action="`/api/FileManage/Upload?father=${1}&person=${'admin'}`" -->
    <el-dialog
      title="上传文件"
      :visible.sync="dialogUploadVisible"
      width="35%"
      @close="dialogUploadClosed"
    >
      <el-upload
        :data="fileObj"
        class="upload-demo"
        drag
        ref="upload"
         action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :auto-upload="false"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :limit="3"
        :on-exceed="handleExceed"
        :on-error="handleError"
        :file-list="fileList"
        accept="image/*, .pdf, .xlsx"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import { getFileList } from "@/api/fileList";
import Pagination from "@/components/Pagination";
export default {
  name: "fileManagement",
  components: {
    Pagination
  },
  data() {
    return {
      list: [],
      currentPath: ["SourceData", "General", "Report"],
      total: 0,
      listQuery: {
        id: "",
        Name: "",
        Type: "",
        created: "",
        size: "",
        page: 1,
        limit: 10,
        sort: ""
      },
      listLoading: false,
      tableData: [
        {
          Name: "...",
          Type: "",
          CreateTime: "",
          CreateUser: "",
          Size: ""
        },
        {
          CreateTime: "2016-05-02",
          Name: "Program Files",
          Type: "文件夹",
          CreateUser: "赵六",
          Size: "100KB"
        },
        {
          CreateTime: "2016-05-04",
          Name: "Program Files",
          Type: "文件夹",
          CreateUser: "王五",
          Size: "100KB"
        },
        {
          CreateTime: "2016-05-01",
          Name: "Program Files",
          Type: "文件夹",
          CreateUser: "李四",
          Size: "100KB"
        },
        {
          CreateTime: "2016-05-03",
          Name: "Program Files",
          Type: "文件夹",
          CreateUser: "张三",
          Size: "100KB"
        }
      ],
      fileList: [],
      fileObj: {},
      dialogFolderVisible: false,
      dialogMoveVisible: false,
      dialogUploadVisible: false,
      addFolderForm: {
        name: "",
        father: "",
        person: ""
      },
      formLabelWidth: "60px",
      multipleSelectionArr: [],
      addFolderRules:{
        name:[{
          required:true
        }]
      }
    };
  },
  watch: {
    currentPath: function(val) {}
  },
  computed: {},
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getFileList(this.listQuery).then(res => {
        this.list = res.data.items;
        this.total = res.data.total;
        this.listLoading = false;
      });
    },
    iconMap(type) {
      switch (type) {
        case "文件夹": {
          return "folder";
          break;
        }
        case "文本文档": {
          return "txt";
          break;
        }
        case "应用程序": {
          return "exe";
          break;
        }
        case "WinRAR 压缩文件": {
          return "rar";
          break;
        }
        case "WinRAR ZIP 压缩文件": {
          return "zip";
          break;
        }
        case "Microsoft Excel 工作表": {
          return "excel";
          break;
        }
        case "Microsoft PowerPoint 演示文稿": {
          return "powerpoint";
          break;
        }
        case "Microsoft Word 文档": {
          return "word";
          break;
        }
        case "PNG 文件": {
          return "el-icon-picture";
          break;
        }
        case "JavaScript 文件": {
          return "el-icon-receiving";
          break;
        }
        default:
          return "";
      }
    },
    handleRowClicked(row, column, event) {
      if (row.Type === "文件夹") {
        this.$message.success("打开了文件夹！");
        this.list = this.tableData;
      } else if (row.Name === "...") {
        this.fetchData();
      } else {
        this.$message.success("打开了文件！");
      }
    },
    handleBreadcrumbClicked() {
      console.log("OK");
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleError(file, fileList) {
      this.$message.error("上传失败！");
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.Name}？`);
    },
    beforeUpload(file) {
      // console.log(file);
      // const isIMAGE =
      //   file.Type === "image/jpeg" ||
      //   file.Type === "image/gif" ||
      //   file.Type === "image/png";
      // const isLt1M = file.Size / 1024 / 1024 < 1;
      // if (!isIMAGE) {
      //   return this.$message.error("上传文件只能是jpeg或gif或png图片格式!");
      // }
      // if (!isLt1M) {
      //   return this.$message.error("上传文件大小不能超过 1MB!");
      // }
      // return isIMAGE && isLt1M;
    },
    handleSuccess(res, file, fileList) {
      // if (file.response.Status === "success") {
      //   response.ReturnObject.ViewList.map(v => {
      //     this.fileList.push({
      //       Name: file.response.ReturnObject.ViewList[0].FileName,
      //       url: file.response.ReturnObject.ViewList[0].SourceAdress,
      //       id: file.response.ReturnObject.ViewList[0].FileId
      //     });
      //   });

      //   this.$message({
      //     message: "上传成功!",
      //     Type: "success"
      //   });
      // } else {
      //   this.$message.error(file.response.Message);
      // }
      this.fileList = fileList;

      if(this.fileList.length >= 1) {
        this.$message.success("上传成功！");
        this.dialogUploadVisible = false;
        this.getFileList();
      }
      console.log(res, file, fileList, this.fileList, this.fileObj);
    },
    dialogUploadClosed() {
      this.fileList = [];
    },
    handleFileRemove() {
      if (
        this.multipleSelectionArr.length <= 0 ||
        this.multipleSelectionArr.length > 1
      ) {
        return this.$message.info("请选择要删除的文件！");
      }

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("", { id: "", person: "" })
            .then(res => {
              if (res.ReturnObj === 0) {
                this.getFileList();
                this.$notify.success({
                  title: "成功",
                  message: "删除文件成功！"
                });
              } else {
                this.$notify.error({
                  title: "失败",
                  message: "删除文件失败！"
                });
              }
            })
            .catch(err => {
              this.$notify.error({
                title: "错误",
                message: "请稍后再试！"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelectionArr = val;
    },
    handleCommand(command) {
      switch (command) {
        case "a": {
          this.dialogFolderVisible = true;
          break;
        }
        case "b": {
          this.dialogFolderVisible = true;
          break;
        }
        case "c": {
          this.dialogFolderVisible = true;
          break;
        }
      }
    },
    handleExport() {
      this.download(
        "http://115.28.78.175:81/Output/QA_ResultList20200424133235.xls"
      );

      // this.$axios
      //   .post("/api/COA/LoadCOAFiles", {
      //     IdList: this.reqIdList,
      //     COALanguage: this.listQuery.COALanguage
      //   })
      //   .then(res => {
      //     console.log(res);
      //     if (res.data.ResultType == 0) {
      //       this.download(res.data.ReturnObject.CoaResource);
      //     } else {
      //       this.$message.error({
      //         message: "导出失败!"
      //       });
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    download(href) {
      if (!href) {
        return;
      }
      let url = href;
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "exceasdasdasds");
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      // window.open(url);
      document.body.removeChild(link);
      // console.log(link);
    },
    handleMove() {
      if (this.multipleSelectionArr.length <= 0) {
        return this.$message.info("请选择要移动的文件！");
      }
      this.dialogMoveVisible = true;
    },
    confirmAddFolder() {
      this.$axios
        .post("", this.addFolderForm)
        .then(res => {
          if (res.ResultType === 0) {
            this.$notify.success({
              title: "成功",
              message: "添加文件夹成功！"
            });
            this.getFileList();
            dialogFolderVisible = false;
          } else {
            return this.$notify.error({
              title: "失败",
              message: "添加文件夹失败！"
            });
          }
        })
        .catch(err => {
          return this.$notify.error({
            title: "错误",
            message: "请稍后再试！"
          });
        });
    },
    addFolderDiaClosed(){
      this.$refs.addFolderRef.resetFields();
    },
    confirmUpload() {
      this.$refs.upload.submit();
    }
  }
};
</script>
<style lang="scss" scoped>
.directory {
  background-color: #eee;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  .el-breadcrumb {
    font-size: 16px;
    font-weight: bold;
    .el-breadcrumb-item {
      &:last-child {
        font-weight: bold;
      }
      &:last-of-type {
        font-weight: bold;
      }
    }
  }
}
.btns {
  height: 58px;
  line-height: 58px;
}
.icons {
  font-size: 20px;
}
</style>