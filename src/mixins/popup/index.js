import { TouchMixin } from '../touch';
import context from './context';

// 蒙层类名
const MASK_CLASS = ['jdc-popup__mask'];
// 内容层级
const CONTENT_CONTAINER_CLASS = ['jdc-popup__content-container'];
// 需要禁止滚动的层
const NEED_PREVENT_TOUCH = ['jdc-popup', 'jdc-popup__mask', 'jdc-popup__content-container', 'jdc-popup__content'];
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
        for(let arrIndex=0; arrIndex<MASK_CLASS.length; arrIndex++) {
          this.maskEle = this._getChildren(this.$el, MASK_CLASS[arrIndex]) || [];
          for (let i = 0; i < this.maskEle.length; i++) {
            const el = this.maskEle[i];
            el.style.zIndex = this.$el.style.zIndex - 1;
          }
        }
        // 设置内容层级
        for (let arrIndex=0; arrIndex<CONTENT_CONTAINER_CLASS.length; arrIndex++) {
          this.contentEle = this._getChildren(this.$el, CONTENT_CONTAINER_CLASS[arrIndex]) || [];
          for (let i = 0; i < this.contentEle.length; i++) {
            const el = this.contentEle[i];
            el.style.zIndex = this.$el.style.zIndex;
          }
        }      
        // 不可滚动元素处理
        for (let arrIndex=0; arrIndex<NEED_PREVENT_TOUCH.length; arrIndex++) {
          this.preventEle = this._getChildren(this.$el, NEED_PREVENT_TOUCH[arrIndex]) || [];
          for (let i = 0; i < this.preventEle.length; i++) {
            const el = this.preventEle[i];
            el.addEventListener('touchmove', this.preventDefault, {
              passive: false
            }, false);
          }
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
        // 不可滚动元素处理
        for (let arrIndex=0; arrIndex<NEED_PREVENT_TOUCH.length; arrIndex++) {
          this.preventEle = this._getChildren(this.$el, NEED_PREVENT_TOUCH[arrIndex]) || [];
          for (let i = 0; i < this.preventEle.length; i++) {
            const el = this.preventEle[i];
            el.removeEventListener('touchmove', this.preventDefault, {
              passive: false
            }, false);
          }
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