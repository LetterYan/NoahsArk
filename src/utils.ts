declare var navigator: any;
declare var window: any;
declare var Blob: any;
declare var global: any;

/** 判断当前环境设备 */
export const browser = (() => {
	if (global) {
		return { nodejs: true };
	}
	const u: any = navigator.userAgent;
	const isChrome = u.match(/Chrome\/([\d.]+)/) || u.match(/CriOS\/([\d.]+)/);
	const isAndroid = u.match(/(Android);?[\s/]+([\d.]+)?/);
	const iosVersion = (function () {
		if (/iP(hone|od|ad)/.test(navigator.platform)) {
			const v: any = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
			return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
		}
	})();
	const chromeVersion = (function () {
		const chrome = u.match(/Chrome\/(\d+)\./);
		if (chrome) {
			return parseInt(chrome[1], 10);
		}
	})();
	const ios9 = iosVersion && iosVersion[0] >= 9;
	const chrome18 = isChrome && isAndroid && chromeVersion && chromeVersion > 18;
	return {
		// 移动终端浏览器版本信息
		trident: u.indexOf('Trident') > -1, // IE内核
		presto: u.indexOf('Presto') > -1, // opera内核
		webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
		gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
		mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
		iOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
		android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
		iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
		iPad: u.indexOf('iPad') > -1, // 是否iPad
		webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
		weChat: u.indexOf('MicroMessenger') > -1,
		UC: u.indexOf('UCBrowser') > -1,
		u3: u.indexOf('U3') > -1,
		chrome: u.indexOf('Chrome') > -1,
		windowsPhone: u.indexOf('Windows Phone') > -1,
		samsung: u.indexOf('Samsung') > -1,
		QQ:
			u.match(/\sQQ/i) != null
				? u.match(/\sQQ/i).toLowerCase() === ' qq'
				: false,
		isChrome: isChrome,
		isAndroid: isAndroid,
		iosVersion: iosVersion,
		chromeVersion: chromeVersion,
		ios9: ios9,
		chrome18: chrome18,
	};
})();

/**	深拷贝
 * @param obj 需要拷贝的数据
 */
export const deepClone: Function = (obj: any): any => {
	let t = obj ? new obj.constructor() : null;
	if (obj instanceof Date) return new Date(obj);
	if (obj instanceof RegExp) return new RegExp(obj);
	if (typeof obj !== 'object') return obj;
	for (let key in obj) {
		t[key] = deepClone(obj[key]);
	}
	return t;
};

/** 通过两个坐标计算两点之间距离
 * @param lat1 坐标1 latitude
 * @param lng1 坐标1 longitude
 * @param lat2 坐标2 latitude
 * @param lng2 坐标2 longitude
 */
export const getDistance: Function = (
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

/**	获取当前时间 */
export const getCurrentTime: Function = (): string => {
	//  补零
	const zeroFill = (i: number) => (i >= 0 && i <= 9 ? '0' + i : i);
	const date = new Date(); //当前时间
	const month = zeroFill(date.getMonth() + 1); //月
	const day = zeroFill(date.getDate()); //日
	const hour = zeroFill(date.getHours()); //时
	const minute = zeroFill(date.getMinutes()); //分
	const second = zeroFill(date.getSeconds()); //秒 //当前时间
	const curTime =
		date.getFullYear() +
		'-' +
		month +
		'-' +
		day +
		' ' +
		hour +
		':' +
		minute +
		':' +
		second;
	return curTime;
};

/**	base64转二进制
 * @param code base64
 */
export const base64Img2Blob = (code: any) => {
	var parts = code.split(';base64,');
	var contentType = parts[0].split(':')[1];
	var raw = window.atob(parts[1]);
	var rawLength = raw.length;
	var uInt8Array = new Uint8Array(rawLength);
	for (var i = 0; i < rawLength; ++i) {
		uInt8Array[i] = raw.charCodeAt(i);
	}

	return new Blob([uInt8Array], { type: contentType });
};

/**	分割数组
 * @param array 原数组
 * @param size 切割多少个为一组
 */
export const groupArray = (array = [], size = 0) => {
	//获取数组的长度，如果你传入的不是数组，那么获取到的就是undefined
	const length = array.length;
	//判断不是数组，或者size没有设置，size小于1，就返回空数组
	if (!length || !size || size < 1) {
		return [];
	}
	let index = 0; //用来表示切割元素的范围start
	let resIndex = 0; //用来递增表示输出数组的下标
	//根据length和size算出输出数组的长度，并且创建它。
	const num = Math.ceil(length / size);
	let result = new Array(num);
	//进行循环
	while (index < length) {
		//循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
		result[resIndex++] = array.slice(index, (index += size));
	}
	return result;
};

/**	判断两个对象是否一样
 * @param x 对象
 * @param y 对象
 */
export const deepEqual = function (x: any, y: any) {
	// 指向同一内存时
	if (x === y) {
		return true;
	} else if (
		typeof x == 'object' &&
		x != null &&
		typeof y == 'object' &&
		y != null
	) {
		if (Object.keys(x).length != Object.keys(y).length) return false;

		for (var prop in x) {
			if (y.hasOwnProperty(prop)) {
				if (!deepEqual(x[prop], y[prop])) return false;
			} else return false;
		}

		return true;
	} else return false;
};

/**	将 Date 转化为指定格式的String
 * @param date	日期，Date类型
 * @param fmt		格式，例如"yyyy-MM-dd hh:mm:ss.S"，或者中文
 * 
 * @example
 * ```
	月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
	年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
	例子：
	dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss.S"） ==> 2006-07-02 08:09:04.423
 * ```
 */
export const dateFormat = (date: Date, fmt: string) => {
	const o: any = {
		'M+': date.getMonth() + 1, //月份
		'd+': date.getDate(), //日
		'h+': date.getHours(), //小时
		'm+': date.getMinutes(), //分
		's+': date.getSeconds(), //秒
		'q+': Math.floor((date.getMonth() + 3) / 3), //季度
		S: date.getMilliseconds(), //毫秒
	};

	if (/(y+)/.test(fmt))
		fmt = fmt.replace(
			RegExp.$1,
			(date.getFullYear() + '').substr(4 - RegExp.$1.length)
		);
	for (const k in o)
		if (new RegExp('(' + k + ')').test(fmt))
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
			);
	return fmt;
};

/**	原生JavaScript全角转换为半角函数
 * @param str	需要转换的字符串
 */
export const ToCDB = (str = '') => {
	var result = '';
	for (var i = 0; i < str.length; i++) {
		const code = str.charCodeAt(i);
		if (code >= 65281 && code <= 65374) {
			result += String.fromCharCode(str.charCodeAt(i) - 65248);
		} else if (code == 12288) {
			result += String.fromCharCode(str.charCodeAt(i) - 12288 + 32);
		} else {
			result += str.charAt(i);
		}
	}
	return result;
};

/**	转全角字符
 * @param str	需要转换的字符串
 */
export const toDBC = (str = '') => {
	var result = '';
	var len = str.length;
	for (var i = 0; i < len; i++) {
		var cCode = str.charCodeAt(i);
		//全角与半角相差（除空格外）：65248(十进制)
		cCode = cCode >= 0x0021 && cCode <= 0x007e ? cCode + 65248 : cCode;
		//处理空格
		cCode = cCode == 0x0020 ? 0x03000 : cCode;
		result += String.fromCharCode(cCode);
	}
	return result;
};
