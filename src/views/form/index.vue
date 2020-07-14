
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
        <el-input v-model="listQuery.Id" placeholder="CalendarID" class="filter-item"></el-input>
        <!-- <el-input v-model="listQuery.SKUCode" placeholder="渠道分配" class="filter-item"></el-input> -->
        <el-select v-model="listQuery.Lang" placeholder="客户组" class="filter-item">
          <el-option value="0">RTM</el-option>
          <el-option value="1">WTS</el-option>
        </el-select>
        <!-- <el-input v-model="listQuery.SKUDesc" placeholder="区域" class="filter-item"></el-input> -->
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

        <el-button icon="el-icon-search" type="primary" @click="handleFilter" class="filter-item">搜索</el-button>
        <!-- <input type="file" class="el-button" @change="importExcel($event)" style="height: 45px;" /> -->
        <div style="display:inline-block;float:right;margin-bottom:10px;">
          <el-button icon="el-icon-download" type="primary" size @click="exportExcel">导出到Excel</el-button>
          <el-button icon="el-icon-upload" type="primary" @click="upload">上 传</el-button>
        </div>
        <!-- <el-button icon="el-icon-lock" type="primary" @click="lockSpread(spread)">锁定表单</el-button>
        <el-button icon="el-icon-unlock" type="primary" @click="unlockSpread(spread)">解锁表单</el-button>-->
      </div>

      <div class="spreadWrapper">
        <!-- <div ref="formulaBar" class="formulaBar" contenteditable="true" spellcheck="false"></div> -->
        <gc-spread-sheets
          class="spreadHost"
          v-loading="listLoading"
          @workbookInitialized="workbookInitialized($event)"
        >
          <gc-worksheet :dataSource="dataTable"></gc-worksheet>
        </gc-spread-sheets>
        <!-- <div ref="statusBar" class="statusBar"></div> -->
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
// import Calendar from "./Calendar.json";
import { dataSource_Calendar } from "../source-download/datasource";
GC.Spread.Common.CultureManager.culture("zh-cn");
GC.Spread.Sheets.LicenseKey =  ExcelIO.LicenseKey =
  "exceldemo.softorg.com,199297176362428#B025mWQyUnb8YnV5clMlVUTplXZjNmbWd6UzJXWD9URJFWWxZTUplWeX3SerUXRLJVN9djSwhmcohWVtRkMvtycxUGNaBVa6tyMF5UeNJlY7ZEd0lVWN3SeGl4LLNXSwxmVVh6ZKR6NwkGcUR5Z9VEeUd6VhpmMspVSQRXbT54Smt4NLJVMvEXaXJVTi3mZJ9mQzgkaXpVSzV7NkhnUmpXO4MkWp9kaaNWZk56an5GZjFlcaBHdzU4cqVjRGNjQEhEUXdUc0ZGbxskdQdXcspXOQRDSBF4NvIXTiZEZ7JkY9F7VsN6bp36Z8klMxETQuVXaysWMSNDbRFzUzgFWTVXdvsmUiojITJCLiUkMFNUO5QUMiojIIJCL6ITOzYjMyITO0IicfJye&Qf35VfiU5TzYjI0IyQiwiIzEjL6ByUKBCZhVmcwNlI0IiTis7W0ICZyBlIsIyMxITNwEDIyEjNwAjMwIjI0ICdyNkIsIiMxcDMwIDMyIiOiAHeFJCLi46bj9yZy3Gdm36cu2WblRGblNGelJiOiMXbEJCLig1jlzahlDZmpnInm/KnmDoim/agmH0vkDJllb0pnfbtmrIukLiOiEmTDJCLigjM4IjNzYzNxcTOykTOxIiOiQWSiwSflNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPBR4K6l6VzJjdNJWZk3maip6UMlEaFJ5VY5EMHdGTwk6ZSlTWlJWaMFzdwkETlJzcSllWS9GbQRkNadWY7cXe42GeSdTM5pmclV4L8o5QzkzzDr2";
