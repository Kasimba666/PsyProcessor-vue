<template>
    <div class="ppSidePanel"
         @click.stop
    >
        <div class="for-touch" :class="{'opened': isOpened}" v-if="isTouchDevice"
             @touchstart="handleTouchStart"
             @touchmove="handleTouchMove"
             @touchend="handleTouchEnd"
        >
        </div>

        <div class="panel" :class="{'opened': isOpened}"
        >
            <slot></slot>
            <div class="toggle-side-panel" :class="{'opened': isOpened}"
                 @click.stop="onToggleClick()">
                <i
                        v-if="isOpened"
                        class="ico ico-circle-left"
                ></i>
                <i
                        v-else
                        class="ico  ico-circle-right"
                ></i>
            </div>
        </div>
    </div>
    <div class="overlay-side-panel" :class="{'opened': isOpened}"
         @click="onOverlay"
    >
    </div>
</template>

<script>
export default {
    components: {},
    props: ['isOpened', 'isTouchDevice'],
    emits: ['update:isOpened'],
    data() {
        return {
            touchStartX: 0,
            touchEndX: 0,
        }
    },

    computed: {},
    methods: {
        handleTouchStart(event) {
            console.log('TouchStart');
            this.touchStartX = event.changedTouches[0].screenX;
            this.touchEndX = event.changedTouches[0].screenX;
        },

        handleTouchMove(event) {
            console.log('TouchMove');
            this.touchEndX = event.changedTouches[0].screenX;

        },

        handleTouchEnd() {
            console.log('TouchEnd');
            if (this.touchStartX - this.touchEndX >= 0) {
                this.$emit('update:isOpened', false);
            } else if (this.touchEndX - this.touchStartX > 10) {
                this.$emit('update:isOpened', true);
            }
        },
        onToggleClick() {
            console.log('onToggleClick');
            this.$emit('update:isOpened', !this.isOpened);
        },
        onOverlay() {
            console.log('onClickOverlay');
            this.$emit('update:isOpened', false);
        },

    },
    mounted() {
    },
}
</script>

<style lang="scss">
.ppSidePanel {
  //z-index: 5;
  .for-touch {
      position: fixed;
      top: 0px;
      width: 100%;
      right: calc(100% - 30px);
      height: 100dvh;
      //background-color: hsla(216, 100%, 95%, 50%);
      z-index: 5;
      &.opened {
        transform: translateX(100%);
      }
  }
  .panel {
    position: fixed;
    right: 100%;
    top: 0px;
    width: auto;
    height: 100dvh;
    display: flex;
    flex-flow: row nowrap;
    justify-content: start;
    align-items: center;
    gap: 0px;
    transition: all 0.5s ease;
    box-shadow: 2px 0px 6px 2px hsla(0, 0%, 0%, 0.02);
    z-index: 20;

    &.opened {
      transform: translateX(100%);
      box-shadow: 2px 0px 6px 2px hsla(0, 0%, 0%, 0.2);
    }
  }

  .toggle-side-panel {
    position: absolute;
    left: 100%;
    top: calc(100dvh / 2.5 - 30px);
    height: 90px;
    width: 21px;
    color: black;
    background-color: hsla(0, 0%, 95%, 0.85);
    border-left: none;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    border-radius: 0 10px 10px 0px;
    overflow-x: hidden;
    //box-shadow: 2px 1px 12px 0px hsla(0, 0%, 50%, 0.7);
    box-shadow: 2px 2px 4px 2px hsla(0, 0%, 0%, 0.25);
    transition: all 0.8s ease;
    cursor: pointer;
    z-index: 20;

    &:hover {
      color: black;
      background-color: hsla(84, 80%, 70%, 0.9);
      transition: all 0.2s ease;
    }

    &:active {
      background-color: hsla(84, 80%, 60%, 0.9);
      //box-shadow: 1px 0px 12px 0px hsla(0, 0%, 50%, 0.7);
      box-shadow: 2px 2px 8px 2px hsla(0, 0%, 0%, 0.4);
      transform: translate(1px, 1px);
    }
  }

  .overlay-side-panel {
    position: fixed;
    right: 100%;
    top: 0px;
    height: 100dvh;
    width: 100%;
    z-index: 5;
    transition: all 0.3s ease;
    pointer-events: none;

    &.opened {
      background-color: hsla(0, 0%, 0%, 0.2);
      backdrop-filter: blur(2px);
      pointer-events: all;
      transform: translateX(100%);
    }
  }
}
</style>
