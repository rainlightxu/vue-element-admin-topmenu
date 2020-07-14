<template>
  <div class="app-container">
    <!-- 面包屑区域 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        <a href="#" style="font-weight:bold;">首页</a>
      </el-breadcrumb-item>
    </el-breadcrumb>-->
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-row :gutter="20">
            <el-col :span="12">
              <router-link to="/dashboard/offtakeplatform">
                <div class="box-left" style="background-color:#04C7D1">
                  <div class="title-inbox">
                    <h1>Offtake Platform</h1>
                    <h1>Dashboard</h1>
                    <!-- <i class="el-icon-arrow-right"></i> -->
                    <svg-icon icon-class="right-button" class="right-button"></svg-icon>
                  </div>
                  <img src="@/assets/p1.png" />
                </div>
              </router-link>
            </el-col>
            <el-col :span="12">
              <router-link to="/dashboard/marketingincremental">
                <div class="box-left" style="background-color:#8FB6CD">
                  <div class="title-inbox">
                    <h1>Marketing</h1>
                    <h1>Incremental</h1>
                    <!-- <i class="el-icon-arrow-right"></i> -->
                    <svg-icon icon-class="right-button" class="right-button"></svg-icon>
                  </div>
                  <img src="@/assets/p2.png" />
                </div>
              </router-link>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <router-link to="/dashboard/crfglobal">
                <div class="box-left" style="background-color:#D5A9D7">
                  <div class="title-inbox">
                    <h1>CRF Global</h1>
                    <h1>Offtake</h1>
                    <!-- <i class="el-icon-arrow-right"></i> -->
                    <svg-icon icon-class="right-button" class="right-button"></svg-icon>
                  </div>
                  <img src="@/assets/p3.png" />
                </div>
              </router-link>
            </el-col>
            <el-col :span="12">
              <router-link to="/dashboard/marketingreport">
                <div class="box-left" style="background-color:#A1A1D1">
                  <div class="title-inbox">
                    <h1>Marketing</h1>
                    <h1>Incremental</h1>
                    <!-- <i class="el-icon-arrow-right"></i> -->
                    <svg-icon icon-class="right-button" class="right-button"></svg-icon>
                  </div>
                  <img src="@/assets/p4.png" />
                </div>
              </router-link>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <router-link to="/dashboard/competitor">
            <div class="box-right" style="background-color:#005C90">
              <img src="@/assets/p5.png" />
              <div class="title-inbox">
                <h1>Offtake Platform Dashboard</h1>
                <!-- <i class="el-icon-arrow-right"></i> -->
                <svg-icon icon-class="right-button" class="right-button"></svg-icon>
              </div>
            </div>
          </router-link>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
img {
  height: 100%;
  // margin: 0 auto;
  // margin-left: 131px;
}
.item {
  display: flex;
  justify-content: center;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #eaedf1;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #eaedf1;
}
.box-left {
  height: 240px;
  width: 100%;
  display: inline-block;
  background-color: violet;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .title-inbox {
    color: white;
    width: 235px;
    h1 {
      margin: 0;
      font-weight: 400;
      &:last-of-type {
        margin-bottom: 10px;
      }
    }
  }
}
.box-right {
  height: 500px;
  width: 100%;
  display: inline-block;
  background-color: violet;
  text-align: center;
  img {
    margin-top: 150px;
  }
  .title-inbox {
    color: white;
    h1 {
      margin: 0;
      font-weight: 400;
      &:last-of-type {
        margin-bottom: 10px;
      }
    }
  }
}
img {
  width: 100px;
  height: 100px;
}
.el-card {
  padding: 0 !important;
  margin: 0;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.right-button {
  font-size: 30px !important;
  margin-left: -3px;
}
</style>