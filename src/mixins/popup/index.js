import { TouchMixin } from '../touch';
import { passiveSupported } from '../event';
import { detectOS } from '../env';
import context from './context';

// 蒙层类名
const MASK_CLASS = ['jdc-popup__mask'];
// 内容层级
const CONTENT_CONTAINER_CLASS = ['jdc-popup__content-container'];
// // 需要滚动的元素类名
const NEED_SCROLL_CLASS = 'jdc-popup-scroll';
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
        // 蒙层层级
        for(let arrIndex=0; arrIndex<MASK_CLASS.length; arrIndex++) {
          this.maskEle = this._getChildren(this.$el, MASK_CLASS[arrIndex]) || [];
          for (let i = 0; i < this.maskEle.length; i++) {
            const el = this.maskEle[i];
            el.style.zIndex = this.$el.style.zIndex - 1;
          }
        }
        // 内容层级
        for (let arrIndex=0; arrIndex<CONTENT_CONTAINER_CLASS.length; arrIndex++) {
          this.contentEle = this._getChildren(this.$el, CONTENT_CONTAINER_CLASS[arrIndex]) || [];
          for (let i = 0; i < this.contentEle.length; i++) {
            const el = this.contentEle[i];
            el.style.zIndex = this.$el.style.zIndex;
          }
        }      
        // 不可滚动元素处理
        this.preventAll(this.$el);

        // 可滚动元素滚动处理
        this.scrollEle = this._getChildren(this.$el, NEED_SCROLL_CLASS) || [];
        for (let i = 0; i < this.scrollEle.length; i++) {
          const el = this.scrollEle[i];
          el.style.overscrollBehavior = 'contain';
          el.addEventListener('touchstart', this.touchStart, passiveSupported ? {
            passive: false,
            capture: false
          } : true);
          this._removeListener.push(this._addListener(el, 'touchmove', this.onTouchMove, el));
        }

        if (context.lockCount<=0) {
          // pc处理
          document.body.classList.add('overflow-hidden');
          // android处理
          if(detectOS().android) {
            this._androidUnlock = this.setOverflowHiddenMobile()
          }
        }
        this.opened = true;

        context.lockCount++;
      }
    },
    close() {
      if (!this.opened) return;
      this.opened = false;
      if (this.lockScroll) {
        // 不可滚动元素处理
        this.removePreventAll(this.$el);
        // 可滚动元素处理
        for(let i=0; i<this.scrollEle.length; i++) {
          let el = this.scrollEle[i];
          el.style.overscrollBehavior = 'auto';
          el.removeEventListener('touchstart', this.touchStart, passiveSupported ? {
            capture: false
          } : true);
          this._removeListener[i]();
        }
        this._removeListener = [];
        context.lockCount--;
        if (context.lockCount<=0) {
          document.body.classList.remove('overflow-hidden');
          // android处理
          if(detectOS().android && this._androidUnlock) {
            this._androidUnlock()
          }
        }
      }
    },
    onTouchMove(event, el) {
      event.stopPropagation();
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
        } = targetElement;
        // 向上滚动时 且 已经到达顶部
        const isOnTop = this.deltaY > 0 && scrollTop <= 1;

        // 当向下滚动 且 已经到达底部
        const isOnBottom = this.deltaY < 0 && scrollTop + clientHeight + 1 >= scrollHeight;

        if (isOnTop || isOnBottom) {
          event.cancelable && event.preventDefault();
        }
      }

      return true;
    },
    preventAll(parentEl) {
      let nodeArr = [];
      [...parentEl.children].forEach((el) => {
        let needPrevent = false;
        let classes = el.className.split(' ');
        for (let i=0; i<classes.length; i++) {
          if (classes[i] === NEED_SCROLL_CLASS) needPrevent = true;
        }
        if (!needPrevent) {
          el.addEventListener('touchmove', this.prevent, passiveSupported ? {
            passive: false,
            capture: false
          } : false);
          nodeArr = nodeArr.concat(this.preventAll(el));
        }
      })
      return nodeArr;
    },
    removePreventAll(parentEl) {
      let nodeArr = [];
      [...parentEl.children].forEach((el) => {
        let needPrevent = false;
        let classes = el.className.split(' ');
        for (let i=0; i<classes.length; i++) {
          if (classes[i] === NEED_SCROLL_CLASS) needPrevent = true;
        }
        if (!needPrevent) {
          el.removeEventListener('touchmove', this.prevent, passiveSupported ? {
            capture: false
          } : false);
          nodeArr = nodeArr.concat(this.preventAll(el));
        }
      })
      return nodeArr;
    },
    setOverflowHiddenMobile() {
      const $html = document.documentElement
      const $body = document.body
      const scrollTop = $html.scrollTop || $body.scrollTop
      const htmlStyle = { ...$html.style }
      const bodyStyle = { ...$body.style }
  
      $html.style.height = '100%'
      $html.style.overflow = 'hidden'
  
      $body.style.top = `-${scrollTop}px`
      $body.style.width = '100%'
      $body.style.height = 'auto'
      $body.style.position = 'fixed'
      $body.style.overflow = 'hidden'
  
      return () => {
          $html.style.height = htmlStyle.height || ''
          $html.style.overflow = htmlStyle.overflow || ''
  
          ;['top', 'width', 'height', 'overflow', 'position'].forEach((x) => {
              $body.style[x] = bodyStyle[x] || ''
          })
  
          window.scrollTo(0, scrollTop)
      }
    },
    prevent(event) {
      event.stopPropagation();
      event.cancelable && event.preventDefault();
      return false;
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
    /**
     * 带参可remove事件监听器
     * 
     * @param {*} dom 
     * @param {*} eventType 
     * @param {*} callback 
     * @param  {...any} args 
     */
    _addListener(dom, eventType, callback, ...args) {
      function handleTarget(event) {
        if (args) callback(event, ...args);
        else callback(event);
      }
      dom.addEventListener(eventType, handleTarget, passiveSupported ? {
        passive: false,
        capture: false
      } : false);
      return function destroy() {
        dom.removeEventListener(eventType, handleTarget, passiveSupported ? {
          capture: false
        } : false);
      }
    }
  },
}