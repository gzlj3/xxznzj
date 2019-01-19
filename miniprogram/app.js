const { initPlugin} = requirePlugin("XXZNZJ");
App({
  onLaunch: function () {
    console.log('host onLaunch');
    //初始化插件，第1个参数为宿主应用,第2个参数为传入插件的配置(可为空)
    initPlugin(this);
  }
})
