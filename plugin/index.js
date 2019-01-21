const config = require('config.js');
const app = require('app1.js');
const {PluginApp} = require('PluginApp.js');
const initPlugin = (paras1,paras2,paras3) =>{
  config.init(paras3);
  // PluginApp({paras1,paras2});
  app.init(paras1,paras2);
}

module.exports = {
  initPlugin,
  utils: require('utils/utils.js'),
  CONSTS: require('./utils/constants.js'),
  services: require('./services/commServices.js'),
}
