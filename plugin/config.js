const production = true;
exports.env = production ? 'xxznzj-fdd858' : 'xxznzj-test-2f5df8';
exports.cloudservice = 'cloudservice';  //默认调用的云函数名
exports.yzmYxq = 2 * 60;   //验证码有效期，2分钟
exports.uploadFileMaxCount = 5;       //上传文件最大数 
exports.uploadFileMaxSize = 200*1024;  //上传文件大小最大值：200k
exports.refreshUserInterval=5*60*1000;    //刷新用户缓存时间间隔(在app.onshow触发的情况下计算):5分钟
exports.canIUseWxPhoneNumber = false;   //是否使用微信手机号注册（设置此参数目的是微信云开发中暂时还不能直接解析微信前端读取的手机号加密串，待以后提供功能后再使用）

exports.init = function(paras){
  if(paras){ 
    Object.assign(exports,paras)
  }
}
