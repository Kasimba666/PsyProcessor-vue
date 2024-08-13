<template>
  <div class="AppHeader">
    <div class="screen-monitor" v-if="DEBUG">
      {{ screen.type }}<br/>
      {{ screen.width }}px
    </div>
    <div class="markers-panel">
      <div
          class="marker"
          :class="{
                'in-progress': session.status === 'inProgress',
                'active': session.id === currentSessionID,
                'stacked': markersStacked
            }"
          :style="{top: markersStacked ? idx*23+'px': 0, zIndex: 1000-idx}"
          v-for="(session, idx) in sessionList"
          @click="onMarker(session)"
          :key="session.id"
      >
        {{ dtIsoShort(session.header.changedDt) }}
        <div
            v-if="markersStacked"
            class="tooltip"
            v-b-tooltip.hover.left=session.header.sessionTitle
        />
        <div v-else
            class="tooltip"
            v-b-tooltip.hover.bottom=session.header.sessionTitle
        />
      </div>
    </div>
    <div class="logo">
      PsyProcessor
    </div>
    <el-dropdown
        v-if="screen.type === 'xs'"
        trigger='hover'
        placement="top"
    >
      <i class="ico ico-menu" style="font-size: 20px"></i>
      <template #dropdown>
        <el-dropdown-item class="home"><router-link class="" style="color: hsl(180, 99%, 22%)" :to="{name: 'PgHome'}">Главная</router-link></el-dropdown-item>
        <el-dropdown-item><router-link class="" style="color: hsl(180, 99%, 22%)" :to="{name: 'PgProcessList'}">Процессы</router-link></el-dropdown-item>
        <el-dropdown-item><router-link class="" style="color: hsl(180, 99%, 22%)" :to="{name: 'PgConstructor', params: {id: this.currentEditableProcessID}}">Конструктор</router-link></el-dropdown-item>
        <el-dropdown-item><router-link class="" style="color: hsl(180, 99%, 22%)" :to="{name: 'PgSession', params: {id: this.currentSessionID}}">Личный кабинет</router-link></el-dropdown-item>
      </template>
    </el-dropdown>
    <div
        v-else
        class="top-nav">
      <router-link class="menu-item home" :to="{name: 'PgHome'}">Главная</router-link>
      <router-link class="menu-item" :to="{name: 'PgProcessList'}">Процессы</router-link>
      <router-link class="menu-item" :to="{name: 'PgConstructor', params: {id: this.currentEditableProcessID}}">Конструктор</router-link>
      <router-link class="menu-item" :to="{name: 'PgSession', params: {id: this.currentSessionID}}">Личный кабинет</router-link>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapState} from "vuex";
import {useDtFilters} from "@/composables/useDtFilters.js";
import {useScreen} from '@/composables/useScreen.js'

const markerWidth = 96;
const markerGap = 10;

export default {
  name: "AppHeader",
  components: {},
  props: [],
  data() {
    return {
      DEBUG: import.meta.env.MODE === 'development',
    }
  },

  setup() {
    const {dtIsoShort} = useDtFilters();
    const {screen, screenBreakPoints, setScreenListener, removeScreenListener} = useScreen();
      return {
          dtIsoShort,
          screen,
          screenBreakPoints,
          setScreenListener,
          removeScreenListener
      }
  },
  computed: {
    ...mapState(['currentSessionID', 'sessionList', 'currentEditableProcessID']),
    ...mapGetters(['markerSessions']),
    ...mapMutations(['changeSessionStatusByID', 'sessionsToPausedExceptThis']),
    markersStacked() {
      return this.screen.width < this.markerSessions.length * (markerWidth + markerGap) + markerGap;
    },
  },
  methods: {
    onMarker(v) {
      //обработка нажатия на другую закладку, чем открыта сейчас
      if (v.id !== this.currentSessionID) {
        //поставить на паузу предыдущую сессию
        if (!!this.currentSessionID) this.$store.commit('changeSessionStatusByID', {
          id: this.currentSessionID,
          status: 'paused'
        });
        this.$store.commit('currentSessionID', v.id);
        //запустить текущую сессию
        this.$store.commit('changeSessionStatusByID', {
          id: this.currentSessionID,
          status: 'inProgress'
        });
      }
      //переход на страницу сессии
      this.$router.push({name: 'PgSession', params: {id: v.id}});
    },
  },
  mounted() {
    this.setScreenListener();
  },
  unmounted() {
    this.removeScreenListener();
  },
}
</script>

