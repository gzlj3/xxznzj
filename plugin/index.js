const config = require('config.js');
const app = require('app1.js');
const initPlugin = (paras1,paras2) =>{
  config.init(paras2);
  app.init(paras1);
}

module.exports = {
  initPlugin,
  utils: require('utils/utils.js'),
  CONSTS: require('./utils/constants.js'),
  services: require('./services/commServices.js'),
}
