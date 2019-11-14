# simple-vue-popup
> vue版本：vue2.1.8+   

封装的弹窗组件，目前实现功能：   
- [x] 解决滑动穿透（背景滚动）问题
- [x] 新弹窗永远在旧弹窗之上
- [x] 出现/消失过渡动画

## demo体验地址
https://jinglecjy.github.io/simple-vue-popup/demo/    
![demo地址](https://img12.360buyimg.com/imagetools/s200x200_jfs/t1/68885/4/15183/22208/5dcab88aEa322abec/636120af710f2c55.png)

## 安装
```javascript
npm install simple-vue-popup -S
```
## 快速使用
```html
import Popup from 'simple-vue-popup'


<!-- 对于内部需要滚动的元素，需要添加类名container--scrollable -->
<Popup :show="showPopup" tween="bottom">
  <div class="popup container--scrollable">
    <p v-for="index of 100">弹窗内容{{index}}</p>
  </div>
</Popup>
```

## 参数说明

参数 | 描述 | 可选值 | 默认值    
-|-|-|-    
show | 是否显示弹窗 | true \| false | false |  
lockScroll | 禁止背景滚动 | true \| false | true |   
maskColor | 蒙层颜色 | string | rgba(0,0,0,.3) |  
tween | 弹窗过渡动画 | fade：淡入淡出<br/>flop：翻牌<br/>scale：缩放<br/>bottom：从下方出现<br/>top：从上方出现<br/>left：从左侧出现<br/>right：从右侧出现 | 无过渡 |   


## 兼容性
- PC
- Android 4.4+   
- iOS     8+

## 版本信息
- 1.0.0
  - [x] 解决滑动穿透（背景滚动）问题
  - [x] 新弹窗永远在旧弹窗之上
  - [x] 出现/消失过渡动画


有任何问题欢迎issue~   