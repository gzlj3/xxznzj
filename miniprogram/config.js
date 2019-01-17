const production = true;
exports.conf = {
  env: production ? 'jjczgl-2d82f0' : 'jjczgl-test-aca51e',
  yzmYxq: 2 * 60,   //验证码有效期，2分钟
}
exports.uploadFileMaxCount = 5;       //每个房间上传文件最大数 
exports.uploadFileMaxSize = 200*1024;  //上传文件大小最大值：200k
exports.refreshUserInterval=5*60*1000;    //刷新用户缓存时间间隔(在app.onshow触发的情况下计算):5分钟