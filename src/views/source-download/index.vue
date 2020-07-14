
<template>
  <div class="home">
    <el-card class="card">
      <div class="toolbar">
        <!-- <el-upload
            class="upload-demo"
            style="width:200px;float:left;"
            action
            :auto-upload="false"
            :on-change="importSSExcel"
            ref="upload"
          >
            <el-button size="small" type="primary">导入</el-button>
        </el-upload>-->
        <el-input v-model="listQuery.Id" placeholder="SRName" class="filter-item"></el-input>
        <!-- <el-input v-model="listQuery.SKUCode" placeholder="渠道分配" class="filter-item"></el-input> -->
        <el-select v-model="listQuery.Lang" placeholder="Store Pool" class="filter-item">
          <el-option value="0" label="Y">Y</el-option>
          <el-option value="1" label="N">N</el-option>
        </el-select>
        <!-- <el-input v-model="listQuery.SKUDesc" placeholder="区域" class="filter-item"></el-input>
          <div style="display:inline-block;float:right;margin:0 10px 10px 0;">
            <span>活动月份:</span>
            <el-date-picker
              v-model="listQuery.StartDate"
              type="date"
              placeholder="开始日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              @change="handleFilter"
            ></el-date-picker>
            <span>-</span>
            <el-date-picker
              v-model="listQuery.EndDate"
              type="date"
              placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              @change="handleFilter"
            ></el-date-picker>
          </div>

          <el-button
            icon="el-icon-search"
            type="primary"
            @click="handleFilter"
            class="filter-item"
        >搜索</el-button>-->
        <!-- <input
            type="file"
            class="el-button"
            @change="importExcel($event)"
            style="height: 45px;margin-right:10px;"
        />-->
        <div style="display:inline-block;float:right;margin-bottom:10px;">
          <el-button icon="el-icon-download" type="primary" size @click="exportExcel">导出到Excel</el-button>
          <el-button icon="el-icon-upload" type="primary" @click="upload">上 传</el-button>
          <!-- <el-button type="primary" @click="fromJSON()">fromJSON</el-button> -->
          <!-- <el-button type="primary" @click="bindDataSource()">绑定表单</el-button> -->
        </div>
        <!-- <el-button icon="el-icon-lock" type="primary" @click="lockSpread(spread)">锁定表单</el-button>
        <el-button icon="el-icon-unlock" type="primary" @click="unlockSpread(spread)">解锁表单</el-button>-->
      </div>

      <div class="spreadWrapper">
        <div ref="formulaBar" class="formulaBar" contenteditable="true" spellcheck="false"></div>
        <gc-spread-sheets
          class="spreadHost"
          v-loading="listLoading"
          @workbookInitialized="workbookInitialized($event)"
        >
          <gc-worksheet></gc-worksheet>
        </gc-spread-sheets>
        <!-- <div ref="statusBar" class="statusBar"></div>  :dataSource="dataTable"-->
      </div>
      <span id="tableColumnsContainer"></span>
    </el-card>
  </div>
</template> 
<script>
/* eslint-disable */
import Vue from "vue";

import { Message } from "element-ui";

// import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";
// import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013darkGray.css";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013lightGray.css";
import "@grapecity/spread-sheets-vue";
import GC from "@grapecity/spread-sheets";
import ExcelIO from "@grapecity/spread-excelio";
import FileSaver from "file-saver";
import "@grapecity/spread-sheets-resources-zh";
import PC from "./PC.json";
import HH from "./HH.json";
import ssJSON from "./ssJSON.json";   
import { dataSource, dataSource_HH, dataSource_PC } from "./datasource.js";
GC.Spread.Common.CultureManager.culture("zh-cn");
GC.Spread.Sheets.LicenseKey = ExcelIO.LicenseKey =
  "exceldemo.softorg.com,199297176362428#B025mWQyUnb8YnV5clMlVUTplXZjNmbWd6UzJXWD9URJFWWxZTUplWeX3SerUXRLJVN9djSwhmcohWVtRkMvtycxUGNaBVa6tyMF5UeNJlY7ZEd0lVWN3SeGl4LLNXSwxmVVh6ZKR6NwkGcUR5Z9VEeUd6VhpmMspVSQRXbT54Smt4NLJVMvEXaXJVTi3mZJ9mQzgkaXpVSzV7NkhnUmpXO4MkWp9kaaNWZk56an5GZjFlcaBHdzU4cqVjRGNjQEhEUXdUc0ZGbxskdQdXcspXOQRDSBF4NvIXTiZEZ7JkY9F7VsN6bp36Z8klMxETQuVXaysWMSNDbRFzUzgFWTVXdvsmUiojITJCLiUkMFNUO5QUMiojIIJCL6ITOzYjMyITO0IicfJye&Qf35VfiU5TzYjI0IyQiwiIzEjL6ByUKBCZhVmcwNlI0IiTis7W0ICZyBlIsIyMxITNwEDIyEjNwAjMwIjI0ICdyNkIsIiMxcDMwIDMyIiOiAHeFJCLi46bj9yZy3Gdm36cu2WblRGblNGelJiOiMXbEJCLig1jlzahlDZmpnInm/KnmDoim/agmH0vkDJllb0pnfbtmrIukLiOiEmTDJCLigjM4IjNzYzNxcTOykTOxIiOiQWSiwSflNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPBR4K6l6VzJjdNJWZk3maip6UMlEaFJ5VY5EMHdGTwk6ZSlTWlJWaMFzdwkETlJzcSllWS9GbQRkNadWY7cXe42GeSdTM5pmclV4L8o5QzkzzDr2";
