const utils = require('../../utils/utils.js');
const comm = require('../../utils/comm.js');
// const fyglService = require('../../services/commServices.js');
const commService = require('../../services/commServices.js');
const CONSTS = require('../../utils/constants.js');
const app = require('../../app1.js');
const refreshRightsChecked = (rights) => {
  if (!rights) return {};
  let rightsChecked = {};
  rights.map(value => {
    rightsChecked[value] = true;
  });
  return rightsChecked;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sjhm: '',
    rightsChecked: {},
    grantedSjhms: [],
    grantRights:[],
    // user: app.globalData.user
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('usergrant onload');
    // fyglService.checkAuthority(CONSTS.BUTTON_USERGRANT);
    const { grantedSjhm } = app.getGlobalData().user;
    let { sjhm } = this.data;
    let grantedSjhms = [], rights = [];
    if (grantedSjhm) {
      let found = false;
      for (let i = 0; i < grantedSjhm.length; i++) {
        const tmpSjhm = grantedSjhm[i].sjhm ? grantedSjhm[i].sjhm : grantedSjhm[i];
        grantedSjhms.push(tmpSjhm);
        if ((utils.isEmpty(sjhm) && i === 0) || tmpSjhm === sjhm) {
          found = true;
          sjhm = tmpSjhm;
          rights = grantedSjhm[i].rights ? grantedSjhm[i].rights : [];
        }
      }
      if (!found && grantedSjhm.length > 0) {
        const tmpSjhm = grantedSjhm[0].sjhm ? grantedSjhm[0].sjhm : grantedSjhm[0];
        sjhm = tmpSjhm;
        rights = grantedSjhm[0].rights ? grantedSjhm[0].rights : [];
      }
    }
    let grantRights=[];
    if(comm.isUserType1()){
      grantRights = [
        { desc: '学员管理(维护及充值)', code: '101' },
        { desc: '教职工管理', code: '102' },
        { desc: '班级管理', code: '103' },
      ];
    } else if (comm.isUserType2()) {
      grantRights = [
        { desc: '托管我的学员', code: '301' },
      ];
    } else if(comm.isUserType3()){
      grantRights = [
        { desc: '托管我的班级', code: '201' },
      ];
    }
    // console.log('grantRights:', grantRights);
    this.setData({ sjhm, rightsChecked: refreshRightsChecked(rights), grantedSjhms, grantRights });
  },


  getGrant: function (e) {
    const { item: sjhm } = e.currentTarget.dataset;
    const { grantedSjhm } = app.getGlobalData().user;
    let rights = {};
    if (grantedSjhm) {
      for (let i = 0; i < grantedSjhm.length; i++) {
        const tmpSjhm = grantedSjhm[i].sjhm;
        if (tmpSjhm === sjhm) {
          rights = grantedSjhm[i].rights; 
        }
      }
    }
    this.setData({ sjhm, rightsChecked: refreshRightsChecked(rights) });
  },

  grantCheckboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    const rights = e.detail.value;
    // let rights={};
    // rightsChecked.map(value=>{
    //   rights[value] = true;
    // })
    this.setData({ rightsChecked: refreshRightsChecked(rights) });
  },
  cancelGrant: function (e) {
    const { item: sjhm } = e.currentTarget.dataset;
    const formObject = { sjhm };
    e.detail.value = formObject;
    e.cancelGrant = true;
    this.formSubmit(e);
  },

  formSubmit: function (e) {
    console.log('form提交数据：', e.detail.value)
    const formObject = e.detail.value;
    const { sjhm } = formObject;
    if (!utils.checkSjhm(sjhm)) {
      wx.showToast({
        title: '请先输入正确的手机号',
        icon: 'none',
      });
      return;
    };
    const self = this;
    let tsinfo;
    if (e.cancelGrant) {
      tsinfo = `确定取消${sjhm}的权限吗?`;
    } else {
      tsinfo = `你确定授权给${sjhm}操作吗？`;
    }
    utils.showModal('权限管理', tsinfo, () => { self.handleSubmit(e); });
  },

  handleSubmit: function (e) {
    const formObject = e.detail.value;
    const response = commService.postData(CONSTS.BUTTON_USERGRANT, formObject);
    commService.handleAfterRemote(response, '用户授权',
      (resultData) => { 
        app.setUserData(resultData);
        this.onLoad();
        // this.setData({ user: app.globalData.user });
        // console.log(resultData);
        // this.setData({ sendingYzm: true });
        // this.timer();
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})