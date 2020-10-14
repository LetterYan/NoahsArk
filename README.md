# NoahsArk

#### [砍柴少侠｜少侠记](http://aboat.xyz/)

#### [NPM 地址](https://www.npmjs.com/package/noahsark)

这是一个自己在开发 web 和 Taro 小程序时，经常用到的函数包。为了方便复用。封装成了 NPM 包

#### 颜色处理 Color:

```
图片平均色
  colorfulImg(图片地址:string)
  # return rgba(x,x,x,x)

hex转rbga
  hex2Rgba(hex:string, 透明度:number)
  # return rbg(x,x,x,x||1)
```

#### dom:

```
拖动dom元素
  moveElement(触发拖动元素:Element, 被拖动元素:Element, 是否被移出屏幕:boolean)
```

#### utils:

```
设备信息【不支持小程序】
  browser()
  return {iOS: true|false, android, iPhone, webKit, weChat, ...很多型号}

深拷贝 支持 Array Object Date RegExp 等常见数据类型
  deepClone(data)
  # return data

计算经纬度之间的距离
  getDistance(lat1:number, lng1:number, lat2:number, lng2:number)
  # return number

获取当前时间（鸡肋，用dateFormat）
  getCurrentTime()
  # return '年-月-日 时:分:秒'

格式化时间
  例如 dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss.S"） ==> 2020-07-02 08:09:04.423
  dateFormat(Date, 格式)
  # return 'x-x-x 时:分:秒'

base64转二进制
  base64Img2Blob(base64)
  # return Blob

数组分割
  groupArray(array, size)
  # return [[],[]]

对比两个对象是否一样
  deepEqual(obj, obj)
  # return boolean
```

#### 第三方 Api

```
调用第三方地图app打开目标地点，支持iOS和Android
  openMapApp(lng:number, lat:number, address:string)
  # 会调用其中一个App【高德地图、百度地图、腾讯地图】
  # iOS系统会多一个【苹果地图】
```
