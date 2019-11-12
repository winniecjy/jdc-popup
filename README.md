# simple-vue-popup

封装的弹窗组件，实现功能：   
- [x] 解决滑动穿透（背景滚动）问题
- [x] 新弹窗永远在旧弹窗之上
- [x] 出现/消失过渡动画

## 参数说明

参数 | 描述 | 可选值 | 默认值    
-|-|-|-    
show | 是否显示弹窗 | true/false | false |  
lockScroll | 禁止背景滚动 | true/false | true |   
maskColor | 蒙层颜色 | string[background值] | rgba(0,0,0,.3) |  
tween | 弹窗动画 | fade[淡入淡出]/flop[翻牌]]/scale[缩放]/bottom[从下方出现]/top[从上方出现]/left[从左侧出现]/right[从右侧出现] | fade |   

## 使用示例
```html
<!-- 对于内部需要滚动的元素，需要添加类名container--scrollable -->
<Popup :show="showPopup" tween="bottom">
  <div class="popup container--scrollable">
    <p v-for="index of 100">弹窗内容{{index}}</p>
  </div>
</Popup>
```

