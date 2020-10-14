# NoahsArk
[砍柴少侠｜少侠记](http://aboat.xyz/)

这是一个自己在开发web和Taro小程序时，经常用到的函数包。

#### 颜色处理 Color:
```
图片平均色
  colorfulImg(图片地址:string)
  return rgba(x,x,x,x)

hex转rbga
  hex2Rgba(hex:string, 透明度:number)
  return rbg(x,x,x,x||1)
```

#### dom:
```
拖动dom元素 - moveElement(触发拖动元素:Element, 被拖动元素:Element, 是否被移出屏幕:boolean)
```

#### utils:
```
设备信息  【不支持小程序】
  browser()
  return {iOS: true|false, android, iPhone, webKit, weChat, ...很多型号}

深拷贝 支持 Array Object Date RegExp 等常见数据类型
  deepClone(data)
  return data

计算经纬度之间的距离
  getDistance(lat1:number, lng1:number, lat2:number, lng2:number)
  return number

获取当前时间  （鸡肋，后面会重新写一个）
  getCurrentTime()
  return '年-月-日 时:分:秒'

base64转二进制
 base64Img2Blob(base64)
 return Blob
```

#### 第三方Api
```
调用第三方地图app打开目标地点，支持iOS和Android
  openMapApp(lng:number, lat:number, address:string)
  【高德地图、百度地图、腾讯地图】
  iOS系统会多一个【苹果地图】
```


