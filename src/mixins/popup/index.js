import { TouchMixin } from '../touch';
import context from './context';

// 半透明背景层类名
const MASK_CLASS = 'popup__mask';
const CONTENT_CONTAINER_CLASS = 'popup__content-container';
// 需要滚动的元素类名
const NEED_SCROLL_CLASS = 'container--scrollable';
export const PopupMixin = {
  mixins: [TouchMixin],
  props: {
    // 是否显示
    show: {
      type: Boolean,
      default: true
    },
    // 禁止背景滚动
    lockScroll: {
      type: Boolean,
      default: true
    },
  },

  mounted() {
    if (this.show) {
      this.$nextTick(function() {
        // 设置层级
        this.$el.style.zIndex = context.zIndex+2;
        context.zIndex += 2;
        this.open();
      });
    }
    this._removeListener = [];
  },
  beforeDestroy() {
    this.close();
  },

  watch: {
    show() {
      if (this.show) {
        this.$nextTick(function() {
          // 设置层级
          this.$el.style.zIndex = context.zIndex+2;
          context.zIndex += 2;
          this.open();
        });
      } else {
        this.close();
      }
    }
  },

  methods: {
    open() {
      if (this.opened) return;
      if (this.lockScroll) {
        // 蒙层禁止滚动
        this.maskEle = this._getChildren(this.$el, MASK_CLASS) || [];
        for (let i = 0; i < this.maskEle.length; i++) {
          const el = this.maskEle[i];
          // 翻牌bug: 蒙层层级需低于内容
          el.style.zIndex = this.$el.style.zIndex - 1;
          el.addEventListener('touchmove', this.preventDefault, {
            passive: false
          }, false);
        }
        // 设置内容层级
        this.contentEle = this._getChildren(this.$el, CONTENT_CONTAINER_CLASS) || [];
        for (let i = 0; i < this.contentEle.length; i++) {
          const el = this.contentEle[i];
          // 翻牌bug: 蒙层层级需低于内容
          el.style.zIndex = this.$el.style.zIndex;
          el.addEventListener('touchmove', this.preventDefault, {
            passive: false
          }, false);
        }
        // 可滚动元素滚动处理
        this.scrollEle = this._getChildren(this.$el, NEED_SCROLL_CLASS) || [];
        for (let i = 0; i < this.scrollEle.length; i++) {
          const el = this.scrollEle[i];
          el.addEventListener('touchstart', this.touchStart, {
            passive: false
          }, false);
          this._removeListener.push(this._addListener(el, 'touchmove', this.onTouchMove, el));
        }

        // pc处理
        document.body.classList.add('overflow-hidden');

        this.opened = true;

        context.lockCount++;
      }
    },
    close() {
      if (!this.opened) return;
      this.opened = false;
      if (this.lockScroll) {
        for(let i=0; i<this.maskEle.length; i++) {
          let el = this.maskEle[i];
          el.removeEventListener('touchmove', this.preventDefault, {
            passive: false
          }, false);
        }
        for (let i = 0; i < this.contentEle.length; i++) {
          const el = this.contentEle[i];
          el.removeEventListener('touchmove', this.preventDefault, {
            passive: false
          }, false);
        }
        for(let i=0; i<this.scrollEle.length; i++) {
          let el = this.scrollEle[i];
          el.removeEventListener('touchstart', this.touchStart, {
            passive: false
          }, false);
          this._removeListener[i]();
        }
        this._removeListener = [];
        context.lockCount--;
        if (context.lockCount<=0) {
          document.body.classList.remove('overflow-hidden');
        }
      }
    },
    onTouchMove(event, el) {
      console.log(el, event)
      this.touchMove(event);
      if (event.targetTouches.length !== 1) return;
      
      // 手动处理滚动
      this.handleScroll(event, el);
    },
    handleScroll(event, targetElement) {
      
      if (targetElement) {
        const {
          scrollTop,
          scrollHeight,
          clientHeight
        } = targetElement
        // 向上滚动时 且 已经到达顶部
        const isOnTop = this.deltaY > 0 && scrollTop === 0

        // 当向下滚动 且 已经到达底部
        const isOnBottom = this.deltaY < 0 && scrollTop + clientHeight + 1 >= scrollHeight

        if (isOnTop || isOnBottom) {
          this.preventDefault(event)
        }
      }

      event.stopPropagation()
      return true
    },
    preventDefault(event) {
      if (!event.cancelable) return;
      event.preventDefault();
    },
    _getChildren(parentEl, className) {
      let nodeArr = [];
      [...parentEl.children].forEach((el) => {
        let classes = el.className.split(' ');
        for (let i=0; i<classes.length; i++) {
          if (classes[i] === className) {
            nodeArr.push(el);
            break;
          }
        }
        nodeArr = nodeArr.concat(this._getChildren(el, className));
      });
      return nodeArr;
    },
    _addListener(dom, eventType, callback, ...args) {
      function handleTarget(event) {
        if (args) callback(event, ...args);
        else callback(event);
      }
      dom.addEventListener(eventType, handleTarget, {
        passive: false
      }, false);
      return function destroy() {
        dom.removeEventListener(eventType, handleTarget, {
          passive: false
        }, false);
      }
    }
  },
}