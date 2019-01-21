let pluginApp;
class PluginApp {
  globalData = 'aaaaa';
  constructor(paras) {
    console.log('paras...',paras);
    PluginApp.this = {...this,...paras};
    console.log('pluginapp constructor:',PluginApp.this)
  }
};

exports.PluginApp = (paras) =>{
  pluginApp = new PluginApp(paras);
  return pluginApp;
}

exports.getPluginApp = ()=>{
  return pluginApp;
}
