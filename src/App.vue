<template>
  <div id="app">
    <div class="test test--bg-scroll">
      <p v-for="index of 100">背景滚动测试{{index}}</p>
    </div>
    <Popup :show="showPopup0">
      <div class="popup popup--0 container--scrollable">
        <p v-for="index of 100">默认动画{{index}}</p>
      </div>
    </Popup>
    <Popup :show="showPopup1" tween="flop">
      <div class="popup popup--1 container--scrollable">
        <p v-for="index of 100">翻牌动画{{index}}</p>
      </div>
    </Popup>
    <Popup :show="showPopup2" tween="scale">
      <div class="popup popup--2 container--scrollable">
        <p v-for="index of 100">缩放动画{{index}}</p>
      </div>
    </Popup>
    <Popup :show="showPopup3" tween="bottom">
      <div class="popup popup--3 container--scrollable">
        <p v-for="index of 100">从下方出现动画{{index}}</p>
      </div>
    </Popup>
    <button @click="showPopup0 = !showPopup0" class="btn btn--0">默认</button>
    <button @click="showPopup1 = !showPopup1" class="btn btn--1">翻牌</button>
    <button @click="showPopup2 = !showPopup2" class="btn btn--2">缩放</button>
    <button @click="showPopup3 = !showPopup3" class="btn btn--3">从下方出现</button>
  </div>
</template>

<script>
import Popup from './components/Popup/Popup'

export default {
  name: 'App',
  components: {
    Popup
  },
  data() {
    return {
      showPopup0: false,
      showPopup1: false,
      showPopup2: false,
      showPopup3: false,
    }
  },
}
</script>

<style lang="scss" scoped>
$browser-default-font-size: 24px !default;
html {
  font-size: $browser-default-font-size;
}
@function px2rem( $px ){
  @return $px/$browser-default-font-size * 1rem;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: px2rem(60px);
}
.popup {
  width: px2rem(200px);
  padding: px2rem(10px) px2rem(50px);
  height: px2rem(200px);
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  background-color: #fff;
}

.btn {
  font-size: px2rem(24px);
  position: fixed;
  right: px2rem(10px);
  bottom: px2rem(60px);
  background: #aaa;
  color: #fff;
  z-index: 111111;
  &--0 {
    bottom: px2rem(200px);
  }
  &--1 {
    bottom: px2rem(140px);
  }
  &--2 {
    bottom: px2rem(80px);
  }
  &--3 {
    bottom: px2rem(20px);
  }
}
</style>
