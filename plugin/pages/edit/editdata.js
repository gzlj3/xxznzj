const app = require('../../app1.js');
const CONSTS = require('../../utils/constants.js');
const utils = require('../../utils/utils.js');
const commServices = require('../../services/commServices.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentObject: {},
    // tablename:null,
    // paras:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('editdata onload:',options);
    const paras = options.item ? JSON.parse(options.item) : null;
    console.log('editdata onload:',paras);
    // const fmMetas = options.fmMetas ? JSON.parse(options.fmMetas) : null;
    // const tablename = options.tablename;
    this.setData({...paras});
  },  

  formSubmit:function(e){
    const form = this.selectComponent("#_wrapperformid");
    if(!form.validFields()) return;
    const formObject = form.data.currentObject;
    const {buttonAction,tablename,unifield} = this.data;

    const response = commServices.postData(buttonAction, { formObject, tablename,unifield});
    // console.log(buttonAction+"===:"+CONSTS.getButtonActionInfo(buttonAction));
    commServices.handleAfterRemote(response, CONSTS.getButtonActionInfo(buttonAction),
      (resultData) => {
        app.sourceListDirty = true;
      }
    )
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