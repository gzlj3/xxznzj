const config = require('config.js');
const initPlugin = (paras) =>{
  config.init(paras);
}

module.exports = {
  initPlugin,
  utils: require('utils/utils.js'),
  CONSTS: require('./utils/constants.js'),
  services: require('./services/commServices.js'),
}
