const { initPlugin} = requirePlugin("XXZNZJ");
const config = require('config.js');
App({
    onLaunch: function () {
    // console.log('host onLaunch');
    //初始化插件，第1个参数为宿主应用app,第2个参数为宿主全局对象wx,第3个参数为修改插件的配置(可为空)
      initPlugin(this, wx, config);
  }
})
