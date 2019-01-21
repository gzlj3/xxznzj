const moment = require('moment.min.js');
const rp = require('request-promise');
const request = require('request');
const CONSTS = require('constants.js');
const cloud = require('wx-server-sdk')

exports.getInteger = (value) => {
  try{
    const result = Number.parseInt(value);
    if(isNaN(result)) return 0;
    return result;
  }catch(e){
    return 0;
  }
}

exports.getFloat = (value) => {
  try {
    const result = Number.parseFloat(value);
    if (isNaN(result)) return 0;
    return result;
  } catch (e) {
    return 0;
  }
}

//对number四舍五入，保留指定位置，并返回数值型
exports.roundNumber = (number,precision) => {
  try{
    const result = Number.parseFloat(number.toFixed(precision));
    if (isNaN(result)) return 0;
    return result;
  }catch(e){
    return 0;
  }
}

exports.isEmpty = (value) => {
  return !value;
  // return !(value && value.length > 0);
}

const isEmptyObj = (obj) => {
  if (!obj) return true;
  for (var key in obj) {
    return false
  }
  return true;
}
exports.isEmptyObj = isEmptyObj;

exports.getCurrentTimestamp = ()=>{
  // return moment().format('YYYY-MM-DD HH:mm:ss');
  return moment().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss')
}

//取当前时间毫秒值
exports.currentTimeMillis = () => {
  return (new Date()).getTime();
}

function newException (message,code){
  return {message,code};
}
exports.newException = newException;
function codeException(errCode) {
  // console.log('exception:', errCode, CONSTS.EXCEPTION[errCode]);
  let msg = CONSTS.EXCEPTION[errCode];
  if(!msg) msg = errCode;
  return newException(msg,errCode);
}
exports.codeException = codeException;

//通过榛子云短信平台发送手机短信（http://smsow.zhenzikj.com）
//其中的appId,appSecret为榛子云平台注册的帐号信息
// exports.sendPhoneMessage = async (sjhm,message)=>{
//   // if(!config.production) {
//   //   //测试环境不真正发短信
//   //   return;
//   // }
//   const options = {
//     method: 'POST',
//     uri: 'http://sms_developer.zhenzikj.com/sms/send.do',
//     form: {
//       appId: '100127',
//       appSecret: '4d8234e0-9771-4d1c-a673-83c88f943b92',
//       message,
//       number:sjhm
//     },
//     headers: {
//       'content-type': 'application/x-www-form-urlencoded',
//     }
//   };
//   // console.log('发送手机短信:',options);
//   let result = await rp(options);
//   result = JSON.parse(result);
//   // console.log(result); 
//   if(result.code!==0)
//     throw newException("短信发送失败:【"+result.code+"】"+result.data);
//   return result;
// }

//生成n位数的随机数
exports.getRandom = (n) => { 
  let result = "";
  for (var i = 0; i < n; i++)
    result += Math.floor(Math.random() * 10);
  return result;
}

//生成UUID
function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data. At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}
exports.uuid = uuid;
exports.yzhid = () => {
  return uuid(16, 10);
}
exports.collid = () => {
  return uuid(5);
}
exports.id = () => {
  return uuid(16);
}

const requestUrl = async (url) => {
  const options = {
    method: 'GET',
    uri: url,
  };
  let result = await rp(options);
  result = JSON.parse(result);
  return result;
}
exports.requestUrl = requestUrl;

const postFileData = async (url,fileData) => {
  const options = {
    method: 'POST',
    uri: url,
    formData: {
      // Like <input type="file" name="file">
      file: {
        value: fileData,
        options: {
          filename: '1.jpg',
          contentType: 'image/*'
        }
      }
    },
    headers: {
      // 'content-type': 'application/x-www-form-urlencoded',
      'content-type': 'multipart/form-data',
    }
  };
  let result = await rp(options);
  result = JSON.parse(result);
  return result;
}
exports.postFileData = postFileData;

