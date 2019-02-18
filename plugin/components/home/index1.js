// plugin/components/home/index1.js
const app = require('../../app1.js');
const config = require('../../config.js');
const CONSTS = require('../../utils/constants.js');
const utils = require('../../utils/utils.js');
const commServices = require('../../services/commServices.js');

Component({
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
    canIUseWxPhoneNumber: false,
    // list:menuList,
    // zkMenuList,
    sjhm: '',
    sendingYzm: false,
    second: config.yzmYxq,
    CONSTS,  
    // radioItems: [  
    //   { name: '我是房东，想管理我的房源', value: '1', checked: true  },
    //   { name: '我是租客，想查询我的帐单', value: '2'}
    // ],  
    requestUserType: CONSTS.USERTYPE_FD,  //用户请求入口身份（机构或其它）
    disabledSjhm: false,  //如果手机号码是带入的，则不允许修改，
  },

    /**
   * 入口参数：空：表示注册新机构
   * 注册为机构的使用人员：yzhid:机构ID，collid:机构集合标识，orgname:机构名,
   * type:请求类型（1：签到）
   */
  properties: { 
    onloadoptions: {
      type: Object,
      value: {},
      observer(newVal, oldVal, changedPath) {
        console.log('observer onloadoptions:', newVal);
        if(!newVal) return;
        let requestUserType = this.data.requestUserType;
        if(!utils.isEmpty(newVal.yzhid)){
          requestUserType = CONSTS.USERTYPE_ZK;
        }
        this.setData({ ...newVal,requestUserType });
      }
    },
    menuList: Array,
    user2MenuList:Array,
    user3MenuList:Array,
      // type: Array,
      // value: [],
      // observer(newVal, oldVal, changedPath) {
      //   console.log('observer menuList:', newVal);
      //   // this.setData({ menulist:newVal });
      // }
    // },
    // requestusertype: {
    //   type:String,
    //   value: CONSTS.USERTYPE_FD,
    //   observer(newVal, oldVal, changedPath) {
    //     console.log('observer requestType:', newVal);
    //     if(utils.isEmpty(newVal)) newVal = CONSTS.USERTYPE_FD;
    //     this.setData({ requestUserType:newVal});
    //   }
    // },
    // orgcode: {
    //   type: String,
    //   observer(newVal, oldVal, changedPath) {
    //     console.log('observer orgcode:', newVal, oldVal, changedPath);
    //     this.setData({ orgcode: newVal });
    //   }
    // },
    // sjhm: {
    //   type: String,
    //   observer(newVal, oldVal, changedPath) {
    //     console.log('observer sjhm:', newVal, oldVal, changedPath);
    //     const sjhm = newVal;
    //     let { disabledSjhm,requestUserType } = this.data;
    //     if (!utils.isEmpty(sjhm) && utils.checkSjhm(sjhm)) {
    //       disabledSjhm = true;
    //       if (utils.isEmpty(requestUserType)) requestUserType = CONSTS.USERTYPE_ZK;
    //     }
    //     this.setData({ sjhm, requestUserType,disabledSjhm });
    //   }
    // },
    hostuserinfo:{
      type:Object,
      observer(newVal, oldVal, changedPath) {
        // console.log('observer hostuserinfo:', newVal, oldVal, changedPath);
        app.setUserData(newVal);
        this.setData({
          user: app.getGlobalData().user
        });
      }
    },
  },

  pageLifetimes: {
    show: function (options) {
      // console.log('pagelifetimes show:',options)
    },
  },

  lifetimes: { 
    attached() {
      // const obj = ['aaaa','bbbb'];
      // this.test(...obj);
      // 在组件实例进入页面节点树时执行
      // console.log('attached:',this.data.requestUserType,this.data.sjhm);
      // console.log('attached:', this.is);
      // console.log(app.hostWx);
      // 是否有权限获取微信手机号
      let canIUseWxPhoneNumber = app.getHostWx().canIUse('button.open-type.getPhoneNumber');
      canIUseWxPhoneNumber = false;  //调试用暂时设置为false
      this.setData({ canIUseWxPhoneNumber});
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
    // onGetUserInfo(e) {
    //   console.log(e);
    //   // console.log(e.detail.code) // wx.login 的 code
    //   // console.log(e.detail.userInfo) // wx.getUserInfo 的 userInfo
    // },
    // _hostuserinfoChange(newVal, oldVal){
    //   console.log('hostUserChange:',newVal,oldVal);
    // },
    test(x,y){
      console.log(x,y);
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
    onInputSjhm: function (e) {
      this.setData({ sjhm: e.detail.value });
    },

    onSendSjyzm: function (e) {
      const { sjhm } = this.data;
      if (!utils.checkSjhm(sjhm)) {
        utils.showToast('请先输入正确的手机号!');
        return;
      };
      const {yzhid} = this.data;
      const response = commServices.postData(CONSTS.BUTTON_SENDSJYZM, { sjhm, yzhid });
      commServices.handleAfterRemote(response, '发送验证码',
        (resultData) => {
          this.setData({ sendingYzm: true });
          this.timer();
        }
      );
    },

    timer: function () {
      let promise = new Promise((resolve, reject) => {
        let setTimer = setInterval(
          () => {
            this.setData({
              second: this.data.second - 1
            });
            if (this.data.second <= 0) {
              this.setData({
                second: config.yzmYxq,
                sendingYzm: false,
              });
              resolve(setTimer);
            }
          }
          , 1000)
      });
      promise.then((setTimer) => {
        clearInterval(setTimer)
      });
    },

    onRegister (e) {
      // console.log('register:',e);
      const { requestUserType, user, sjhm, canIUseWxPhoneNumber,yzhid,collid,orgname} = this.data;
      if (utils.isEmpty(requestUserType)) {
        utils.showToast('注册系统身份不能为空！');
        return;
      }
      if (user && !user.wxgranted) {
        utils.showToast('微信公开信息未授权！');
        return;
      }
      if (utils.isEmpty(sjhm)) {
        utils.showToast('未获取手机号！');
        return;
      }
      if(!utils.checkSjhm(sjhm)){
        utils.showToast('手机号输入不正确！');
        return;
      }
      if (!canIUseWxPhoneNumber && utils.isEmpty(e.detail.value.sjyzm)){
        utils.showToast('验证码不能为空！');
        return;
      }
      if (requestUserType===CONSTS.USERTYPE_FD && utils.isEmpty(e.detail.value.orgname)) {
        utils.showToast('机构名称不能为空！');
        return;
      }

      let formObject = e.detail.value;
      formObject.userType = requestUserType;
      formObject.sjhm = sjhm;
      formObject.canIUseWxPhoneNumber = canIUseWxPhoneNumber;
      if (requestUserType === CONSTS.USERTYPE_ZK) {
        formObject.yzhid = yzhid;
        formObject.collid = collid;
        formObject.orgname = orgname;
      }

      // console.log(e.detail.value);
      const response = commServices.postData(CONSTS.BUTTON_REGISTERUSER,
        { frontUserInfo: user,
          formObject: e.detail.value});
      commServices.handleAfterRemote(response, '用户注册',
        (resultData) => {
          app.setUserData(resultData);
          this.setData({ 
            user: app.getGlobalData().user
          });
        } 
      );
    }, 
    kindToggle: function (e) {
      const page = e.currentTarget.id;
      // console.log(wx);
      app.getHostWx().navigateTo({
        url: page,
      });
      // wx.navigateTo({
      //   url: 'plugin-private://xyglmain',
      // });
    },

  }  
})
