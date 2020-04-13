declare var navigator: any;
declare var window: any;
declare var setTimeout: any;
declare var clearTimeout: any;

/**
 * 设备信息
 */
const browser = {
  ua: (() => {
    if (!navigator) return { weChat: true };
    const u: any = navigator.userAgent;
    const isChrome = u.match(/Chrome\/([\d.]+)/) || u.match(/CriOS\/([\d.]+)/);
    const isAndroid = u.match(/(Android);?[\s\/]+([\d.]+)?/);
    const iosVersion = (function () {
      if (/iP(hone|od|ad)/.test(navigator.platform)) {
        const v: any = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [
          parseInt(v[1], 10),
          parseInt(v[2], 10),
          parseInt(v[3] || 0, 10),
        ];
      }
    })();
    const chromeVersion = (function () {
      const chrome = u.match(/Chrome\/(\d+)\./);
      if (chrome) {
        return parseInt(chrome[1], 10);
      }
    })();
    const ios9 = iosVersion && iosVersion[0] >= 9;
    const chrome18 =
      isChrome && isAndroid && chromeVersion && chromeVersion > 18;
    return {
      // 移动终端浏览器版本信息
      trident: u.indexOf("Trident") > -1, // IE内核
      presto: u.indexOf("Presto") > -1, // opera内核
      webKit: u.indexOf("AppleWebKit") > -1, // 苹果、谷歌内核
      gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") === -1, // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      iOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, // android终端或uc浏览器
      iPhone: u.indexOf("iPhone") > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf("iPad") > -1, // 是否iPad
      webApp: u.indexOf("Safari") === -1, // 是否web应该程序，没有头部与底部
      weChat: u.indexOf("MicroMessenger") > -1,
      UC: u.indexOf("UCBrowser") > -1,
      u3: u.indexOf("U3") > -1,
      chrome: u.indexOf("Chrome") > -1,
      windowsPhone: u.indexOf("Windows Phone") > -1,
      samsung: u.indexOf("Samsung") > -1,
      QQ:
        u.match(/\sQQ/i) != null
          ? u.match(/\sQQ/i).toLowerCase() === " qq"
          : false,
      isChrome: isChrome,
      isAndroid: isAndroid,
      iosVersion: iosVersion,
      chromeVersion: chromeVersion,
      ios9: ios9,
      chrome18: chrome18,
    };
  })(),
};

/**
 * 调用第三方地图api
 * @param data
 * 经纬度: lat lng
 * 地点名称 address
 */
const openMapApp: Function = (data: {
  lng: number;
  lat: number;
  address: string;
}) => {
  const { lng, lat, address } = data;
  const ua = browser.ua;
  // 地图uri api数组
  const uri = new Array();
  if (ua.weChat) {
    window.location.href = `https://uri.amap.com/marker?position=${lng},${lat}&name=${address}&src=Flow&coordinate=gaode&callnative=1`;
    return;
  } else if (ua.android) {
    // 百度地图uri api
    uri[0] = `bdapp://map/navi?location=${lat},${lng}&query=${address}`;
    // 高德地图uri api
    uri[1] = `androidamap://viewMap?sourceApplication=appname&poiname=${address}&lat=${lat}&lon=${lng}&dev=1&style=2`;
    // 腾讯地图uri api
    uri[2] = `qqmap://map/marker?marker=coord:${lat},${lng};title:${address}&referer=xlwx`;
  } else if (ua.iOS) {
    // 百度地图uri api
    uri[0] = `http://api.map.baidu.com/geocoder?location=${lat},${lng}&coord_type=gcj02&output=html&src=${window.location.host}`;
    // 高德地图uri api
    uri[1] = `https://uri.amap.com/marker?position=${lng},${lat}&name=${address}&src=Flow&coordinate=gaode&callnative=1`;
    // 腾讯地图uri api
    uri[2] = `qqmap://map/marker?marker=coord:${lat},${lng};title:${address}&referer=xlwx`;
    // 苹果地图uri api
    uri[3] = `http://maps.apple.com/?sll=${lat},${lng},&address=${address};`;
  }
  //调用uri
  if (uri.length === 0) {
    return;
  }
  window.location.href = uri[0];
  //启动定时器time1
  const time1 = setTimeout(function () {
    // 若启动应用，则js会被中断较长时间，超出此范围
    window.location.href = uri[1];
  }, 2000);
  //启动定时器time2
  const time2 = setTimeout(function () {
    // 若启动应用，则js会被中断较长时间，超出此范围
    window.location.href = uri[2];
  }, 4000);
  //清除定时器
  window.onbeforeunload = function () {
    if (time1 != null) {
      clearTimeout(time1);
    }
    if (time2 != null) {
      clearTimeout(time2);
    }
  };
  window.onpagehide = function () {
    if (time1 != null) {
      clearTimeout(time1);
    }
    if (time2 != null) {
      clearTimeout(time2);
    }
  };
  window.onblur = function () {
    if (time1 != null) {
      clearTimeout(time1);
    }
    if (time2 != null) {
      clearTimeout(time2);
    }
  };
};

/**
 * 深拷贝
 */
const deepClone: Function = (obj: any): any => {
  let t = obj ? new obj.constructor() : null;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (typeof obj !== "object") return obj;
  for (let key in obj) {
    t[key] = deepClone(obj[key]);
  }
  return t;
};

/**
 * * 获取两个坐标的距离
 * * 返回两点之间距离
 * @param lat1 坐标 latitude
 * @param lng1 坐标 longitude
 * @param lat2 目标 latitude
 * @param lng2 目标 longitude
 */
const getDistance: Function = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): string => {
  lat1 = lat1 || 0;
  lng1 = lng1 || 0;
  lat2 = lat2 || 0;
  lng2 = lng2 || 0;
  const rad1 = (lat1 * Math.PI) / 180.0;
  const rad2 = (lat2 * Math.PI) / 180.0;
  const a = rad1 - rad2;
  const b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
  const r = 6378137;
  return (
    r *
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)
      )
    )
  ).toFixed(0);
};

/**
 * 获取当前时间
 */
const getCurrentTime: Function = (): string => {
  //  补零
  const zeroFill = (i: number) => (i >= 0 && i <= 9 ? "0" + i : i);
  const date = new Date(); //当前时间
  const month = zeroFill(date.getMonth() + 1); //月
  const day = zeroFill(date.getDate()); //日
  const hour = zeroFill(date.getHours()); //时
  const minute = zeroFill(date.getMinutes()); //分
  const second = zeroFill(date.getSeconds()); //秒 //当前时间
  const curTime =
    date.getFullYear() +
    "-" +
    month +
    "-" +
    day +
    " " +
    hour +
    ":" +
    minute +
    ":" +
    second;
  return curTime;
};

/**
 *
 * @param hex hex转rbg
 * @param opacity 透明度
 */
const hex2Rgba: Function = (hex: string, opacity: number): string => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity || "1"})`;
};

export {
  browser,
  openMapApp,
  deepClone,
  getDistance,
  getCurrentTime,
  hex2Rgba,
};
