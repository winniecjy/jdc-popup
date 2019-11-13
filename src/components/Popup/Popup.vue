<template>
  <div class="popup-container">
    <!-- v-show会保留上次滚动状态 -->
    <transition :name="tween || 'fade'" appear>
      <div class="popup" v-if="show">
        <div class="popup__mask" :style="{
          background: maskColor || 'rgba(0,0,0,.3)'
        }"></div>
        <div class="popup__content-container">
          <div class="popup__content">
            <slot>empty</slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { PopupMixin } from '../../mixins/popup';
export default {
  name: 'Popup',
  mixins: [PopupMixin],
  props: {
    maskColor: String,
    tween: String,
  },
}
</script>


<style lang="scss" scoped>
.popup-container {
  position: relative;
}
.popup {
  overflow: hidden;
  transition: all .5s ease;

  &__mask {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    transition: all .5s ease;
  }
  &__content {
    &-container {
      overflow: hidden;
      -webkit-transform-style: preserve-3d;
      transform-style: preserve-3d;
      -webkit-perspective: 2200px;
      perspective: 2200px;
      overflow: hidden;
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0; 
      left: 0;
    }
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    transition: all .5s ease;
  }
}
.popup-container .popup {
  $tweenMap: (
    fade: true,
    flop: true,
    bottom: true,
    top: true,
    left: true,
    right: true,
    scale: true,
  );
  @each $key, $value in $tweenMap {
    .#{$key}-enter-active, .#{$key}-leave-active {
      transition: all .5s ease;
    }
  }
  $opacityMap: (
    fade: true,
    bottom: true,
    top: true,
    left: true,
    right: true,
  );
  @each $key, $value in $opacityMap {
    .#{$key}-enter, .#{$key}-leave-to {
      opacity: 0;
    }
  }
  .flop-enter-active .popup__content {
    animation: flop .5s ease;
    animation-iteration-count: 1;
  }
  .flop-leave-active .popup__content {
    animation: flop .5s ease reverse;
    animation-iteration-count: 1;
  }
  @keyframes flop {
    0% {
      transform: translate3d(-50%, -50%, 0) rotateY(-90deg);
    }
    100% {
      transform: translate3d(-50%, -50%, 0) rotateY(0deg);
    }
  }
  .bottom-enter .popup__content, .bottom-leave-to .popup__content {
    top: 100%;
    transform: translate(-50%, -100%);
  }
  .top-enter .popup__content, .top-leave-to .popup__content {
    top: 0;
    transform: translate(-50%, 0);
  }
  .left-enter .popup__content, .left-leave-to .popup__content {
    left: 0%;
    transform: translate(0%, -50%);
  }
  .right-enter .popup__content, .right-leave-to .popup__content {
    left: 100%;
    transform: translate(-100%, -50%);
  }
  .scale-enter-active .popup__content {
    animation: scaleAnim .5s ease;
    animation-iteration-count: 1;
  }
  .scale-leave-active .popup__content {
    animation: scaleAnim .5s ease reverse;
    animation-iteration-count: 1;
  }
  @keyframes scaleAnim {
    0% {
      transform: translate(-50%, -50%) scale(0);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.5);
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
    }
  }
}
</style>
<style lang="scss">
.overflow-hidden {
  overflow: hidden;
}
</style>