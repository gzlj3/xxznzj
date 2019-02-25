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
    const fmMetas = app.getFmMetas()[paras.fmName];
    let {currentObject,initialValue} = paras;
    if (!currentObject) currentObject = {};
    if(initialValue){
    //处理初始值
      Object.assign(currentObject,initialValue);
    }
    this.setData({ ...paras,currentObject,fmMetas});
  },  

  formSubmit:function(e){
    const form = this.selectComponent("#_wrapperformid");
    if(!form.validFields()) return;
    const formObject = form.data.currentObject;
    let {buttonAction,tablename,fmName,unifield} = this.data;
    // if (!utils.isEmpty(parentid)) formObject.parentid = parentid;
    if (utils.isEmpty(buttonAction)) buttonAction = CONSTS.BUTTON_SAVEDATA;
    const response = commServices.postData(buttonAction, { formObject, tablename,fmName,unifield});
    // console.log(buttonAction+"===:"+CONSTS.getButtonActionInfo(buttonAction));
    commServices.handleAfterRemote(response, CONSTS.getButtonActionInfo(buttonAction),
      (resultData) => {
        app.sourceListDirty = true;
        utils.afterSave();
        // wx.navigateBack();
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
    //检查是否有搜索字段，并处理
    // const form = this.selectComponent("#_wrapperformid");
    // const {fmMetas} = this.data;
    // fmMetas.map(value=>{
    //   if(value.type==='search'){
    //     const selectObject = app.getGlobalData()[value.searchType + CONSTS.globalRetuSuffix];
    //     if(selectObject){
    //       //有选择值，先清除之前的值
    //       app.getGlobalData()[value.searchType + CONSTS.globalRetuSuffix] = null;
    //       const input = form.getWrapperInput();
    //       // console.log('editdata onshow:',input);
    //       let edetail = { id: value.name, value: selectObject.desc,code:selectObject.code};
    //       input.triggerEvent('input', edetail, {})
    //       input.triggerEvent('blur', edetail, {})
    //     }
    //   }
    // });
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