declare var window: any;
declare var setTimeout: any;
declare var clearTimeout: any;
import { browser } from "./index";

/**
 * 调用第三方地图api
 * @param data
 * 经纬度: lat lng
 * 地点名称 address
 */
export const openMapApp: Function = (data: {
  lng: number;
  lat: number;
  address: string;
}) => {
  const { lng, lat, address } = data;
  // 地图uri api数组
  const uri = new Array();
  if (browser.weChat) {
    window.location.href = `https://uri.amap.com/marker?position=${lng},${lat}&name=${address}&src=Flow&coordinate=gaode&callnative=1`;
    return;
  } else if (browser.android) {
    // 百度地图uri api
    uri[0] = `bdapp://map/navi?location=${lat},${lng}&query=${address}`;
    // 高德地图uri api
    uri[1] = `androidamap://viewMap?sourceApplication=appname&poiname=${address}&lat=${lat}&lon=${lng}&dev=1&style=2`;
    // 腾讯地图uri api
    uri[2] = `qqmap://map/marker?marker=coord:${lat},${lng};title:${address}&referer=xlwx`;
  } else if (browser.iOS) {
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