exports.testRequest = async ()=>{
  const token = "16_FVs0ET7q1sXSU0QlIbElKfDve0AXtJaLt6JeP9yX3Vc6aRa26uly555GBiVatr7I7CwdBmvf-jMw8HtGcchmoA_IL63ySJAz-5EitxD8XFqQJBinMKV1NDVxPpQNW-eJPEWaU_Oim9p9gpA7ERXiAEAPCI";
  const url = "http://api.weixin.qq.com/cv/ocr/idcard?type=photo&access_token="+token;
  // return await requestOtherUrl(url);
  const fileID = 'cloud://jjczwgl-test-2e296e.6a6a-jjczwgl-test-2e296e/1/200/Hu0Xp.jpg'
  const res = await cloud.downloadFile({
    fileID,
  })
  const buffer = res.fileContent;
  console.log('filelength:',buffer.length);
  // return buffer.toString('utf8')  
  const options = {
    method: 'POST',
    uri: url,
    // body: buffer,
    formData: {
      // Like <input type="file" name="file">
      file: {
        value: buffer,
        options: {
          filename: 'test.jpg',
          contentType: 'image/jpg'
        }
      }
    },
    headers: {
      // 'content-type': 'application/x-www-form-urlencoded',
      'content-type': 'multipart/form-data',
      
    }
  };
  // console.log('请求URL:', options);
  let result = await rp(options);
  // result = JSON.parse(result);
  console.log(result);
  return result;

}

const requestOtherUrl = async (url,data, curUser) => {
  // const url = 'http://vb9nvs.natappfree.cc/fygl/fygl_list';
  const options = {
    method: 'GET',
    uri: url,
    body: '',
    // form: data1,
    // headers: {
    //   'content-type': 'application/x-www-form-urlencoded',
    // }
  };
  console.log('请求URL:', options);
  let result = await rp(options);
  // result = JSON.parse(result);
  console.log(result);
  return result;
}
exports.requestOtherUrl = requestOtherUrl;


exports.sendTemplateMessage = async (data,curUser) => {
  return await requestOtherUrl(data,curUser);
  return;

  let _access_token = '16_YjoCjgJPkVzbik_J2ZF_0HkY4e6iteA5Y2XdPyGwysLBxlofjeLhBQLwfVDgprDeYR6uQVWVpY34lMXPxo_zCd8cbOeRRZvWf7soy984hmP4VzgRO4Wvo8cqv20N51dIWVixN8LsfUrMTIl8NANeAJAWJW';
  data.access_token = _access_token;
  let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + _access_token; 
  let openid = curUser.openId;//'on_Li5Pa4d5XQklE_NCiI2IoPKsM';
  // let openid = 'on_Li5OH1iiBDfHuushKvYL_P9qQ';
  let jsonData = {
    access_token: _access_token,
    touser: openid,
    template_id: '50_-U2e4vq8STuhhDTqEWVywu1RQYFSzujZv_NG2h6k',
    form_id: data.form_id,
    page: "pages/index/index",
    data: {
      "keyword1": { "value": "测试数据一"},
      "keyword2": { "value": "测试数据二"},
      "keyword3": { "value": "测试数据三"},
      "keyword4": { "value": "测试数据四"},
      "keyword5": { "value": "测试数据五"},
    }
  }
  const s = JSON.stringify(jsonData);

  // request.post();
  // const data1 =
  //   {
  //     "touser": "on_Li5Pa4d5XQklE_NCiI2IoPKsM",
  //     "template_id": "50_-U2e4vq8STuhhDTqEWVywu1RQYFSzujZv_NG2h6k",
  //     "page": "index",
  //     "form_id": "FORMID",
  //     "data": {
  //       "keyword1": {
  //         "value": "339208499"
  //       },
  //       "keyword2": {
  //         "value": "2015年01月05日 12:30"
  //       },
  //       "keyword3": {
  //         "value": "腾讯微信总部"
  //       },
  //       "keyword4": {
  //         "value": "广州市海珠区新港中路397号"
  //       }
  //     },
  //     "emphasis_keyword": "keyword1.DATA"
  //   }
  
  const options = {
    method: 'POST',
    uri: url,
    body:s,
    // form: data1,
    // headers: {
    //   'content-type': 'application/x-www-form-urlencoded',
    // }
  };
  console.log('发送模板消息:', options);
  let result = await rp(options);
  // result = JSON.parse(result);
  console.log(result);
  // if (result.code !== 0)
  //   throw newException("短信发送失败:【" + result.code + "】" + result.data);
  return result;
}