export default {
  data() {
    return {
      PC: [],
      HH: [],
      fileList: [],
      autoGenerateColumns: true,
      width: 300,
      visible: true,
      resizable: true,
      formatter: "",
      spread: null,
      currentSheet: "HH",
      sheet: null,
      sheet_PC: null,
      sheet_HH_Map: null,
      rowCount: 0,
      colCount: 0,
      spreadNS: GC.Spread.Sheets,
      listQuery: {
        Id: "",
        SKUCode: "",
        SKUDesc: "",
        SapCode: "",
        Lang: "",
        startDate: "",
        endDate: ""
      },
      listLoading: false,
      selectedArray: null,
      selectedComboBoxArray: null,
      customerGroup: [],
      storePoolGroup: [],
      ruleSetGroup: [],
      AreaCategoryGroup: [],
      HoardingDetailGroup: [],
      PaperDetailGroup: [],
      HeadBoardGroup: [],
      SquareMetersDropGroup: [],
      customerGroupCombo: null,
      storePoolGroupCombo: null,
      ruleSetGroupCombo: null,
      AreaCategoryCombo: null,
      AreaDetailCombo: null,
      HeadBoardCombo: null,
      SquareMetersDropCombo: null,
      activityMonth: null,
      posterDate: null,
      startDate: null,
      endDate: null,
      scheduleList: null,
      scheduleGroup: []
    };
  },
  created() {
    // this.getList();
    // this.initList();
  },
  computed: {
    // dataTable() {
    // let dataTable = [];
    // for (let i = 0; i < 10; i++) {
    //   dataTable.push({
    //     id: i + 1,
    //     name: "路人" + i + 1,
    //     gender: Math.random < 0.5 ? "男" : "女",
    //     age: i + 10
    //   });
    // }
    // return dataTable;
    // }
  },
  methods: {
    // getList() {
    //   this.$axios
    //     .get(
    //       `/api/COA/GetCoaList?SkuCode=&SkuDesc=&SapCode=&BackCode=&StartDate=&EndDate=&Channel=&COALanguage=${"中文"}&page=1&limit=10&sort=-1`
    //     )
    //     .then(res => {
    //       console.log(res);
    //       this.dataTable = res.data.ReturnObject.ViewList;
    //       var sheet = this.spread.getActiveSheet();
    //       if (this.dataTable.length && this.dataTable.length > 0) {
    //         sheet.setDataSource(this.dataTable);
    //         this.initSpread(this.spread);
    //         this.hAlignCenter();
    //       }
    //     });
    // },
    initList() {
      this.PC = dataSource_PC;
      this.HH = dataSource_HH;

      this.customerGroup = [
        { text: "RTM", value: "0" },
        { text: "WTS", value: "1" },
        { text: "WALMART", value: "2" },
        { text: "永辉", value: "3" },
        { text: "carrefour", value: "4" }
      ];
      this.storePoolGroup = [
        { text: "N", value: "0" },
        { text: "Y", value: "1" }
      ];
      this.scheduleGroup = [
        {
          text: "02.14-02.16",
          value: "02.14-02.16"
        },
        {
          text: "02.21-02.23",
          value: "02.21-02.23"
        },
        {
          text: "02.28-03.01",
          value: "02.28-03.01"
        },
        {
          text: "03.06-03.08",
          value: "03.06-03.08"
        }
      ];
      this.ruleSetGroup = [
        {
          text:
            "KC组套1：酵素洗衣液 3.5KG+ 金纺亲肤 1.8L+ 内衣皂 100g =69.9 元，送奥妙480g 一袋 +金纺 420g+ 购物袋",
          value: "0"
        },
        {
          text:
            "KC组套2：酵素洗衣液 3.5KG+ 果蔬餐具净 1.1KG=59.9 元，送奥妙480g 一袋 +金纺 420g+ 购物袋",
          value: "1"
        }
      ];
      this.AreaCategoryGroup = [
        {
          text: "纸堆",
          value: "纸堆"
        },
        {
          text: "围板",
          value: "围板"
        },
        {
          text: "高低桌",
          value: "高低桌"
        },
        {
          text: "侧板",
          value: "侧板"
        }
      ];
      this.HoardingDetailGroup = [
        {
          text: "围板 0.8*0.8",
          value: "围板 0.8*0.8"
        },
        {
          text: "沃尔玛围板",
          value: "沃尔玛围板"
        },
        {
          text: "永辉围板 （1*0.8）",
          value: "永辉围板 （1*0.8）"
        }
      ];
      this.PaperDetailGroup = [
        {
          text: "纸堆 1*0.8",
          value: "纸堆 1*0.8"
        },
        {
          text: "纸堆 0.8*0.8",
          value: "纸堆 0.8*0.8"
        }
      ];
      this.HeadBoardGroup = [
        {
          text: "Y",
          value: "Y"
        },
        {
          text: "N",
          value: "N"
        }
      ];
      this.SquareMetersDropGroup = [
        {
          text: "10米",
          value: "10米"
        },
        {
          text: "无",
          value: "无"
        }
      ];
      //设置日期选择框
      // -------------------- Date Time Picker : showTime False ---------------------
      this.startDate = new GC.Spread.Sheets.Style();
      this.startDate.cellButtons = [
        {
          imageType: GC.Spread.Sheets.ButtonImageType.dropdown,
          command: "openDateTimePicker",
          useButtonStyle: false
        }
      ];
      this.startDate.dropDowns = [
        {
          type: GC.Spread.Sheets.DropDownType.dateTimePicker,
          option: {
            showTime: false
          }
        }
      ];
      this.endDate = new GC.Spread.Sheets.Style();
      this.endDate.cellButtons = [
        {
          imageType: GC.Spread.Sheets.ButtonImageType.dropdown,
          command: "openDateTimePicker",
          useButtonStyle: false
        }
      ];
      this.endDate.dropDowns = [
        {
          type: GC.Spread.Sheets.DropDownType.dateTimePicker,
          option: {
            showTime: false
          }
        }
      ];
      // -------------------- Vertical text list ---------------------
      this.scheduleList = new GC.Spread.Sheets.Style();
      this.scheduleList.cellButtons = [
        {
          imageType: GC.Spread.Sheets.ButtonImageType.dropdown,
          command: "openList",
          useButtonStyle: false
        }
      ];
      this.scheduleList.dropDowns = [
        {
          type: GC.Spread.Sheets.DropDownType.list,
          option: {
            multiSelect: true,
            items: this.scheduleGroup
          }
        }
      ];
      //设置下拉框
      this.customerGroupCombo = new GC.Spread.Sheets.CellTypes.ComboBox();
      this.storePoolGroupCombo = new GC.Spread.Sheets.CellTypes.ComboBox();
      this.ruleSetGroupCombo = new GC.Spread.Sheets.CellTypes.ComboBox();
      this.AreaCategoryCombo = new GC.Spread.Sheets.CellTypes.ComboBox();
      this.AreaDetailCombo = new GC.Spread.Sheets.CellTypes.ComboBox();
      this.HeadBoardCombo = new GC.Spread.Sheets.CellTypes.ComboBox();
      this.SquareMetersDropCombo = new GC.Spread.Sheets.CellTypes.ComboBox();
      this.customerGroupCombo.items(this.customerGroup);
      this.storePoolGroupCombo.items(this.storePoolGroup);
      this.ruleSetGroupCombo.items(this.ruleSetGroup);
      this.AreaCategoryCombo.items(this.AreaCategoryGroup);
      this.AreaDetailCombo.items(this.HoardingDetailGroup);
      this.HeadBoardCombo.items(this.HeadBoardGroup);
      this.SquareMetersDropCombo.items(this.SquareMetersDropGroup);
    },
    handleFilter() {},
    workbookInitialized(spread) {
      this.listLoading = true;
      this.spread = spread;
      let formulaBar = new GC.Spread.Sheets.FormulaTextBox.FormulaTextBox(
        this.$refs.formulaBar,
        {}
      );
      formulaBar.workbook(this.spread);
      this.spread.focus();

      // let statusBar = new GC.Spread.Sheets.StatusBar.StatusBar(
      //   this.$refs.statusBar
      // );
      // statusBar.bind(spread);

      //加载数据源
      this.initList();
      // //初始化spread
      this.initSpread(this.spread);
      // //注册事件
      this.registEvent(this.spread);
      // // 注册命令
      this.registCommand(this.spread);
      this.listLoading = false;
    },
    initSpread(spread) {
      spread.suspendPaint();
      //设置不能新增表单
      spread.options.newTabVisible = false;
      //校验失败高亮
      spread.options.highlightInvalidData = true;
      // 设置sheet
      let sheet_HH = spread.getSheet(0);
      sheet_HH.name("HH");
      let sheet_PC = new GC.Spread.Sheets.Worksheet("PC");
      let sheet1 = new GC.Spread.Sheets.Worksheet("Sheet1");
      let sheet_HH_Map = new GC.Spread.Sheets.Worksheet("HH_Map");
      spread.addSheet(1, sheet_PC);
      spread.addSheet(2, sheet_HH_Map);
      spread.addSheet(3, sheet1);
      //获取sheet
      this.sheet = spread.getSheet(0);
      this.sheet_PC = spread.getSheet(1);
      this.sheet_HH_Map = spread.getSheet(2);

      //渲染数据
      if (this.HH.length && this.HH.length > 0) {
        this.sheet.setDataSource(this.HH);
      }
      if (this.PC.length && this.PC.length > 0) {
        this.sheet_PC.setDataSource(this.PC);
      }
      //绑定列数据
      spread.suspendPaint();
      this.bindColumns();
      spread.resumePaint();
      //隐藏sheet做map
      this.sheet_HH_Map.addColumns(
        this.sheet_HH_Map.getColumnCount(GC.Spread.Sheets.SheetArea.viewport),
        10
      );

      this.sheet_HH_Map.setText(5, 20, "组套1");
      this.sheet_HH_Map.setText(5, 21, "组套1");
      this.sheet_HH_Map.setText(5, 22, "组套1");
      this.sheet_HH_Map.setText(5, 23, "组套1");

      this.sheet_HH_Map.setText(6, 20, "2020/6/23");
      this.sheet_HH_Map.setText(6, 21, "2020/6/23");

      this.sheet_HH_Map.setStyle(6, 20, this.startDate);
      this.sheet_HH_Map.setStyle(6, 21, this.endDate);

      this.sheet_HH_Map.setValue(6, 23, 2);

      //将sheet隐藏
      this.sheet_HH_Map.visible(false);

      //行数和列数
      this.rowCount = this.sheet.getRowCount();
      this.colCount = this.sheet.getColumnCount();

      // 将前18列的右键菜单屏蔽
      // this.disableContextMenu(spread);
      //右键菜单选项删除
      this.removeMenuDataItems(spread);
      //隐藏sheet名称
      //   spread.options.tabStripVisible = false;

      //设置激活单元格
      // this.sheet.setActiveCell(0, 0);
      // this.sheet_PC.setActiveCell(0, 0);
      //设置filter
      var filter = new this.spreadNS.Filter.HideRowFilter(
        new this.spreadNS.Range(0, 0, this.sheet.getRowCount(), this.sheet.getColumnCount())
      );
      var filter_PC = new this.spreadNS.Filter.HideRowFilter(
        // new this.spreadNS.Range(-1, 0, -1, this.sheet_PC.getColumnCount())
        new this.spreadNS.Range(0, 0, this.sheet_PC.getRowCount(), this.sheet_PC.getColumnCount())
      );
      this.sheet.rowFilter(filter);
      this.sheet_PC.rowFilter(filter_PC);
      //设置列宽
      // this.initColumnWidth(this.sheet, this.sheet_PC);

      //设置下拉框和日期选择框,列表
      // this.setComboBox(spread);
      this.setListStyle(spread);
      this.setDateStyle(spread);
      //设置多级表头并上色
      this.setMultiColHeader(spread);

      //设置列头高
      var colHeader = GC.Spread.Sheets.SheetArea.colHeader;
      this.sheet.setRowHeight(0, 50, colHeader);
      this.sheet.setRowHeight(1, 30, colHeader);
      this.sheet_PC.setRowHeight(0, 50, colHeader);
      this.sheet_PC.setRowHeight(1, 30, colHeader);
      //设置居中显示
      this.hAlignCenter();
      this.vAlignCenter();

      spread.resumePaint();
    },
    registEvent(spread) {
      let self = this;
      let sheet = spread.getSheet(0);
      let sheet_PC = spread.getSheet(1);
      sheet.bind(GC.Spread.Sheets.Events.ValueChanged, (s, args) => {
        console.log(args, "--valueChanged");
        let row = args.row;
        let col = args.col;
        let cellType = sheet.getCellType(row, col);
        if (cellType instanceof GC.Spread.Sheets.CellTypes.ComboBox) {
          if (col === 24) {
            var value = sheet.getValue(row, col);
            if (value === "纸堆") {
              let combo1 = new GC.Spread.Sheets.CellTypes.ComboBox();
              combo1.items(this.PaperDetailGroup);
              sheet.suspendPaint();
              sheet.setCellType(
                row,
                col + 1,
                combo1,
                GC.Spread.Sheets.SheetArea.viewport
              );
              sheet.setValue(row, col + 1, "");
              sheet.resumePaint();
            }
            if (value === "围板") {
              let combo2 = new GC.Spread.Sheets.CellTypes.ComboBox();
              combo2.items(this.HoardingDetailGroup);
              sheet.suspendPaint();
              sheet.setCellType(
                row,
                col + 1,
                combo2,
                GC.Spread.Sheets.SheetArea.viewport
              );

              sheet.setValue(row, col + 1, "");
              sheet.resumePaint();
            }
          }
        }
        sheet.repaint();
        let style = sheet.getActualStyle(row, col);
        if (
          style &&
          style.dropDowns &&
          style.dropDowns[0] &&
          (style.dropDowns[0].type ==
            GC.Spread.Sheets.DropDownType.dateTimePicker ||
            style.dropDowns[0].type ==
              GC.Spread.Sheets.DropDownType.monthPicker)
        ) {
          sheet.setFormatter(row, col, "yyyy/mm/dd");
        }
      });
      sheet_PC.bind(GC.Spread.Sheets.Events.ValueChanged, (s, args) => {
        console.log(args, "--valueChanged");
        let row = args.row;
        let col = args.col;
        let cellType = sheet_PC.getCellType(row, col);
        if (cellType instanceof GC.Spread.Sheets.CellTypes.ComboBox) {
          if (col === 40) {
            var value = sheet_PC.getValue(row, col);
            if (value === "纸堆") {
              sheet_PC.suspendPaint();
              this.AreaDetailCombo.items(this.PaperDetailGroup);
              sheet_PC.setValue(row, col + 1, "");
              sheet_PC.resumePaint();
            }
            if (value === "围板") {
              sheet_PC.suspendPaint();
              this.AreaDetailCombo.items(this.HoardingDetailGroup);
              sheet_PC.setValue(row, col + 1, "");
              sheet_PC.resumePaint();
            }
          }
        }
        sheet.repaint();
      });
      //复制粘贴的时候的确会触发rangeChanged事件
      spread.bind(GC.Spread.Sheets.Events.RangeChanged, (s, e) => {
        console.log(e, "--rangeChanged");
        //遍历每一个cell
        // e.changedCells.forEach(item => {
        //   if (item.col === 2) {
        //     //客户组
        //     let cellValue = sheet.getValue(item.row, item.col);
        //     console.log(cellValue);
        //     let existFlag = this.customerGroup.some(item => {
        //       return item.text == cellValue;
        //     });
        //     if (!existFlag) {
        //       console.log("不存在");
        //       // sheet.setValue(item.row,item.col,"")
        //       sheet
        //         .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
        //         .cellType(this.customerGroupCombo)
        //         .value("");
        //     } else {
        //       console.log("存在");
        //       sheet
        //         .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
        //         .cellType(this.customerGroupCombo)
        //         .value(cellValue);
        //     }
        //   }
        //   if (item.col === 4) {
        //     let cellValue = sheet.getValue(item.row, item.col);
        //     console.log(cellValue);
        //     // let reg = /\\\\d{4}(\-|\/|.)\\\\d{1,2}\1\\\\d{1,2}/
        //     // let reg = /\\\\d{4}\\\\d{1,2}\1\\\\d{1,2}/
        //     let reg = /^\d{4}\d{2}$/;
        //     let validFlag = reg.test(cellValue);
        //     if (!validFlag) {
        //       console.log("格式不正确");
        //       sheet.setStyle(item.row, item.col, this.activityMonth);
        //       sheet.setValue(item.row, item.col, "");
        //     } else {
        //       console.log("格式正确");
        //       sheet.setStyle(item.row, item.col, this.activityMonth);
        //       sheet.setValue(item.row, item.col, cellValue);
        //     }
        //   }
        //   if (item.col === 5) {
        //     let cellValue = sheet.getValue(item.row, item.col);
        //     console.log(cellValue);
        //     // let reg = /\\\\d{4}(\-|\/|.)\\\\d{1,2}\1\\\\d{1,2}/
        //     // let reg = /\\\\d{4}\\\\d{1,2}\1\\\\d{1,2}/
        //     let reg = /^\d{4}\d{2}\d{2}$/;
        //     let validFlag = reg.test(cellValue);
        //     if (!validFlag) {
        //       console.log("格式不正确");
        //       sheet.setStyle(item.row, item.col, this.posterDate);
        //       sheet.setValue(item.row, item.col, "");
        //     } else {
        //       console.log("格式正确");
        //       sheet.setStyle(item.row, item.col, this.posterDate);
        //       sheet.setValue(item.row, item.col, cellValue);
        //     }
        //   }
        //   if (item.col === 6) {
        //     let cellValue = sheet.getValue(item.row, item.col);
        //     console.log(cellValue);
        //     // let reg = /\\\\d{4}(\-|\/|.)\\\\d{1,2}\1\\\\d{1,2}/
        //     // let reg = /\\\\d{4}\\\\d{1,2}\1\\\\d{1,2}/
        //     let reg = /^\d{4}\d{2}\d{2}$/;
        //     let validFlag = reg.test(cellValue);
        //     if (!validFlag) {
        //       console.log("格式不正确");
        //       sheet.setStyle(item.row, item.col, this.posterDate);
        //       sheet.setValue(item.row, item.col, "");
        //     } else {
        //       console.log("格式正确");
        //       sheet.setStyle(item.row, item.col, this.posterDate);
        //       sheet.setValue(item.row, item.col, cellValue);
        //     }
        //   }
        // });
        //行高
        this.vAlignCenter();
        this.hAlignCenter();
      });

      spread.bind(GC.Spread.Sheets.Events.SelectionChanged, (s, e) => {
        // console.log(e, "--selectionChanged");
      });
      spread.bind(GC.Spread.Sheets.Events.CellClick, function(sender, args) {
        if (args.sheetArea === GC.Spread.Sheets.SheetArea.colHeader) {
          console.log("The column header was clicked.");
          //   spread.options.allowContextMenu = false;
        }
      });
      spread.bind(GC.Spread.Sheets.Events.EditStarting, function(sender, args) {
        var style = args.sheet.getActualStyle(args.row, args.col);
        console.log(args, "--editStarting-args");
        if (
          style &&
          style.dropDowns &&
          style.dropDowns[0] &&
          (style.dropDowns[0].type ==
            GC.Spread.Sheets.DropDownType.dateTimePicker ||
            style.dropDowns[0].type ==
              GC.Spread.Sheets.DropDownType.monthPicker ||
            style.dropDowns[0].type == GC.Spread.Sheets.DropDownType.list)
        ) {
          args.cancel = true;
        }
        if (args.sheetName === "HH" && args.col <= 17) {
          args.cancel = true;
          spread.options.allowUserEditFormula = false;
        }
        if (args.sheetName === "PC" && args.col <= 29) {
          args.cancel = true;
        }
      });
      // sheet.bind(GC.Spread.Sheets.Events.EditEnded, function(sender, args) {
      //   console.log( args,"EditEnding event.");
      //   if (args.sheetName === "HH" && args.col <= 17) {
      //     args.cancel = true;
      //     args.editingText = "123456"
      //   }
      //   if (args.sheetName === "PC" && args.col <= 29) {
      //     args.cancel = true;
      //   }
      // });
      // sheet.bind(GC.Spread.Sheets.Events.EditChange, function(sender, args) {
      //   console.log(
      //     args,
      //     "Cell (" + args.row + ", " + args.col + ") data has been changed."
      //   );
      // });
      // spread.bind(GC.Spread.Sheets.Events.EditChange, function(sender, args) {
      //   var cellType = args.sheet.getCellType(args.row, args.col);
      //   console.log(cellType, "--editChanged");
      //   if (
      //     args.editingText &&
      //     isNaN(args.editingText) &&
      //     cellType.getEditingElement() &&
      //     cellType.getEditingElement().type === "textarea"
      //   ) {
      //     var value = cellType.getEditingElement().value;

      //     cellType.getEditingElement().value = value.slice(0, value.length - 1);
      //   }
      // });
      spread.bind(GC.Spread.Sheets.Events.ClipboardPasting, function(
        sender,
        args
      ) {
        console.log("ClipboardPasting", args);
        if (args.sheetName === "HH") {
          if (args.cellRange.col <= 17) {
            args.cancel = true;
          }
        } else if (args.sheetName === "PC") {
          if (args.cellRange.col <= 29) {
            args.cancel = true;
          }
        }
      });

      // Bind SheetChanged event
      spread.bind(GC.Spread.Sheets.Events.SheetChanged, function(sender, args) {
        console.log(args);
        self.currentSheet = args.sheetName;
        self.disableContextMenu(spread);
        self.removeMenuDataItems(spread);
        self.registCommand(spread);
      });
    },
    registCommand(spread) {
      let self = this;
      // 获取右键菜单数组
      var menuData = spread.contextMenu.menuData;

      console.log(menuData);
      //向上插入一行
      spread.commandManager().register("insertRowsBefore", {
        canUndo: true,
        execute: function(context, options, isUndo) {
          let Commands = GC.Spread.Sheets.Commands;
          // 在此加cmd
          options.cmd = "insertRowsBefore";
          if (isUndo) {
            Commands.undoTransaction(context, options);
            return true;
          } else {
            Commands.startTransaction(context, options);
            let sheet = spread.getActiveSheet();
            let sels = sheet.getSelections();
            // console.log(sels, "--sels");
            if (sels && sels.length > 0) {
              for (let i = 0; i < sels.length; i++) {
                let sel = sels[i];
                let row = sel.row;
                let col = sel.col;
                let rowCount = sel.rowCount;
                let colCount = sel.colCount;
                sheet.addRows(row, rowCount);
                //下拉框
                // sheet.setCellType(
                //   row,
                //   2,
                //   self.customerGroupCombo,
                //   GC.Spread.Sheets.SheetArea.viewport
                // );
                //日期选择器
                // sheet.setStyle(row, 4, self.activityMonth);
                // sheet.setStyle(row, 5, self.posterDate);
                // sheet.setStyle(row, 6, self.posterDate);
                //行高
                self.vAlignCenter();
                self.hAlignCenter();
              }
            }
            Commands.endTransaction(context, options);
            return true;
          }
        }
      });
      //向下插入一行
      spread.commandManager().register("insertRowsBehind", {
        canUndo: true,
        execute: function(context, options, isUndo) {
          let Commands = GC.Spread.Sheets.Commands;
          // 在此加cmd
          options.cmd = "insertRowsBehind";
          if (isUndo) {
            Commands.undoTransaction(context, options);
            return true;
          } else {
            Commands.startTransaction(context, options);
            let sheet = spread.getActiveSheet();
            let sels = sheet.getSelections();
            // console.log(sels, "--sels");
            if (sels && sels.length > 0) {
              for (let i = 0; i < sels.length; i++) {
                let sel = sels[i];
                let row = sel.row;
                let col = sel.col;
                let rowCount = sel.rowCount;
                let colCount = sel.colCount;
                sheet.addRows(row + 1, rowCount);
                //下拉框
                // sheet.setCellType(
                //   row + 1,
                //   2,
                //   self.customerGroupCombo,
                //   GC.Spread.Sheets.SheetArea.viewport
                // );
                //日期选择器
                // sheet.setStyle(row + 1, 4, self.activityMonth);
                // sheet.setStyle(row + 1, 5, self.posterDate);
                // sheet.setStyle(row + 1, 6, self.posterDate);
                //行高
                self.vAlignCenter();
                self.hAlignCenter();
              }
            }
            Commands.endTransaction(context, options);
            return true;
          }
        }
      });
      // 定义一个在行头区域执行的右键菜单项
      let insertRowsBefore = {
        command: "insertRowsBefore",
        text: "向上插入行",
        // name只要不重复即可
        name: "insertRowsBefore",
        // 把自己定义好的icon class加在这里
        iconClass: "gc-spread-custom-icon",
        workArea: "rowHeader"
      };
      // 定义一个在行头区域执行的右键菜单项
      let insertRowsBehind = {
        command: "insertRowsBehind",
        text: "向下插入行",
        // name只要不重复即可
        name: "insertRowsBehind",
        // 把自己定义好的icon class加在这里
        iconClass: "gc-spread-custom-icon",
        workArea: "rowHeader"
      };

      // 将自定义的项，加入到“插入行”（insertRows）之后
      menuData.forEach(function(item, index) {
        if (item && item.name === "gc.spread.pasteOptions") {
          // menuData.splice(index + 1, 0, { type: "separator"});
          menuData.splice(index + 2, 0, insertRowsBefore);
          menuData.splice(index + 3, 0, insertRowsBehind);
        }
      });
    },

    handleRemove() {},
    handleExceed() {},
    importExcel(event) {
      const file = event.target.files[0];
      let self = this;
      let excelIO = new ExcelIO.IO();
      excelIO.open(file, spreadJSON => {
        if (self.spread) {
          self.spread.fromJSON(spreadJSON);
        }
      });

      this.lockSpread(this.spread);
    },
    importSSExcel(file, fileList) {},
    exportExcel() {
      var serializationOption = {
        ignoreFormula: false,
        ignoreStyle: false,
        rowHeadersAsFrozenColumns: false,
        columnHeadersAsFrozenRows: true,
        includeBindingSource: true
      };
      if (this.spread) {
        var jsonStr = JSON.stringify(this.spread.toJSON(serializationOption));
        console.log(jsonStr);
        let excelIO = new ExcelIO.IO();
        excelIO.save(jsonStr, blob => {
          FileSaver.saveAs(blob, "export.xlsx");
        });
      }
    },
    fromJSON() {
      var jsonOptions = {
        ignoreFormula: false,
        ignoreStyle: false,
        frozenColumnsAsRowHeaders: false,
        frozenRowsAsColumnHeaders: false,
        doNotRecalculateAfterLoad: true
      };
      let jsonStr = ssJSON;
      if (this.spread) {
        this.spread.fromJSON(jsonStr, jsonOptions);
      }
    },
    lockSpread(spread) {
      if (spread) {
        console.log("lock");
        spread.options.newTabVisible = false;
        spread.options.allowContextMenu = false;
        let sheet = spread.getActiveSheet();
        sheet.options.isProtected = true;
      }
    },
    unlockSpread(spread) {
      if (spread) {
        console.log("unlock");
        spread.options.newTabVisible = true;
        spread.options.allowContextMenu = true;
        let sheet = spread.getActiveSheet();
        sheet.options.isProtected = false;
      }
    },
    download() {},
    upload() {
      var serializationOption = {
        ignoreFormula: true,
        ignoreStyle: true,
        includeBindingSource: true
      };
      if (this.spread) {
        var jsonStr = JSON.stringify(this.spread.toJSON(serializationOption));
        console.log(jsonStr);
      }

      //发送ajax请求将json数据传给服务器
    },
    hAlignCenter() {
      if (this.spread) {
        let sheet = this.spread.getSheet(0);
        let sheet_PC = this.spread.getSheet(1);
        let range = sheet.getSelections()[0];
        let range_PC = sheet_PC.getSelections()[0];

        // sheet.suspendPaint();
        // sheet_PC.suspendPaint();
        sheet
          .getRange(
            range.row,
            range.col,
            sheet.getRowCount(),
            sheet.getColumnCount()
          )
          .hAlign(GC.Spread.Sheets.HorizontalAlign.center);
        sheet_PC
          .getRange(
            range_PC.row,
            range_PC.col,
            sheet_PC.getRowCount(),
            sheet_PC.getColumnCount()
          )
          .hAlign(GC.Spread.Sheets.HorizontalAlign.center);
        // sheet.resumePaint();
        // sheet_PC.resumePaint();
      }
    },
    vAlignCenter() {
      if (this.spread) {
        let sheet = this.spread.getSheet(0);
        let sheet_PC = this.spread.getSheet(1);
        let range = sheet.getSelections()[0];
        let range_PC = sheet_PC.getSelections()[0];
        // let range = sheet.getRowCount;
        // let range = sheet.getColCount;
        let rowCount = sheet.getRowCount();
        let colCount = sheet.getColumnCount();
        let rowCount_PC = sheet_PC.getRowCount();
        let colCount_PC = sheet_PC.getColumnCount();
        // sheet.suspendPaint();
        // sheet_PC.suspendPaint();
        for (let row = 0; row < rowCount; row++) {
          // sheet.setRowHeight(row, 36);
          for (let col = 0; col < colCount; col++) {
            sheet
              .getCell(row, col)
              .cellPadding("0 0 0 0")
              .vAlign(GC.Spread.Sheets.VerticalAlign.center);
          }
        }
         for (let row = 0; row < rowCount_PC; row++) {
          // sheet_PC.setRowHeight(row, 36);
          for (let col = 0; col < colCount_PC; col++) {
            sheet_PC
              .getCell(row, col)
              .cellPadding("0 0 0 0")
              .vAlign(GC.Spread.Sheets.VerticalAlign.center);
          }
        }
        // sheet.resumePaint();
        // sheet_PC.resumePaint();
      }
    },
    initColumnWidth(sheet, sheet_PC) {
      //   sheet.suspendPaint();
      //   sheet_PC.suspendPaint();
      sheet.setColumnWidth(0, 100);
      sheet.setColumnWidth(1, 100);
      sheet.setColumnWidth(2, 500);
      sheet.setColumnWidth(3, 100);
      sheet.setColumnWidth(4, 100);
      sheet.setColumnWidth(5, 120);
      sheet.setColumnWidth(6, 120);
      sheet.setColumnWidth(7, 100);
      sheet.setColumnWidth(8, 100);
      sheet.setColumnWidth(9, 100);
      sheet.setColumnWidth(10, 120);
      sheet.setColumnWidth(11, 120);
      sheet.setColumnWidth(12, 200);
      sheet.setColumnWidth(13, 120);
      sheet.setColumnWidth(14, 300);
      sheet.setColumnWidth(15, 120);
      sheet.setColumnWidth(16, 120);
      sheet.setColumnWidth(17, 300);
      sheet.setColumnWidth(18, 120);
      sheet.setColumnWidth(19, 120);
      sheet.setColumnWidth(20, 200);
      sheet.setColumnWidth(21, 200); //Store Pool
      sheet.setColumnWidth(22, 200);
      sheet.setColumnWidth(23, 200);
      sheet.setColumnWidth(24, 120);
      sheet.setColumnWidth(25, 120);
      sheet.setColumnWidth(26, 120);
      sheet.setColumnWidth(27, 120);
      sheet.setColumnWidth(28, 120);
      sheet.setColumnWidth(29, 120);
      sheet.setColumnWidth(30, 120);
      sheet.setColumnWidth(31, 120);
      sheet.setColumnWidth(32, 120);
      sheet.setColumnWidth(33, 120);
      sheet.setColumnWidth(34, 120);
      sheet.setColumnWidth(35, 120);
      sheet.setColumnWidth(36, 120);
      sheet.setColumnWidth(37, 120);
      sheet.setColumnWidth(38, 120);
      sheet.setColumnWidth(39, 120);
      sheet.setColumnWidth(40, 120);
      sheet_PC.setColumnWidth(0, 100);
      sheet_PC.setColumnWidth(1, 100);
      sheet_PC.setColumnWidth(2, 500);
      sheet_PC.setColumnWidth(3, 100);
      sheet_PC.setColumnWidth(4, 100);
      sheet_PC.setColumnWidth(5, 120);
      sheet_PC.setColumnWidth(6, 120);
      sheet_PC.setColumnWidth(7, 100);
      sheet_PC.setColumnWidth(8, 100);
      sheet_PC.setColumnWidth(9, 100);
      sheet_PC.setColumnWidth(10, 120);
      sheet_PC.setColumnWidth(11, 120);
      sheet_PC.setColumnWidth(12, 200);
      sheet_PC.setColumnWidth(13, 120);
      sheet_PC.setColumnWidth(14, 300);
      sheet_PC.setColumnWidth(15, 120);
      sheet_PC.setColumnWidth(16, 120);
      sheet_PC.setColumnWidth(17, 120);
      sheet_PC.setColumnWidth(18, 120);
      sheet_PC.setColumnWidth(19, 120);
      sheet_PC.setColumnWidth(20, 500);
      sheet_PC.setColumnWidth(21, 120); //Store Pool
      sheet_PC.setColumnWidth(22, 120);
      sheet_PC.setColumnWidth(23, 120);
      sheet_PC.setColumnWidth(24, 120);
      sheet_PC.setColumnWidth(25, 120);
      sheet_PC.setColumnWidth(26, 120);
      sheet_PC.setColumnWidth(27, 120);
      sheet_PC.setColumnWidth(28, 120);
      sheet_PC.setColumnWidth(29, 120);
      sheet_PC.setColumnWidth(30, 120);
      sheet_PC.setColumnWidth(31, 120);
      sheet_PC.setColumnWidth(32, 120);
      sheet_PC.setColumnWidth(33, 120);
      sheet_PC.setColumnWidth(34, 120);
      sheet_PC.setColumnWidth(35, 120);
      sheet_PC.setColumnWidth(36, 120);
      sheet_PC.setColumnWidth(37, 120);
      sheet_PC.setColumnWidth(38, 120);
      sheet_PC.setColumnWidth(39, 120);
      sheet_PC.setColumnWidth(40, 120);
      //   sheet.resumePaint();
      //   sheet_PC.resumePaint();
    },
    disableContextMenu(spread) {
      console.log(this.currentSheet);
      function ContextMenu() {}
      if (this.currentSheet === "HH") {
        ContextMenu.prototype = new GC.Spread.Sheets.ContextMenu.ContextMenu(
          spread
        );
        ContextMenu.prototype.onOpenMenu = (
          menuData,
          itemsDataForShown,
          hitInfo,
          spread
        ) => {
          // console.log(menuData, itemsDataForShown, hitInfo, spread);
          if (hitInfo.worksheetHitInfo) {
            var col = hitInfo.worksheetHitInfo.col;
            var hitType = hitInfo.worksheetHitInfo.hitTestType;
            if (col <= 17) {
              // console.log(itemsDataForShown);
              itemsDataForShown.forEach((item, index) => {
                if (item.name === "gc.spread.clearContents") {
                  itemsDataForShown.splice(index, 2);
                }
              });
              itemsDataForShown.forEach((item, index) => {
                if (item.name === "gc.spread.insertColumns") {
                  itemsDataForShown.splice(index, 1);
                }
              });
              itemsDataForShown.forEach((item, index) => {
                if (item.name === "gc.spread.deleteColumns") {
                  itemsDataForShown.splice(index, 2);
                }
              });
              // itemsDataForShown.splice(0, 20);
              // var insertIndex = -1;
              // var deleteIndex = -1;
              //   for (let i = 0; i < itemsDataForShown.length; i++) {
              //     var item = itemsDataForShown[i];
              //     if (item.name === "gc.spread.insertRows") {
              //       insertIndex = i;
              //     } else if (item.name === "gc.spread.deleteRows") {
              //       deleteIndex = i;
              //     }
              //   }
              //   if (insertIndex > -1) {
              //     itemsDataForShown.splice(insertIndex, 1);
              //   }
              //   if (deleteIndex > -1 && insertIndex > -1) {
              //     itemsDataForShown.splice(deleteIndex - 1, 1);
              //     itemsDataForShown.splice(deleteIndex - 2, 1);
              //   }
            }
          }
        };
        spread.contextMenu = new ContextMenu();
      } else if (this.currentSheet === "PC") {
        ContextMenu.prototype = new GC.Spread.Sheets.ContextMenu.ContextMenu(
          spread
        );
        ContextMenu.prototype.onOpenMenu = (
          menuData,
          itemsDataForShown,
          hitInfo,
          spread
        ) => {
          // console.log(menuData, itemsDataForShown, hitInfo, spread);
          if (hitInfo.worksheetHitInfo) {
            var col = hitInfo.worksheetHitInfo.col;
            var hitType = hitInfo.worksheetHitInfo.hitTestType;
            if (col <= 29) {
              // itemsDataForShown.splice(0, 20);
              itemsDataForShown.forEach((item, index) => {
                if (item.name === "gc.spread.clearContents") {
                  itemsDataForShown.splice(index, 2);
                }
              });
              itemsDataForShown.forEach((item, index) => {
                if (item.name === "gc.spread.insertColumns") {
                  itemsDataForShown.splice(index, 1);
                }
              });
              itemsDataForShown.forEach((item, index) => {
                if (item.name === "gc.spread.deleteColumns") {
                  itemsDataForShown.splice(index, 2);
                }
              });
              // var insertIndex = -1;
              // var deleteIndex = -1;
              //   for (let i = 0; i < itemsDataForShown.length; i++) {
              //     var item = itemsDataForShown[i];
              //     if (item.name === "gc.spread.insertRows") {
              //       insertIndex = i;
              //     } else if (item.name === "gc.spread.deleteRows") {
              //       deleteIndex = i;
              //     }
              //   }
              //   if (insertIndex > -1) {
              //     itemsDataForShown.splice(insertIndex, 1);
              //   }
              //   if (deleteIndex > -1 && insertIndex > -1) {
              //     itemsDataForShown.splice(deleteIndex - 1, 1);
              // itemsDataForShown.splice(deleteIndex, 1);
              //   }
            }
          }
        };
        spread.contextMenu = new ContextMenu();
      }
    },
    setMultiColHeader(spread) {
      let sheet = spread.getSheet(0);
      let sheet_PC = spread.getSheet(1);
      let rowCount = sheet.getRowCount();
      let colCount = sheet.getColumnCount();
      let rowCount_PC = sheet_PC.getRowCount();
      let colCount_PC = sheet_PC.getColumnCount();
      //   sheet.suspendPaint();
      //   sheet_PC.suspendPaint();
      sheet.setRowCount(2, GC.Spread.Sheets.SheetArea.colHeader);
      sheet.setColumnCount(1, GC.Spread.Sheets.SheetArea.rowHeader);
      sheet.addSpan(0, 0, 1, 7, GC.Spread.Sheets.SheetArea.colHeader);
      sheet.setValue(0, 0, "门店信息", GC.Spread.Sheets.SheetArea.colHeader);
      sheet.addSpan(0, 10, 1, 4, GC.Spread.Sheets.SheetArea.colHeader);
      sheet.setValue(0, 10, "WSP信息", GC.Spread.Sheets.SheetArea.colHeader);
      sheet.addSpan(0, 14, 1, 3, GC.Spread.Sheets.SheetArea.colHeader);
      sheet.setValue(0, 14, "TCP", GC.Spread.Sheets.SheetArea.colHeader);
      sheet.addSpan(0, 18, 1, 2, GC.Spread.Sheets.SheetArea.colHeader);
      sheet.setValue(
        0,
        18,
        "2020 3月奥妙金纺钻石 AG",
        GC.Spread.Sheets.SheetArea.colHeader
      );
      sheet.addSpan(0, 20, 1, 4, GC.Spread.Sheets.SheetArea.colHeader);
      sheet.setValue(0, 20, "组套1", GC.Spread.Sheets.SheetArea.colHeader);
      sheet.addSpan(0, 24, 1, 3, GC.Spread.Sheets.SheetArea.colHeader);
      sheet.setValue(0, 24, "POSM信息", GC.Spread.Sheets.SheetArea.colHeader);
      sheet.addSpan(0, 27, 1, 3, GC.Spread.Sheets.SheetArea.colHeader);
      sheet.setValue(0, 27, "WSP信息", GC.Spread.Sheets.SheetArea.colHeader);
      sheet.addSpan(0, 30, 1, 3, GC.Spread.Sheets.SheetArea.colHeader);
      sheet.setValue(0, 30, "AG大陆演", GC.Spread.Sheets.SheetArea.colHeader);
      sheet.getRange(0, 0, 11, 7).backColor("#CCFFCC");
      sheet.getRange(0, 10, 11, 4).backColor("#ffd591");
      sheet.getRange(0, 14, 11, 3).backColor("#ffc53d");
      sheet.getRange(0, 18, 11, 2).backColor("#bae637");
      sheet.getRange(0, 20, 11, 4).backColor("#efdbff"); //
      sheet.getRange(0, 24, 11, 3).backColor("#36cfc9");
      sheet.getRange(0, 27, 11, 3).backColor("#69c0ff");
      sheet.getRange(0, 30, 11, 3).backColor("#ffe7ba");

      sheet
        .getRange(0, 0, rowCount, colCount)
        .setBorder(
          new GC.Spread.Sheets.LineBorder(
            "gray",
            GC.Spread.Sheets.LineStyle.thin
          ),
          { all: true }
        );

      sheet_PC.setRowCount(2, GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.setColumnCount(1, GC.Spread.Sheets.SheetArea.rowHeader);
      sheet_PC.addSpan(0, 0, 1, 7, GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.setValue(0, 0, "门店信息", GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.addSpan(0, 7, 1, 4, GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.setValue(
        0,
        7,
        "201902 SSD Ave (kRMB)",
        GC.Spread.Sheets.SheetArea.colHeader
      );
      sheet_PC.addSpan(0, 11, 1, 4, GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.setValue(
        0,
        11,
        "201903 SSD Ave (kRMB)",
        GC.Spread.Sheets.SheetArea.colHeader
      );
      sheet_PC.addSpan(0, 15, 1, 4, GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.setValue(
        0,
        15,
        "2019 SSD Ave (kRMB)",
        GC.Spread.Sheets.SheetArea.colHeader
      );
      sheet_PC.addSpan(0, 19, 1, 4, GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.setValue(0, 19, "WSP信息", GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.addSpan(0, 23, 1, 6, GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.setValue(0, 23, "TCP", GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.addSpan(0, 29, 1, 1, GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.setValue(
        0,
        29,
        "历史POSM数据",
        GC.Spread.Sheets.SheetArea.colHeader
      );
      sheet_PC.addSpan(0, 30, 1, 2, GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.setValue(
        0,
        30,
        "2020 BPC 三八女神节 AG-Test",
        GC.Spread.Sheets.SheetArea.colHeader
      );
      sheet_PC.addSpan(0, 32, 1, 4, GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.setValue(0, 32, "组套1", GC.Spread.Sheets.SheetArea.colHeader);

      sheet_PC.addSpan(0, 36, 1, 4, GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.setValue(0, 36, "组套2", GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.addSpan(0, 40, 1, 3, GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.setValue(
        0,
        40,
        "POSM信息",
        GC.Spread.Sheets.SheetArea.colHeader
      );
      sheet_PC.addSpan(0, 43, 1, 2, GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.setValue(0, 43, "WSP信息", GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.addSpan(0, 45, 1, 3, GC.Spread.Sheets.SheetArea.colHeader);
      sheet_PC.setValue(
        0,
        45,
        "AG大陆演",
        GC.Spread.Sheets.SheetArea.colHeader
      );
      sheet_PC.getRange(0, 0, 11, 7).backColor("#CCFFCC");
      sheet_PC.getRange(0, 7, 11, 4).backColor("#ffd591");
      sheet_PC.getRange(0, 11, 11, 4).backColor("#ffc53d");
      sheet_PC.getRange(0, 15, 11, 4).backColor("#bae637");
      sheet_PC.getRange(0, 19, 11, 4).backColor("#95de64"); //
      sheet_PC.getRange(0, 23, 11, 6).backColor("#36cfc9");
      sheet_PC.getRange(0, 30, 11, 2).backColor("#69c0ff");
      sheet_PC.getRange(0, 32, 11, 4).backColor("#ffe7ba");
      sheet_PC.getRange(0, 36, 11, 4).backColor("#fff1b8");
      sheet_PC.getRange(0, 40, 11, 3).backColor("#91d5ff");
      sheet_PC.getRange(0, 43, 11, 2).backColor("#ffd591");
      sheet_PC.getRange(0, 45, 11, 3).backColor("#36cfc9");

      sheet_PC
        .getRange(0, 0, rowCount_PC, colCount_PC)
        .setBorder(
          new GC.Spread.Sheets.LineBorder(
            "gray",
            GC.Spread.Sheets.LineStyle.thin
          ),
          { all: true }
        );
      //   sheet.resumePaint();
      //   sheet_PC.resumePaint();
    },
    removeMenuDataItems(spread) {
      var menuData = spread.contextMenu.menuData;
      var newMenuData = [];
      // (item && item.name === "gc.spread.insertColumns") ||
      // (item && item.name === "gc.spread.deleteColumns") ||
      menuData.forEach(item => {
        if (
          (item && item.name === "gc.spread.insertRows") ||
          (item && item.name === "gc.spread.insertSheet") ||
          (item && item.name === "gc.spread.deleteSheet") ||
          (item && item.name === "gc.spread.hideSheet") ||
          (item && item.name === "gc.spread.unhideSheet")
        ) {
          return;
        }
        newMenuData.push(item);
      });
      console.log(newMenuData);
      spread.contextMenu.menuData = newMenuData;
    },
    setComboBox(spread) {
      let sheet = spread.getSheet(0);
      let sheet_PC = spread.getSheet(1);
      let rowCount = sheet.getRowCount();
      let colCount = sheet.getColumnCount();
      let rowCount_PC = sheet_PC.getRowCount();
      let colCount_PC = sheet_PC.getColumnCount();
      //   sheet.suspendPaint();
      //   sheet_PC.suspendPaint();

      //   sheet.setCellType(
      //     -1,
      //     18,
      //     this.storePoolGroupCombo,
      //     GC.Spread.Sheets.SheetArea.viewport
      //   );

      // sheet_PC.setCellType(
      //   -1,
      //   21,
      //   this.storePoolGroupCombo,
      //   GC.Spread.Sheets.SheetArea.viewport
      // );
      //   sheet.resumePaint();
      //   sheet_PC.resumePaint();
    },
    setDateStyle(spread) {
      let sheet = spread.getSheet(0);
      let sheet_PC = spread.getSheet(1);
      let rowCount = sheet.getRowCount();
      let colCount = sheet.getColumnCount();
      let rowCount_PC = sheet_PC.getRowCount();
      let colCount_PC = sheet_PC.getColumnCount();
      //   sheet.suspendPaint();
      //   sheet_PC.suspendPaint();
      let cellValue = this.sheet_HH_Map.getValue(5, 20);
      if (cellValue === "组套1") {
        let style = this.sheet_HH_Map.getActualStyle(6, 20);
        console.log(style, "--Map_style");
        if (
          style &&
          style.dropDowns &&
          style.dropDowns[0] &&
          (style.dropDowns[0].type ==
            GC.Spread.Sheets.DropDownType.dateTimePicker ||
            style.dropDowns[0].type ==
              GC.Spread.Sheets.DropDownType.monthPicker)
        ) {
          for (let i = 0; i < this.sheet.getRowCount(); i++) {
            this.sheet.setStyle(i, 20, this.startDate);
            this.sheet.setStyle(i, 21, this.endDate);
          }
        }

        let cellValue = this.sheet_HH_Map.getValue(6, 23);
        if (/^[0-9]*$/.test(cellValue)) {
          for (let i = 0; i < this.sheet.getRowCount(); i++) {
            var dv = new GC.Spread.Sheets.DataValidation.createNumberValidator(
              GC.Spread.Sheets.ConditionalFormatting.ComparisonOperators.between,
              "0",
              "99999999",
              true
            );
            // dv.showInputMessage = true;
            // dv.inputMessage = "Value must be number.";
            // dv.inputTitle = "tip";
            dv.showInputMessage(true);
            dv.inputMessage("Value must be number between.");
            dv.inputTitle("tip");
            this.sheet.setDataValidator(i, 23, dv);
          }
        }
      }

      sheet_PC.setStyle(-1, 32, this.startDate);
      sheet_PC.setStyle(-1, 33, this.endDate);
      sheet_PC.setStyle(-1, 36, this.startDate);
      sheet_PC.setStyle(-1, 37, this.endDate);

      //   sheet.resumePaint();
      //   sheet_PC.resumePaint();
    },
    setListStyle(spread) {
      let sheet = spread.getSheet(0);
      let sheet_PC = spread.getSheet(1);
      let rowCount = sheet.getRowCount();
      let colCount = sheet.getColumnCount();
      let rowCount_PC = sheet_PC.getRowCount();
      let colCount_PC = sheet_PC.getColumnCount();
      //   sheet.suspendPaint();
      //   sheet_PC.suspendPaint();
      //   for (let i = 0; i < rowCount; i++) {
      sheet.setStyle(-1, 27, this.scheduleList);
      sheet.setStyle(-1, 28, this.scheduleList);
      sheet.setStyle(-1, 29, this.scheduleList);
      //   }
      sheet_PC.setStyle(-1, 43, this.scheduleList);
      sheet_PC.setStyle(-1, 44, this.scheduleList);
      //   sheet.resumePaint();
      //   sheet_PC.resumePaint();
    },
    bindDataSource() {
      let sheet = new GC.Spread.Sheets.Worksheet("NewSheet");
      this.spread.addSheet(2, sheet);
      let activesheet = this.spread.getSheet(2);
      var nameColInfo = { name: "name", displayName: "姓名", size: 70 };
      var ageColInfo = {
        name: "age",
        displayName: "年龄",
        size: 40,
        resizable: false
      };
      var birthdayColInfo = {
        name: "birthday",
        displayName: "出生日期",
        formatter: "d/M/yy",
        size: 120
      };
      var positionColInfo = {
        name: "position",
        displayName: "职位",
        size: 50,
        visible: true
      };
      var isSaleColInfo = {
        name: "isSale",
        displayName: "是否促销",
        size: 50,
        visible: true,
        cellType: new GC.Spread.Sheets.CellTypes.CheckBox()
      };
      var colInfos = [
        { name: "name", displayName: "Name", size: 70 },
        { name: "age", displayName: "Age", size: 40, resizable: false },
        {
          name: "birthday",
          displayName: "Birthday",
          formatter: "d/M/yy",
          size: 120
        },
        { name: "position", displayName: "Position", size: 50, visible: false },
        {
          name: "isSale",
          displayName: "是否促销",
          size: 50,
          visible: true,
          cellType: new GC.Spread.Sheets.CellTypes.CheckBox()
        }
      ];
      sheet.autoGenerateColumns = false;
      activesheet.setDataSource(dataSource);
      //   activesheet.bindColumn(0, nameColInfo);
      //   activesheet.bindColumn(1, birthdayColInfo);
      //   activesheet.bindColumn(2, ageColInfo);
      //   activesheet.bindColumn(3, positionColInfo);
      //   activesheet.bindColumn(4, isSaleColInfo);
      activesheet.bindColumns(colInfos);
    },
    bindColumns() {
      let colInfos_HH = [
        { name: "SRName", displayName: "SR姓名", size: 100 },
        {
          name: "StoreCode",
          displayName: "门店代码",
          size: 100
        },
        {
          name: "StoreName",
          displayName: "门店名称",
          size: 300
        },
        {
          name: "CustomerName",
          displayName: "客户名称",
          size: 100
        },
        {
          name: "CustomerType",
          displayName: "客户类型",
          size: 100
          //   cellType: new GC.Spread.Sheets.CellTypes.CheckBox()
        },
        { name: "Channel", displayName: "渠道", size: 100 },
        { name: "SM", displayName: "SM", size: 100 },
        { name: "HCTTL_201902", displayName: "201902 HC TTL", size: 120 },
        { name: "HCTTL_201903", displayName: "201903 HC TTL", size: 120 },
        { name: "HCTTL_2019", displayName: "2019 HC TTL", size: 120 },
        { name: "Promote", displayName: "长促", size: 100 },
        { name: "FixedWSP", displayName: "固定WSP", size: 100 },
        { name: "AgencyCover", displayName: "Agency覆盖能力", size: 150 },
        {
          name: "TopOrOutside",
          displayName: "Top 5000/Outside 6500",
          size: 200
        },
        { name: "OMO_TCP", displayName: "OMO", size: 100 },
        { name: "Comfort_TCP", displayName: "Comfort", size: 100 },
        { name: "Huamu_TCP", displayName: "Huamu", size: 100 },
        {
          name: "POSMRate",
          displayName: "三档钻石大面积POSM执行率",
          size: 250,
          formatter: "0%"
        },
        {
          name: "StorePool",
          displayName: "Store Pool",
          size: 100,
          cellType: this.storePoolGroupCombo
        },
        { name: "SquareMeters", displayName: "二级陈列平米数", size: 150 },
        {
          name: "StartDate_Set1",
          displayName: "开始时间",
          size: 150,
          formatter: "yyyy/mm/dd"
        },
        {
          name: "EndDate_Set1",
          displayName: "结束时间",
          size: 150,
          formatter: "yyyy/mm/dd"
        },
        {
          name: "Rule_Set1",
          displayName: "组套机制",
          size: 100,
          cellType: this.ruleSetGroupCombo
        },
        { name: "Quantity_Set1", displayName: "组套套数", size: 100 },
        {
          name: "AreaCategory_POSM",
          displayName: "大面积类别",
          size: 100,
          cellType: this.AreaCategoryCombo
        },
        {
          name: "AreaDetail_POSM",
          displayName: "大面积明细",
          size: 100,
          cellType: this.AreaDetailCombo
        },
        {
          name: "HeadBoard_POSM",
          displayName: "抬头板",
          size: 100,
          cellType: this.HeadBoardCombo
        },
        { name: "Schedule1_WSP", displayName: "投放档期1", size: 100 },
        { name: "Schedule2_WSP", displayName: "投放档期2", size: 100 },
        { name: "Schedule3_WSP", displayName: "投放档期3", size: 100 },
        {
          name: "Pool_AG",
          displayName: "路演Pool",
          size: 100,
          cellType: this.HeadBoardCombo
        },
        { name: "Schedule_AG", displayName: "投放档期", size: 100 },
        {
          name: "SquareMetersDrop_AG",
          displayName: "WSP投放平米数",
          size: 120,
          cellType: this.SquareMetersDropCombo
        },
        { name: "Comment", displayName: "备注", size: 100 }
      ];
      this.sheet.bindColumns(colInfos_HH);

      let colInfos_PC = [
        { name: "SRName", displayName: "SR姓名", size: 100 },
        {
          name: "StoreCode",
          displayName: "门店代码",
          size: 100
        },
        {
          name: "StoreName",
          displayName: "门店名称",
          //   formatter: "d/M/yy",
          size: 300
        },
        {
          name: "CustomerName",
          displayName: "客户名称",
          size: 100
        },
        {
          name: "CustomerType",
          displayName: "客户类型",
          size: 100
          //   cellType: new GC.Spread.Sheets.CellTypes.CheckBox()
        },
        { name: "Channel", displayName: "渠道", size: 100 },
        { name: "SM", displayName: "SM", size: 100 },
        { name: "HPCTTL_201902", displayName: "HPC TTL", size: 120 },
        { name: "CFT_201902", displayName: "CFT", size: 120 },
        { name: "OMO_201902", displayName: "OMO", size: 120 },
        { name: "OMOHandwash_201902", displayName: "OMO Handwash", size: 120 },
        { name: "HPCTTL_201903", displayName: "HPC TTL", size: 120 },
        { name: "CFT_201903", displayName: "CFT", size: 120 },
        { name: "OMO_201903", displayName: "OMO", size: 120 },
        { name: "OMOHandwash_201903", displayName: "OMO Handwash", size: 120 },
        { name: "HPCTTL_2019", displayName: "HPC TTL", size: 120 },
        { name: "CFT_2019", displayName: "CFT", size: 120 },
        { name: "OMO_2019", displayName: "OMO", size: 120 },
        { name: "OMOHandwash_2019", displayName: "OMO Handwash", size: 120 },
        { name: "Promote", displayName: "长促", size: 100 },
        { name: "FixedWSP", displayName: "固定WSP", size: 100 },
        { name: "AgencyCover", displayName: "Agency覆盖能力", size: 150 },
        {
          name: "TopOrOutside",
          displayName: "Top 5000/Outside 6500",
          size: 200
        },
        { name: "Hair_TCP", displayName: "Hair", size: 150 },
        { name: "PW_TCP", displayName: "PW", size: 150 },
        { name: "Oral_TCP", displayName: "Oral", size: 150 },

        { name: "OMO_TCP", displayName: "OMO", size: 100 },
        { name: "Comfort_TCP", displayName: "Comfort", size: 100 },
        { name: "Huamu_TCP", displayName: "Huamu", size: 100 },
        {
          name: "POSMRate",
          displayName: "三档钻石大面积POSM执行率",
          size: 250,
          formatter: "0%"
        },
        {
          name: "StorePool",
          displayName: "Store Pool",
          size: 100,
          cellType: this.storePoolGroupCombo
        },
        { name: "SquareMeters", displayName: "二级陈列平米数", size: 150 },
        { name: "StartDate_Set1", displayName: "开始时间", size: 120 },
        { name: "EndDate_Set1", displayName: "结束时间", size: 120 },
        {
          name: "Rule_Set1",
          displayName: "组套机制",
          size: 100,
          cellType: this.ruleSetGroupCombo
        },
        { name: "Quantity_Set1", displayName: "组套套数", size: 100 },
        { name: "StartDate_Set2", displayName: "开始时间", size: 120 },
        { name: "EndDate_Set2", displayName: "结束时间", size: 120 },
        {
          name: "Rule_Set2",
          displayName: "组套机制",
          size: 100,
          cellType: this.ruleSetGroupCombo
        },
        { name: "Quantity_Set2", displayName: "组套套数", size: 100 },
        {
          name: "AreaCategory_POSM",
          displayName: "大面积类别",
          size: 100,
          cellType: this.AreaCategoryCombo
        },
        {
          name: "AreaDetail_POSM",
          displayName: "大面积明细",
          size: 100,
          cellType: this.AreaDetailCombo
        },
        {
          name: "HeadBoard_POSM",
          displayName: "抬头板",
          size: 100,
          cellType: this.HeadBoardCombo
        },
        { name: "Schedule1_WSP", displayName: "投放档期1", size: 100 },
        { name: "Schedule2_WSP", displayName: "投放档期2", size: 100 },
        {
          name: "Pool_AG",
          displayName: "路演Pool",
          size: 100,
          cellType: this.HeadBoardCombo
        },
        { name: "Schedule_AG", displayName: "投放档期", size: 100 },
        {
          name: "SquareMetersDrop_AG",
          displayName: "WSP投放平米数",
          size: 120,
          cellType: this.SquareMetersDropCombo
        },
        { name: "Comment", displayName: "备注", size: 100 }
      ];
      this.sheet_PC.bindColumns(colInfos_PC);
    }
  }
};
</script>
<style lang="scss" scoped>
.home,
.spreadWrapper {
  height: calc(100% - 20px);
}
.spreadHost {
  height: calc(100% - 75px);
  width: 100%;
}
.toolbar {
  padding-bottom: 5px;
  display: flex;
  align-items: center;
}

.formulaBar {
  height: 43px;
  width: calc(100% - 3px);
  margin-bottom: 2px;
  border: 1px solid #808080;
  background: white;
}
.statusBar {
  height: 25px;
  width: 100%;
}
.card {
  height: 100% !important;
  /deep/ .el-card__body {
    height: 100%;
  }
}
</style>