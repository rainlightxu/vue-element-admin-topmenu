<template>
  <div class="navbar">
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <!-- <logo class="logo"  :collapse="isCollapse"/> -->
    <img src="@/assets/logo-login.png" alt="logo" width="50px" height="50px" class="logo" />
    <h1 class="header-title">{{ title }}</h1>

    <!-- <el-scrollbar wrap-class="scrollbar-wrapper"> -->
      <el-menu
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="horizontal"
        style="display:flex;"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    <!-- </el-scrollbar> -->
    <!-- <sidebar class="sidebar-container" /> -->

    <div class="right-menu">
      <!-- <template v-if="device!=='mobile'">
          <search id="header-search" class="right-menu-item" />

          <error-log class="errLog-container right-menu-item hover-effect" />

          <screenfull id="screenfull" class="right-menu-item hover-effect" />

          <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
            <size-select id="size-select" class="right-menu-item hover-effect" />
          </el-tooltip>

          <lang-select class="right-menu-item hover-effect"></lang-select>

          <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
            <theme class="right-menu-item hover-effect"></theme>
          </el-tooltip>
      </template>-->
      <!-- <el-button type plain class="logout-btn" @click="logout">Logout</el-button> -->

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img src="@/assets/Unilever.png" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>{{$t('navbar.profile')}}</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>{{$t('navbar.dashboard')}}</el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>-->
          <!-- <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>-->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import SidebarItem from "./Sidebar/SidebarItem";
import variables from "@/styles/variables.scss";
import { Sidebar } from "./Sidebar";
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Logo from "./Sidebar/Logo";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import LangSelect from "@/components/LangSelect";
import Theme from "@/components/ThemePicker";
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Logo,
    Screenfull,
    ErrorLog,
    SizeSelect,
    Search,
    LangSelect,
    Theme,
    SidebarItem
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device", "permission_routes"]),
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    title() {
      return this.$store.state.app.title;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables() {
      return variables;
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");

      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 70px;
  overflow: hidden;
  position: relative;
  background: #001529;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  display: flex;
  align-items: center;
  justify-content: space-between;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .logo {
    margin-left: 20px;
  }
  .breadcrumb-container {
    float: left;
  }

  .el-menu,
  .el-menu--horizontal {
    height: 56px;
    border-bottom: none;
    border-right: none;
  }
  .right-menu {
    display: flex;
    align-items: center;
    // float: right;
    // height: 100%;
    line-height: 58px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 20px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 20px;

      .avatar-wrapper {
        background-color: #d9e9f3;
        border-radius: 50px;
        padding: 2px;
        width: 44px;
        height: 44px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }

    .logout-btn {
      margin-right: 15px;
    }
  }
  .header-title {
    font-size: 30px;
    display: inline;
    color: white;
  }
}
.el-scrollbar__bar .is-vertical .el-scrollbar__thumb {
  display: none !important;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
