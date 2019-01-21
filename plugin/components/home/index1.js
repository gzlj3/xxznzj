// plugin/components/home/index1.js
const app = require('../../app1.js');

Component({
    /**
   * 组件的属性列表
   */
  properties: { 
    requestUserType: String,
    sjhm: String,
  },
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },

  /**
   * 组件的初始数据
   */
  data: {
    user: null,
    waitingCloud: true,
    // list:menuList,
    // zkMenuList,
    // sjhm:'',
    // sendingYzm:false,
    // second:config.conf.yzmYxq,
    // CONSTS,
    // radioItems: [ 
    //   { name: '我是房东，想管理我的房源', value: '1', checked: true  },
    //   { name: '我是租客，想查询我的帐单', value: '2'}
    // ], 
    // requestUserType:'',  //用户请求入口身份（房东或租客）
    // disabledSjhm: false,  //如果手机号码是带入的，则不允许修改，而且默认为是租客注册
  },

  pageLifetimes: {
    show: function (options) {
      console.log('pagelifetimes show:',options)
    },
  },

  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      // console.log('attached:',this.data.requestUserType,this.data.sjhm);
      // console.log('attached:', this.is);
      this.waitingCloudNormal();
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onGetUserInfo(e) {
      console.log(e);
      // console.log(e.detail.code) // wx.login 的 code
      // console.log(e.detail.userInfo) // wx.getUserInfo 的 userInfo
    },

    waitingCloudNormal() {
      let waitingCloudNum = 0;
      this.setData({ waitingCloud: true });
      let promise = new Promise((resolve, reject) => {
        let setTimer = setInterval(
          () => {
            waitingCloudNum++;
            // console.log('waitingCloudNum:', waitingCloudNum, app.getGlobalData().cloudNormal);
            if (app.getGlobalData().cloudNormal) {
              // console.log('======appuser:', app.getGlobalData().user);
              this.setData({
                user: app.getGlobalData().user
              });
              resolve(setTimer);
            }
            if (waitingCloudNum > 20) {
              //等待10秒 
              resolve(setTimer);
            }
          }, 500)
      });
      promise.then((setTimer) => {
        clearInterval(setTimer)
        this.setData({ waitingCloud: false });
      });
    },
    refreshUser() {
      app.queryUser();
      this.waitingCloudNormal();
    },

  }  
})
