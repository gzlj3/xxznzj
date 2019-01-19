exports.app = null
exports.globalData = {}
exports.init = function (paras) {
  console.log('globaldata:', paras.globalData);
  paras.onShow = onShow;
  // console.log('host:',paras);

  // if (paras) {
  //   module.exports = { ...exports, ...paras }
  // }
}

const onShow = function (e) {
  console.log('app onshow...........');
  // const user = this.globalData.user;
  // if (!user || utils.isEmpty(user.userType) || user.userType === CONSTS.USERTYPE_NONE) {
  //   this.queryUser();
  // } else {
  //   const { lastRefreshTime } = this.globalData;
  //   if (utils.currentTimeMillis() - lastRefreshTime >= config.refreshUserInterval) {
  //     console.log('refresh user');
  //     this.queryUser();
  //   }
  // }
}