<style lang="scss">
.AppHeader {
  position: fixed;
  left: 0;
  top: 0;
  padding: 0 20px;
  width: 100%;
  height: var(--header-height);
  background-color: hsl(50, 30%, 95%);
  border-bottom: 1px solid hsl(50, 30%, 75%);
  display: flex;
  align-items: center;
  z-index: 20;

  a {
    color: hsl(180, 100%, 30%);
  }

  & > * {
    flex: 0 0 auto;
  }

  .logo {
    width: 100px;
    padding: 0 0 0 0px;
    font-family: 'Arial';
    font-size: 30px;
    font-weight: bold;
    color: hsl(180, 99%, 22%);
    transform-origin: left bottom;
    transform: scaleX(.333);
  }

  .top-nav {
    display: flex;
    align-self: stretch;
    align-items: stretch;
    perspective: 500px;

    & > * {
      flex: 0 0 auto;
      display: block;
    }

    .menu-item {
      display: flex;
      align-items: center;
      width: auto;
      padding: 3px 10px 0;
      font-size: 13px;
      text-decoration: underline;
      cursor: pointer;

      &:hover {
        background-color: hsl(50, 50%, 98%);
        &.router-link-active {
          text-decoration: none;
        }
      }

      &.router-link-active {
        cursor: default;
        /*color: black;*/
        color: hsl(50, 99%, 15%);
        //text-shadow: 0 0 1px hsl(160, 99%, 70%);
        background-color: white;
        box-shadow: inset 0 -3px 1px -2px hsl(50, 99%, 22%);
        transform: translate3d(0, 2px, 20px);
        text-decoration: none;

      }
    }
  }
  .screen-monitor {
    position: absolute;
    left: 10px;
    top: var(--header-height);
    font-size: 12px;
    color: black;
    z-index: 15;
  }
  .markers-panel {
    position: fixed;
    top: var(--header-height);
    left: 0px;
    width: 100%;
    height: 30px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 3px;
    flex: 1 1 auto;
    pointer-events: none;
    z-index: 10;


    .marker {
      position: relative;
      font-size: 10px;
      height: auto;
      width: auto;
      color: black;
      background-color: hsla(58, 80%, 80%, 0.9);
      border-top: none;
      padding: 3px;
      user-select: none;
      border-radius: 0 0px 0px 10px;
      box-shadow: 2px 1px 12px 0px hsla(0, 0%, 50%, 0.7);
      transition: all 0.4s ease;
      cursor: pointer;
      pointer-events: visible;
      flex-shrink: 0;
      z-index: 10;

      &.in-progress {
        background-color: hsla(84, 80%, 80%, 0.9);
      }

      &:hover {
        color: black;
        //background-color: hsla(44, 80%, 70%, 0.9);
        transition: all 0.2s ease;
      }

      &:active {
        box-shadow: 1px 0px 12px 0px hsla(0, 0%, 50%, 0.7);
        transform: translate(1px, 1px);
      }

      &.active {
        border: 1px solid gray;
        border-top: none;
        //box-shadow: 2px 1px 12px 0px hsla(60, 80%, 40%, 0.7);
      }

      &.stacked {
        position: absolute;
        right: 0px;

      }

      .tooltip {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
      }
    }
  }

  .menu-container-short {
    position: absolute;
    //top: -44px;
    bottom: -10px;
    right: 15px;
    width: 200px;
    height: 200px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: start;
    //border-radius: 5px 0px 5px 5px;
    border: 1px solid hsl(50, 30%, 65%);
    box-shadow: 2px 1px 12px 0px hsla(0, 0%, 50%, 0.7);
    background-color: yellow;
    overflow: visible;
    z-index: 10;

   .menu-item-short {
    width: 100%;
    height: 30px;
    padding-left: 20px;
    padding-right: 20px;
    white-space: nowrap;
    cursor: pointer;
    color: black;
     background-color: yellow;
    border-bottom: 1px solid hsl(50, 30%, 65%);
    font-size: 12px;
    z-index: 15;
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background-color: hsl(50, 30%, 75%);
    }
  }
  }
}
</style>
