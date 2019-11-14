<template>
  <div class="jdc-popup-container">
    <!-- v-show会保留上次滚动状态 -->
    <transition :name="tween || ''" :duration="500">
      <div class="jdc-popup" v-show="show">
        <div class="jdc-popup__mask" :style="{
          background: maskColor || 'rgba(0,0,0,.3)'
        }"></div>
        <div class="jdc-popup__content-container">
          <div class="jdc-popup__content" ref="popupContent">
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
.jdc-popup-container {
  position: relative;
}
.jdc-popup {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  &__mask {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
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
    transform: translate(-50%, -50%) scale(1) rotateY(0deg);
  }
}
</style>
<style lang="scss">
.overflow-hidden {
  overflow: hidden;
}
$tweenMap: (
  fade: true,
  flop: true,
  bottom: true,
  top: true,
  left: true,
  right: true,
  bounce: true,
);
@each $key, $value in $tweenMap {
  .#{$key}-enter-active .jdc-popup__content, .#{$key}-leave-active .jdc-popup__content {
    transition: all .5s ease;
  }
}
$fatherTransMap: (
  fade: true,
  flop: true,
  bottom: true,
  top: true,
  left: true,
  right: true,
  bounce: true,
);
@each $key, $value in $tweenMap {
  .#{$key}-enter-active .jdc-popup__content, .#{$key}-leave-active .jdc-popup__content {
    transition: all .5s ease;
  }
  .#{$key}-enter-active, .#{$key}-leave-active {
    transition: all .5s ease;
  }
  .#{$key}-enter, .#{$key}-leave-to, .#{$key}-leave-active {
    opacity: 0;
  }
}

.bottom-enter .jdc-popup__content, .bottom-leave-to .jdc-popup__content, .bottom-leave-active .jdc-popup__content {
  top: 100%;
  transform: translate(-50%, -100%);
}
.top-enter .jdc-popup__content, .top-leave-to .jdc-popup__content, .top-leave-active .jdc-popup__content {
  top: 0;
  transform: translate(-50%, 0);
}
.left-enter .jdc-popup__content, .left-leave-to .jdc-popup__content, .left-leave-active .jdc-popup__content {
  left: 0%;
  transform: translate(0%, -50%);
}
.right-enter .jdc-popup__content, .right-leave-to .jdc-popup__content, .right-leave-active .jdc-popup__content {
  left: 100%;
  transform: translate(-100%, -50%);
}
.bounce-enter .jdc-popup__content, .bounce-leave-to .jdc-popup__content, .bounce-leave-active .jdc-popup__content {
  transform: translate(-50%, -50%) scale(1.5) rotateY(0deg);
}
.flop-enter .jdc-popup__content, .flop-leave-to .jdc-popup__content, .flop-leave-active .jdc-popup__content {
  transform: translate(-50%, -50%) scale(1) rotateY(-90deg);
}
</style>