export default {
  data() {
    return {
      dataTable: [],
      fileList: [],
      autoGenerateColumns: true,
      width: 300,
      visible: true,
      resizable: true,
      formatter: "",
      spread: null,
      sheet: null,
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
      listLoading: true,
      selectedArray: null,
      selectedComboBoxArray: null,
      customerGroup: [],
      customerGroupCombo: null,
      activityMonth: null,
      posterDate: null,
      categoryGroup: null,
      categoryGroupCombo: null,
      brandGroup: null,
      brandGroupCombo: null,
      LBP_subBrandGroup: null,
      ZENDIUM_subBrandGroup: null,
      ZH_subBrandGroup: null,
      subBrandGroupCombo: null,
      packSizeGroup: null,
      packSizeGroupCombo: null,
      regionGroup: [],
      regionList: null,
      activityTypeGroup: [],
      activityTypeCombo: null
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
    getList() {
      this.$axios
        .get(
          `/api/COA/GetCoaList?SkuCode=&SkuDesc=&SapCode=&BackCode=&StartDate=&EndDate=&Channel=&COALanguage=${"中文"}&page=1&limit=10&sort=-1`
        )
        .then(res => {
          console.log(res);
          this.dataTable = res.data.ReturnObject.ViewList;
          var sheet = this.spread.getActiveSheet();
          if (this.dataTable.length && this.dataTable.length > 0) {
            sheet.setDataSource(this.dataTable);
            this.initSpread(this.spread);
            this.hAlignCenter();
          }
        });
    },
    initList() {
      this.dataTable = dataSource_Calendar;
      //客户组
      this.customerGroup = [
        { text: "RTM", value: "0" },
        { text: "WTS", value: "1" },
        { text: "WALMART", value: "2" },
        { text: "永辉", value: "3" },
        { text: "carrefour", value: "4" },
        { text: "HUARUN NorthEast", value: "5" },
        { text: "HUARUN East", value: "6" },
        { text: "HUARUN North", value: "7" },
        { text: "HUARUN South", value: "8" }
      ];
      this.customerGroupCombo = new GC.Spread.Sheets.CellTypes.ComboBox();
      this.customerGroupCombo.items(this.customerGroup);
      //品类
      this.categoryGroup = [{ text: "Oral", value: "0" }];
      this.categoryGroupCombo = new GC.Spread.Sheets.CellTypes.ComboBox();
      this.categoryGroupCombo.items(this.categoryGroup);
      //品牌
      this.brandGroup = [
        { text: "LBP", value: "0" },
        { text: "ZENDIUM", value: "1" },
        { text: "ZHONG HUA", value: "2" }
      ];
      this.brandGroupCombo = new GC.Spread.Sheets.CellTypes.ComboBox();
      this.brandGroupCombo.items(this.brandGroup);
      //子品牌
      this.LBP_subBrandGroup = [{ text: "花漾星球", value: "0" }];
      this.ZENDIUM_subBrandGroup = [{ text: "ZENDIUM", value: "1" }];
      this.ZH_subBrandGroup = [{ text: "中华", value: "2" }];
      this.subBrandGroupCombo = new GC.Spread.Sheets.CellTypes.ComboBox();

      // this.subBrandGroupCombo.items(this.LBP_subBrandGroup);
      //活动单品packsize
      this.packSizeGroup = [
        { text: "TCP", value: "0" },
        { text: "DM", value: "1" },
        { text: "Destocking", value: "2" },
        { text: "New listing", value: "3" },
        { text: "品类折", value: "4" },
        { text: "BP", value: "5" },
        { text: "PPL", value: "6" }
      ];
      this.packSizeGroupCombo = new GC.Spread.Sheets.CellTypes.ComboBox();
      this.packSizeGroupCombo.items(this.packSizeGroup);
      this.activityTypeGroup = [
        { text: "18K", value: "0" },
        { text: "24K", value: "1" }
      ];
      this.activityTypeCombo = new GC.Spread.Sheets.CellTypes.ComboBox();
      this.activityTypeCombo.items(this.activityTypeGroup);
      //设置日期选择框
      // -------------------- Date Time Picker : showTime False ---------------------
      this.posterDate = new GC.Spread.Sheets.Style();
      this.posterDate.cellButtons = [
        {
          imageType: GC.Spread.Sheets.ButtonImageType.dropdown,
          command: "openDateTimePicker",
          useButtonStyle: false
        }
      ];
      this.posterDate.dropDowns = [
        {
          type: GC.Spread.Sheets.DropDownType.dateTimePicker,
          option: {
            showTime: false
          }
        }
      ];
      // -------------------- Month Picker  ---------------------

      this.activityMonth = new GC.Spread.Sheets.Style();
      this.activityMonth.cellButtons = [
        {
          imageType: GC.Spread.Sheets.ButtonImageType.dropdown,
          command: "openMonthPicker",
          useButtonStyle: false
        }
      ];

      this.activityMonth.dropDowns = [
        {
          type: GC.Spread.Sheets.DropDownType.monthPicker,
          option: {
            startYear: 2009,
            stopYear: 2019,
            height: 300
          }
        }
      ];
      this.regionGroup = [
        {
          text: "华东",
          value: "华东"
        },
        {
          text: "华中",
          value: "华中"
        },
        {
          text: "华南",
          value: "华南"
        },
        {
          text: "东北",
          value: "东北"
        }
      ];
      // -------------------- Vertical text list ---------------------
      this.regionList = new GC.Spread.Sheets.Style();
      this.regionList.cellButtons = [
        {
          imageType: GC.Spread.Sheets.ButtonImageType.dropdown,
          command: "openList",
          useButtonStyle: false
        }
      ];
      this.regionList.dropDowns = [
        {
          type: GC.Spread.Sheets.DropDownType.list,
          option: {
            multiSelect: true,
            items: this.regionGroup
          }
        }
      ];
    },
    handleFilter() {},
    workbookInitialized(spread) {
      this.spread = spread;
      // let formulaBar = new GC.Spread.Sheets.FormulaTextBox.FormulaTextBox(
      //   this.$refs.formulaBar,
      //   {}
      // );
      // formulaBar.workbook(this.spread);
      // this.spread.focus();

      // let statusBar = new GC.Spread.Sheets.StatusBar.StatusBar(
      //   this.$refs.statusBar
      // );
      // statusBar.bind(spread);
      //加载数据源
      this.initList();
      //初始化spread
      this.initSpread(this.spread);
      //注册命令
      this.registCommand(this.spread);
      //注册事件
      this.registEvent(this.spread);
    },
    initSpread(spread) {
      spread.suspendPaint();

      this.listLoading = true;
      //获取当前sheet
      this.sheet = spread.getActiveSheet();

      //渲染数据
      if (this.dataTable.length && this.dataTable.length > 0) {
        this.sheet.autoGenerateColumns = true;
        this.sheet.setDataSource(this.dataTable);
        this.bindColumns();
      }
      //复制粘贴的时候只复制值，且行列不够时可扩展粘贴
      spread.options.allowCopyPasteExcelStyle = false;
      spread.options.allowExtendPasteRange = true;
      this.sheet.options.clipBoardOptions =
        GC.Spread.Sheets.ClipboardPasteOptions.values;
      //设置不能新增表单
      spread.options.newTabVisible = false;
      //隐藏sheet名称
      spread.options.tabStripVisible = false;
      //校验失败高亮
      spread.options.highlightInvalidData = true;
      //将右键菜单列删除选项删除
      this.removeMenuDateItems(spread);
      //设置激活单元格
      this.sheet.setActiveCell(0, 0);
      //行数和列数
      let rowCount = this.sheet.getRowCount();
      let colCount = this.sheet.getColumnCount();
      this.rowCount = rowCount;
      this.colCount = colCount;
      //设置filter

      var filter = new this.spreadNS.Filter.HideRowFilter(
        new this.spreadNS.Range(0, 0, rowCount, colCount)
      );
      this.sheet.rowFilter(filter);
      //设置列宽
      // this.initColumnWidth();
      //设置下拉框
      // this.setComboBoxStyle();
      //设置联动下拉框
      this.setCascadeComboBoxStyle();
      //设置日期选择框
      this.setDateStyle();
      //设置多选框
      this.setListStyle();
      //根据品类设置子品牌下拉框
      this.bindSubBrandGroup();
      //设置校验器
      this.setDataValidator();

      // var option = {
      //   allowSelectLockedCells: true,
      //   allowSelectUnlockedCells: true,
      //   allowFilter: true,
      //   allowSort: false,
      //   allowResizeRows: true,
      //   allowResizeColumns: false,
      //   allowEditObjects: false,
      //   allowDragInsertRows: false,
      //   allowDragInsertColumns: false,
      //   allowInsertRows: false,
      //   allowInsertColumns: false,
      //   allowDeleteRows: false,
      //   allowDeleteColumns: false
      // };
      // sheet.options.protectionOptions = option;
      // sheet.options.isProtected = true;

      //设置列头高
      var colHeader = GC.Spread.Sheets.SheetArea.colHeader;
      this.sheet.setRowHeight(0, 50, colHeader);

      //设置水平垂直居中显示
      this.hAlignCenter();
      this.vAlignCenter();
      spread.resumePaint();

      this.listLoading = false;
    },
    registEvent(spread) {
      let sheet = spread.getActiveSheet();
      let self = this;

      spread.bind(GC.Spread.Sheets.Events.ValueChanged, (s, e) => {
        console.log(e, "--valueChanged");
        if (e.col === 4) {
          sheet.setFormatter(e.row, e.col, "yyyymm");
          sheet.tag(e.newValue);
          var date = sheet.tag();
          // console.log(date)
        }
        if (e.col === 5) {
          sheet.setFormatter(e.row, e.col, "yyyymmdd");
        }
        if (e.col === 6) {
          sheet.setFormatter(e.row, e.col, "yyyymmdd");
        }
        //品类
        if (e.col === 7) {
          sheet
            .getCell(e.row, e.col + 1, this.spreadNS.SheetArea.viewport)
            .cellType(this.brandGroupCombo)
            .value("");
          sheet
            .getCell(e.row, e.col + 2, this.spreadNS.SheetArea.viewport)
            .cellType(this.subBrandGroupCombo)
            .value("");
          sheet
            .getCell(e.row, e.col + 3, this.spreadNS.SheetArea.viewport)
            .cellType(this.packSizeGroupCombo)
            .value("");
        }
        //品牌
        if (e.col === 8) {
          let cellValue = sheet.getValue(e.row, e.col);
          switch (cellValue) {
            case "LBP": {
              let combo1 = new GC.Spread.Sheets.CellTypes.ComboBox();
              combo1.items(this.LBP_subBrandGroup);
              // this.subBrandGroupCombo.items(this.LBP_subBrandGroup);
              sheet
                .getCell(e.row, e.col + 1, this.spreadNS.SheetArea.viewport)
                .cellType(combo1)
                .value("");
              break;
            }
            case "ZENDIUM": {
              let combo2 = new GC.Spread.Sheets.CellTypes.ComboBox();
              combo2.items(this.ZENDIUM_subBrandGroup);
              // this.subBrandGroupCombo.items(this.ZENDIUM_subBrandGroup);
              sheet
                .getCell(e.row, e.col + 1, this.spreadNS.SheetArea.viewport)
                .cellType(combo2)
                .value("");
              break;
            }
            case "ZHONG HUA": {
              let combo3 = new GC.Spread.Sheets.CellTypes.ComboBox();
              combo3.items(this.ZH_subBrandGroup);
              // this.subBrandGroupCombo.items(this.ZH_subBrandGroup);
              sheet
                .getCell(e.row, e.col + 1, this.spreadNS.SheetArea.viewport)
                .cellType(combo3)
                .value("");
              break;
            }
            default: {
            }
          }

          sheet
            .getCell(e.row, e.col + 2, this.spreadNS.SheetArea.viewport)
            .cellType(this.packSizeGroupCombo)
            .value("");
        }
        if (e.col === 9) {
          sheet
            .getCell(e.row, e.col + 1, this.spreadNS.SheetArea.viewport)
            .cellType(this.packSizeGroupCombo)
            .value("");
        }
      });

      spread.bind(GC.Spread.Sheets.Events.RangeChanged, (s, e) => {
        console.log(e, "--rangeChanged");
        //遍历每一个cell
        e.changedCells.forEach(item => {
          if (item.col === 2) {
            //客户组
            let cellValue = sheet.getValue(item.row, item.col);
            console.log(cellValue);
            let existFlag = this.customerGroup.some(item => {
              return item.text == cellValue;
            });
            if (!existFlag) {
              console.log("不存在");
              sheet
                .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                .cellType(this.customerGroupCombo)
                .value("");
            } else {
              console.log("存在");
              sheet
                .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                .cellType(this.customerGroupCombo)
                .value(cellValue);
            }
          }
          if (item.col === 3) {
            //客户组
            let cellValue = sheet.getValue(item.row, item.col);
            console.log(cellValue);
            let existFlag = this.regionGroup.some(item => {
              return item.text == cellValue;
            });
            if (!existFlag) {
              console.log("不存在");
              sheet
                .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                .value("");
            } else {
              console.log("存在");
              sheet
                .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                .value(cellValue);
            }
          }
          if (item.col === 4) {
            let cellValue = sheet.getValue(item.row, item.col);
            console.log(cellValue);
            // let reg = /\\\\d{4}(\-|\/|.)\\\\d{1,2}\1\\\\d{1,2}/
            // let reg = /\\\\d{4}\\\\d{1,2}\1\\\\d{1,2}/
            let reg = /^\d{4}\d{2}$/;
            let validFlag = reg.test(cellValue);
            if (!validFlag) {
              console.log("格式不正确");
              // sheet.setStyle(item.row, item.col, this.activityMonth);
              sheet.setValue(item.row, item.col, "");
            } else {
              console.log("格式正确");
              // sheet.setStyle(item.row, item.col, this.activityMonth);
              sheet.setValue(item.row, item.col, cellValue);
            }
          }
          if (item.col === 5) {
            let cellValue = sheet.getValue(item.row, item.col);
            console.log(cellValue);
            // let reg = /\\\\d{4}(\-|\/|.)\\\\d{1,2}\1\\\\d{1,2}/
            // let reg = /\\\\d{4}\\\\d{1,2}\1\\\\d{1,2}/
            let reg = /^\d{4}\d{2}\d{2}$/;
            let validFlag = reg.test(cellValue);
            if (!validFlag) {
              console.log("格式不正确");
              // sheet.setStyle(item.row, item.col, this.posterDate);
              sheet.setValue(item.row, item.col, "");
            } else {
              console.log("格式正确");
              // sheet.setStyle(item.row, item.col, this.posterDate);
              sheet.setValue(item.row, item.col, cellValue);
            }
          }
          if (item.col === 6) {
            let cellValue = sheet.getValue(item.row, item.col);
            console.log(cellValue);
            // let reg = /\\\\d{4}(\-|\/|.)\\\\d{1,2}\1\\\\d{1,2}/
            // let reg = /\\\\d{4}\\\\d{1,2}\1\\\\d{1,2}/
            let reg = /^\d{4}\d{2}\d{2}$/;
            let validFlag = reg.test(cellValue);
            if (!validFlag) {
              console.log("格式不正确");
              // sheet.setStyle(item.row, item.col, this.posterDate);
              sheet.setValue(item.row, item.col, "");
            } else {
              console.log("格式正确");
              // sheet.setStyle(item.row, item.col, this.posterDate);
              sheet.setValue(item.row, item.col, cellValue);
            }
          }
          if (item.col === 7) {
            //品类
            let cellValue = sheet.getValue(item.row, item.col);
            console.log(cellValue);
            let existFlag = this.categoryGroup.some(item => {
              return item.text == cellValue;
            });
            if (!existFlag) {
              console.log("不存在");
              sheet
                .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                .value("");
            } else {
              console.log("存在");
              sheet
                .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                .value(cellValue);
            }
          }
          if (item.col === 8) {
            //品牌
            let cellValue = sheet.getValue(item.row, item.col);
            console.log(cellValue);
            let existFlag = this.brandGroup.some(item => {
              return item.text == cellValue;
            });
            if (!existFlag) {
              console.log("不存在");
              sheet
                .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                .value("");
            } else {
              console.log("存在");
              sheet
                .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                .value(cellValue);
            }
          }
          if (item.col === 9) {
            //子品牌
            let cate = sheet.getValue(item.row, item.col - 1);
            let cellValue = sheet.getValue(item.row, item.col);
            console.log(cellValue);
            if (cate === "LBP") {
              let existFlag = this.LBP_subBrandGroup.some(item => {
                return item.text == cellValue;
              });
              if (!existFlag) {
                console.log("不存在");
                sheet
                  .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                  .value("");
              } else {
                console.log("存在");
                sheet
                  .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                  .value(cellValue);
              }
            } else if (cate === "ZENDIUM") {
              let existFlag = this.ZENDIUM_subBrandGroup.some(item => {
                return item.text == cellValue;
              });
              if (!existFlag) {
                console.log("不存在");
                sheet
                  .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                  .value("");
              } else {
                console.log("存在");
                sheet
                  .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                  .value(cellValue);
              }
            } else if (cate === "ZHONG HUA") {
              let existFlag = this.ZH_subBrandGroup.some(item => {
                return item.text == cellValue;
              });
              if (!existFlag) {
                console.log("不存在");
                sheet
                  .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                  .value("");
              } else {
                console.log("存在");
                sheet
                  .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                  .value(cellValue);
              }
            } else {
              sheet
                .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                .value("");
            }
          }
          if (item.col === 10) {
            //品牌
            let cellValue = sheet.getValue(item.row, item.col);
            console.log(cellValue);
            let existFlag = this.packSizeGroup.some(item => {
              return item.text == cellValue;
            });
            if (!existFlag) {
              console.log("不存在");
              sheet
                .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                .value("");
            } else {
              console.log("存在");
              sheet
                .getCell(item.row, item.col, this.spreadNS.SheetArea.viewport)
                .value(cellValue);
            }
          }
        });
      });

      spread.bind(GC.Spread.Sheets.Events.SelectionChanged, (s, e) => {
        // console.log(e, "--selectionChanged");
        e.newSelections.forEach(item => {
          let cellType = sheet.getCellType(item.row, item.col);
          if (cellType instanceof GC.Spread.Sheets.CellTypes.ComboBox) {
            // console.log("7")
          }
        });
      });
      //日期选择框不可编辑
      sheet.bind(GC.Spread.Sheets.Events.EditStarting, function(sender, args) {
        var style = args.sheet.getActualStyle(args.row, args.col);
        console.log(style, "--style");
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
            console.log(sels, "--sels");
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
            console.log(sels, "--sels");
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
      var insertRowsBefore = {
        command: "insertRowsBefore",
        text: "向上插入行",
        // name只要不重复即可
        name: "insertRowsBefore",
        // 把自己定义好的icon class加在这里
        iconClass: "gc-spread-custom-icon",
        workArea: "rowHeader"
      };
      // 定义一个在行头区域执行的右键菜单项
      var insertRowsBehind = {
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
        if (item && item.name === "gc.spread.clearContents") {
          menuData.splice(index + 1, 0, { type: "separator" });
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
        rowHeadersAsFrozenColumns: true,
        columnHeadersAsFrozenRows: true
      };
      if (this.spread) {
        var jsonStr = JSON.stringify(this.spread.toJSON(serializationOption));
        console.log(jsonStr);
      }

      //发送ajax请求将json数据传给服务器
    },
    vAlignCenter() {
      if (this.spread) {
        let sheet = this.spread.getActiveSheet();
        let range = sheet.getSelections()[0];
        // let range = sheet.getRowCount;
        // let range = sheet.getColCount;
        let rowCount = sheet.getRowCount();
        let colCount = sheet.getColumnCount();
        sheet.suspendPaint();
        for (let row = 0; row < rowCount; row++) {
          // sheet.setRowHeight(row, 36);
          for (let col = 0; col < colCount; col++) {
            sheet
              .getCell(row, col)
              .cellPadding("0 0 0 0")
              .vAlign(GC.Spread.Sheets.VerticalAlign.center);
          }
        }
        sheet.resumePaint();
      }
    },
    hAlignCenter() {
      if (this.spread) {
        let sheet = this.spread.getActiveSheet();
        let range = sheet.getSelections()[0];
        // let range = sheet.getRowCount;
        // let range = sheet.getColCount;

        sheet.suspendPaint();
        sheet
          .getRange(
            range.row,
            range.col,
            sheet.getRowCount(),
            sheet.getColumnCount()
          )
          .hAlign(GC.Spread.Sheets.HorizontalAlign.center);
        sheet.resumePaint();
      }
    },
    bindColumns() {
      let colInfos = [
        { name: "CalendarID", displayName: "CalendarID", size: 100 },
        {
          name: "Channel",
          displayName: "渠道分配",
          size: 100
        },
        {
          name: "CustomerGroup",
          displayName: "客户组",
          size: 100,
          cellType: this.customerGroupCombo
        },
        {
          name: "Region",
          displayName: "区域",
          size: 100
        },
        {
          name: "ActivityMonth",
          displayName: "活动月份",
          size: 100,
          formatter: "yyyymm"
        },
        {
          name: "StartDate_Poster",
          displayName: "海报开始",
          size: 100,
          formatter: "yyyymmdd"
        },
        {
          name: "EndDate_Poster",
          displayName: "海报结束",
          size: 100,
          formatter: "yyyymmdd"
        },
        {
          name: "BrandCategory",
          displayName: "品类",
          size: 120,
          cellType: this.categoryGroupCombo
        },
        {
          name: "Brand",
          displayName: "品牌",
          size: 120,
          cellType: this.brandGroupCombo
        },
        {
          name: "Brand_Sub",
          displayName: "子品牌",
          size: 120,
          cellType: this.subBrandGroupCombo
        },
        {
          name: "PackSize",
          displayName: "活动单品PackSize",
          size: 150,
          cellType: this.packSizeGroupCombo
        },
        { name: "ActivityDesc", displayName: "活动描述", size: 100 },
        { name: "ActivityName", displayName: "活动名称", size: 150 },
        {
          name: "PriorScore",
          displayName: "事前点数",
          size: 200,
          formatter: "0%"
        },
        {
          name: "PriorQuota",
          displayName: "事前配额（箱）",
          size: 120,
          formatter: "0.00"
        },
        {
          name: "LaterScore",
          displayName: "事后点数",
          size: 100,
          formatter: "0%"
        },
        {
          name: "LaterQuota",
          displayName: "事后配额（箱）",
          size: 120,
          formatter: "0.00"
        },
        {
          name: "TotalQuota",
          displayName: "总配额",
          size: 250,
          formatter: "0.00"
        },
        {
          name: "MonthlyProportion_before",
          displayName: "M-1月占比",
          size: 100,
          formatter: "0%"
        },
        {
          name: "MonthlyProportion",
          displayName: "M月占比",
          size: 150,
          formatter: "0%"
        },
        {
          name: "MonthlyProportion_after",
          displayName: "M+1月占比",
          size: 120,
          formatter: "0%"
        },
        { name: "SaleType", displayName: "促销类型", size: 120 },
        {
          name: "TTSAmount",
          displayName: "TTS其他费用金额",
          size: 200
        },
        {
          name: "ActivityType",
          displayName: "活动性质",
          size: 100,
          cellType: this.activityTypeCombo
        },
        {
          name: "Status",
          displayName: "状态",
          size: 100
        }
      ];
      this.sheet.bindColumns(colInfos);
    },
    initColumnWidth() {
      this.sheet.setColumnWidth(0, 100);
      this.sheet.setColumnWidth(1, 100);
      this.sheet.setColumnWidth(2, 100);
      this.sheet.setColumnWidth(3, 100);
      this.sheet.setColumnWidth(4, 100);
      this.sheet.setColumnWidth(5, 120);
      this.sheet.setColumnWidth(6, 120);
      this.sheet.setColumnWidth(7, 100);
      this.sheet.setColumnWidth(8, 100);
      this.sheet.setColumnWidth(9, 100);
      this.sheet.setColumnWidth(10, 150);
      this.sheet.setColumnWidth(11, 120);
      this.sheet.setColumnWidth(12, 200);
      this.sheet.setColumnWidth(13, 120);
      this.sheet.setColumnWidth(14, 120);
      this.sheet.setColumnWidth(15, 120);
      this.sheet.setColumnWidth(16, 120);
      this.sheet.setColumnWidth(17, 120);
      this.sheet.setColumnWidth(18, 120);
      this.sheet.setColumnWidth(19, 120);
      this.sheet.setColumnWidth(20, 120);
      this.sheet.setColumnWidth(21, 120);
      this.sheet.setColumnWidth(22, 120);
      this.sheet.setColumnWidth(23, 120);
      this.sheet.setColumnWidth(24, 120);
    },
    setComboBoxStyle() {
      for (let i = 0; i < this.rowCount; i++) {
        this.sheet.setCellType(
          i,
          2,
          this.customerGroupCombo,
          GC.Spread.Sheets.SheetArea.viewport
        );
        this.sheet.setCellType(
          i,
          7,
          this.categoryGroupCombo,
          GC.Spread.Sheets.SheetArea.viewport
        );
        this.sheet.setCellType(
          i,
          8,
          this.brandGroupCombo,
          GC.Spread.Sheets.SheetArea.viewport
        );
        this.sheet.setCellType(
          i,
          9,
          this.subBrandGroupCombo,
          GC.Spread.Sheets.SheetArea.viewport
        );
        this.sheet.setCellType(
          i,
          10,
          this.packSizeGroupCombo,
          GC.Spread.Sheets.SheetArea.viewport
        );
        this.sheet.setCellType(
          i,
          23,
          this.activityTypeCombo,
          GC.Spread.Sheets.SheetArea.viewport
        );

        // sheet.setFormatter(i, 4, "yyyymm");
        // sheet.setFormatter(i, 5, "yyyymmdd");
        // sheet.setFormatter(i, 6, "yyyymmdd");
        // this.sheet.setFormatter(i, 13, "0%");
        // this.sheet.setFormatter(i, 14, "￥#,##0.00");
        // sheet.getCell(i,4).formatter(new  GC.Spread.Formatter.GeneralFormatter("yyyy/MM/dd", "en-us"))
      }
    },
    setCascadeComboBoxStyle() {
      for (let i = 0; i < this.rowCount; i++) {
        let cellValue = this.sheet.getValue(i, 8);
        switch (cellValue) {
          case "LBP": {
            let combo1 = new GC.Spread.Sheets.CellTypes.ComboBox();
            combo1.items(this.LBP_subBrandGroup);
            // this.subBrandGroupCombo.items(this.LBP_subBrandGroup);
            this.sheet
              .getCell(i, 9, this.spreadNS.SheetArea.viewport)
              .cellType(combo1);
            break;
          }
          case "ZENDIUM": {
            let combo2 = new GC.Spread.Sheets.CellTypes.ComboBox();
            combo2.items(this.ZENDIUM_subBrandGroup);
            // this.subBrandGroupCombo.items(this.ZENDIUM_subBrandGroup);
            this.sheet
              .getCell(i, 9, this.spreadNS.SheetArea.viewport)
              .cellType(combo2);
            break;
          }
          case "ZHONG HUA": {
            let combo3 = new GC.Spread.Sheets.CellTypes.ComboBox();
            combo3.items(this.ZH_subBrandGroup);
            // this.subBrandGroupCombo.items(this.ZH_subBrandGroup);
            this.sheet
              .getCell(i, 9, this.spreadNS.SheetArea.viewport)
              .cellType(combo3);
            break;
          }
          default: {
          }
        }
      }
    },
    setDateStyle() {
      this.sheet.setStyle(-1, 4, this.activityMonth);
      this.sheet.setStyle(-1, 5, this.posterDate);
      this.sheet.setStyle(-1, 6, this.posterDate);

      this.sheet.setFormatter(-1, 4, "yyyymm");
      this.sheet.setFormatter(-1, 5, "yyyymmdd");
      this.sheet.setFormatter(-1, 6, "yyyymmdd");
    },
    setListStyle() {
      this.sheet.setStyle(-1, 3, this.regionList);
    },
    removeMenuDateItems(spread) {
      var menuData = spread.contextMenu.menuData;
      var newMenuData = [];
      menuData.forEach(item => {
        if (
          (item && item.name === "gc.spread.insertColumns") ||
          (item && item.name === "gc.spread.deleteColumns") ||
          (item && item.name === "gc.spread.insertRows")
        ) {
          return;
        }
        newMenuData.push(item);
      });
      console.log(newMenuData);
      spread.contextMenu.menuData = newMenuData;
    },
    bindSubBrandGroup() {},
    setDataValidator() {
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
      this.sheet.setDataValidator(-1, 14, dv);
      this.sheet.setDataValidator(-1, 16, dv);
      this.sheet.setDataValidator(-1, 17, dv);
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
  height: calc(100% - 30px);
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
.gc-month-picker-container {
  width: 327px !important;
}
.card {
  height: 100% !important;
  /deep/ .el-card__body {
    height: 100%;
  }
}
</style>