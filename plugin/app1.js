const config = require('config.js')
const CONSTS = require('./utils/constants.js');
const utils = require('./utils/utils.js');
const commServices = require('./services/commServices.js');

let sourceListDirty = false;  //当前列表数据是否有刷新，用于判断是否刷新当前列表数据
let globalData = {
  cloudNormal: false,
  user: { wxgranted: true, userType: '', nickName: '', avatarUrl: '', collid: '', granted: [], grantedSjhm: [], },  //用户登录基本信息
  lastRefreshTime: 0,  //上次刷新时间
}
let hostApp;  //宿主app对象
let hostWx;   //宿主wx对象

const init = function (hostAppPara,hostWxPara) { 
  console.log('init app');
  hostApp = hostAppPara;
  hostWx = hostWxPara;
  // Object.assign(hostApp, hostAppPara);
  // Object.assign(hostWx, hostWxPara);
  // console.log(hostWx);
  if (!wx.cloud) {
    console.error('请使用 2.2.3 或以上的基础库以使用云能力')
  } else {
    wx.cloud.init({
      env: config.env,
      traceUser: true,
    }) 
  }

  hostApp.onShow = onShow;
  // checkForUpdate();
}

const onShow=  function (e) {
  console.log('app onshow.'); 
  const user = globalData.user;
  if (!user || utils.isEmpty(user.userType) || user.userType === CONSTS.USERTYPE_NONE) {
    queryUser();
  } else {
    const { lastRefreshTime } = globalData;
    if (utils.currentTimeMillis() - lastRefreshTime >= config.refreshUserInterval) {
      console.log('refresh user');
      queryUser();
    }
  }
}

const setGlobalData = function (newData) {
  Object.assign(globalData,newData);
}
const getGlobalData = function () {
  return globalData;
}
const getHostWx = function () {
  return hostWx;
}
const getHostApp = function () {
  return hostApp;
}

const queryUser = function () {
  const response = commServices.queryData(CONSTS.BUTTON_QUERYUSER);
  commServices.handleAfterRemote(response, null,
    (resultData) => {
      // console.log('queryuser success!',resultData);
      setUserData(resultData);
      getWxGrantedData();
      if (globalData.user.wxgranted) { 
        setGlobalData({ cloudNormal: true }); 
      }
      setGlobalData({ lastRefreshTime: utils.currentTimeMillis() });
    },
    err => {
      // console.log('queryuser fail:',err);
      setGlobalData({ cloudNormal: false });
    }
  );
}

// //设置用户数据，入口对象userInfo:{userType,nickName,avatarUrl,...}或为空
const setUserData = function (userData) {
  if (userData) {
    setGlobalData({ user: { wxgranted: true, userType: CONSTS.USERTYPE_NONE, ...userData } });
  } else {
    const userType = CONSTS.USERTYPE_NONE;
    const nickName = '', avatarUrl = '', wxgranted = false;
    setGlobalData({ user: { wxgranted, userType, nickName, avatarUrl } });
  }
}

const getWxGrantedData = function () {
  if (!globalData.user.wxgranted) {
    //获取用户信息
    hostWx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          hostWx.getUserInfo({
            success: res => {
              // console.log('getSetting success:',res);
              setUserData(res.userInfo);
            },
            complete: res => {
              // console.log('getSetting complete:', res);
              setGlobalData({ cloudNormal: true });
            }
          })
        }
      },
      complete: res => {
        // console.log('getWxGrantedData complete:', res);
        if (!res.authSetting['scope.userInfo']) {
          setGlobalData({ cloudNormal: true });
        }
      }
    })
  }
}

// const checkForUpdate = function () {
//   const updateManager = wx.getUpdateManager();
//   updateManager.onCheckForUpdate(function (res) {
//     // 请求完新版本信息的回调 
//     console.log('version update:', res.hasUpdate)
//   });
//   updateManager.onUpdateReady(function () {
//     wx.showModal({
//       title: '更新提示',
//       content: '新版本已经准备好，是否重启应用？',
//       success(res) {
//         if (res.confirm) {
//           // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
//           updateManager.applyUpdate()
//         }
//       }
//     })
//   });
// }

module.exports = { init, getGlobalData, setGlobalData, setUserData, queryUser, getHostApp, getHostWx,sourceListDirty}