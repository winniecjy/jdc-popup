/**
 * touch
 * author: Cai Jieying
 */

import Vue from 'vue';

const MIN_DISTANCE = 10;

function getDirection(x, y) {
  if (x > y && x > MIN_DISTANCE) {
    return 'horizontal';
  }

  if (y > x && y > MIN_DISTANCE) {
    return 'vertical';
  }

  return '';
}

export const TouchMixin = Vue.extend({
  data() {
    return {
      /**
       * 记录一次touch过程中的参数
       */
      direction: '', // '' | 'vertical' | 'horizontal'
      startX: 0, 
      startY: 0,
      deltaX: 0,
      deltaY: 0,
      offsetX: 0,
      offsetY: 0,
    }
  },

  methods: {
    touchStart(event) {
      this._resetTouchStatus();
      this.startX = event.touches[0].clientX || event.targetTouches[0].clientX;
      this.startY = event.touches[0].clientY || event.targetTouches[0].clientY;
    },

    touchMove(event) {
      const touch = event.touches[0] || event.targetTouches[0];
      this.deltaX = touch.clientX - this.startX;
      this.deltaY = touch.clientY - this.startY;
      this.offsetX = Math.abs(this.deltaX);
      this.offsetY = Math.abs(this.deltaY);
      this.direction = this.direction || getDirection(this.offsetX, this.offsetY);
    },

    _resetTouchStatus() {
      this.direction = '';
      this.startX = 0;
      this.startY = 0;
      this.deltaX = 0;
      this.deltaY = 0;
      this.offsetX = 0;
      this.offsetY = 0;
    }
  },
})