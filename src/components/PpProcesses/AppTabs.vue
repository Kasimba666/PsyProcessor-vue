<template>
  <div class="AppTabs" :class="{'sm-wide': showDropdown}">
    <b-dropdown v-if="showDropdown" class="tab-dropdown" variant="tabs" :text="getCurrentTabName">
      <b-dropdown-item
          v-for="tab in tabsList"
          :key="tab.value"
          :class="{active: currentTab === tab.value}"
          @click="selectTab(tab.value)"
      >
        {{ tab.name }}
      </b-dropdown-item>
    </b-dropdown>

    <div v-else class="tab-panel">
      <div v-for="tab in tabsList" :key="tab.value" :class="['tab-button', {active: currentTab === tab.value}]" @click="selectTab(tab.value)">
        {{ tab.name }}
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'AppTabs',
  components: {},
  props: ['currentTab', 'tabsList', 'dropdownFrom'],
  model: {
    prop: 'currentTab',
    event: 'selectTab'
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(['screen', 'screenBreakpoints']),
    showDropdown() {
      if (!this.dropdownFrom) {
        return false;
      }

      return this.screenBreakpoints[this.dropdownFrom] > this.screen.width;
    },
    getCurrentTabName() {
        return this.tabsList.find(tab => tab.value === this.currentTab)?.name || '';
    },
  },
  methods: {
    selectTab(tab) {
      console.log('fromAppTabs', tab);
      this.$emit('selectTab', tab);
    },
  },
}
</script>

<style lang="scss">
@import "@/assets/css/bootstrap/bootstrap-mix.scss";
.AppTabs {
  width: auto;
  &.sm-wide {
    width: 100%;
  }
  .tab-panel {
    height: 42px;
    padding: 0 2px;
    border-radius: var(--main-border-radius);
    background-color: var(--root-tabs-bg);
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    color: var(--root-tabs-cl);
    text-align: center;
    gap: 2px;

    .tab-button {
      white-space: nowrap;
      padding: 0 16px;
      cursor: pointer;
      &.active {
        font-weight: bold;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        height: 38px;
        border-radius: var(--main-border-radius);
        background-color: var(--black);
        color: var(--secondary-cl);
        cursor: default;
        pointer-events: none;
      }
      &:hover:not(.active) {
        color: var(--secondary-cl);
      }
    }
  }
  .tab-dropdown {
    display: flex;
    border-radius: var(--main-border-radius);
    .btn {
      height: 40px;
      width: 100%;
      border-radius: var(--main-border-radius) !important;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;

      &:focus-visible {
        outline: none;
      }

      &-tabs, &-tabs.dropdown-toggle {
        border: solid 1px var(--root-tabs-dropdown-btn-border);
        background-color: var(--root-tabs-dropdown-btn-bg);
        color: var(--secondary-cl);
        font-weight: 600;

        &:not(:disabled):not(.disabled) {
          &:hover, &:active, &:active:hover {
            background-color: var(--root-tabs-dropdown-btn-bg);
            border-color: var(--root-tabs-dropdown-btn-border);
            color: var(--secondary-cl);
            cursor: pointer;
          }

          &:focus, &:active {
            background-color: var(--root-tabs-dropdown-btn-bg);
            border-color: var(--root-tabs-dropdown-btn-border);
            color: var(--secondary-cl);
            box-shadow: 0 0 0 1px var(--btn-boxshadow-in), 0 0 0 3px var(--btn-boxshadow-out);
          }

          &:active:hover {
            box-shadow: 0 0 0 1px var(--btn-boxshadow-in), 0 0 0 3px var(--btn-boxshadow-out);
          }
        }
      }
    }
    &.show .btn {
      border: solid 1px var(--secondary-cl);
    }
    .dropdown-menu {
      height: auto;
      max-height: 250px;
      overflow: auto;
      flex-flow: column nowrap;
      justify-content: center;
      color: var(--root-tabs-cl);
      padding: 13px 0;
      border-radius: var(--secondary-border-radius);
      border: transparent;
      background-color: var(--root-tabs-bg);
      list-style-type: none;
      width: 100%;
      margin-top: 3px;

      &:focus-visible {
        outline: none;
      }

      .dropdown-item {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
        color: var(--root-tabs-cl) !important;
        padding: 6px 12px;

        &:hover, &:focus {
          color: var(--secondary-cl) !important;
        }
      }

      .active .dropdown-item {
        color: var(--secondary-cl) !important;
        font-weight: 600;
        cursor: default;
      }
    }
  }
}
</style>
