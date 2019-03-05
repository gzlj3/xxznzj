const production = true;
exports.env = production ? 'xxznzj-fdd858' : 'xxznzj-test-2f5df8';
exports.uploadFileMaxCount = 5;       //上传文件最大数 
exports.uploadFileMaxSize = 200*1024;  //上传文件大小最大值：200k
exports.refreshUserInterval=5*60*1000;    //刷新用户缓存时间间隔(在app.onshow触发的情况下计算):5分钟
exports.canIUseWxPhoneNumber = false;