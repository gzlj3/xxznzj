const app = require('../../app1.js');
const CONSTS = require('../../utils/constants.js');
const utils = require('../../utils/utils.js');
const commServices = require('../../services/commServices.js');
// const fmMetas = [
//   { label: '姓名', name: 'name', require: true },
//   { label: '身份证号', name: 'sfzh', type: 'idcard' },
//   { label: '手机号码', name: 'sjhm', type: "number" }
// ]
const tablename = 'staff';
const fmName = 'staff';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // fields: { avatarUrl: 'avatarUrl', title: 'name', desc: 'sf' },
    sourceList:[],
    sourceListItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const response = commServices.queryData(CONSTS.BUTTON_QUERYFY,{tablename});
    commServices.handleAfterRemote(response, null,
      (resultData) => {
        // console.log('onload staffmain:',resultData);
        this.refreshSourceList(resultData);
        app.sourceListDirty = false;
      }
    );   

  },
  refreshSourceList: function(sourceList){
    if (!sourceList) sourceList = [];
    let sourceListItems = [];
    sourceList.map(value => {
      sourceListItems.push({
        avatarUrl:value.avatarUrl,
        title: `${value.name}`,
        desc: `手机号码:${value.sjhm}`
      })
    })
    this.setData({ sourceList, sourceListItems });
  },
  onBodyTap:function(e){
    // console.log('onbodytap:',e);
    this.modifyData(e);
  },
  modifyData:function(e){
    const {index} = e.detail;
    const pos = utils.getInteger(index);
    const currentObject = this.data.sourceList[pos];
    const buttonAction = CONSTS.BUTTON_SAVEOTHERDATA;
    const paras = { buttonAction,fmName, tablename, unifield: ['name','sjhm'], currentObject }
    const parasJson = JSON.stringify(paras);
    wx.navigateTo({ 
      url: '../edit/editdata?item=' + parasJson,
    })
  },
  onAdd: function () {
    const buttonAction = CONSTS.BUTTON_SAVEOTHERDATA;
    const paras = { buttonAction,fmName, tablename, unifield:['name','sjhm']}
    const parasJson = JSON.stringify(paras);
    wx.navigateTo({
      url: '../edit/editdata?item=' + parasJson,
    })
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
    // 检查返回值，刷新数据
    // app.setGlobalData({ staffListDirty: false })
    // const { staffListDirty } = app.getGlobalData();
    console.log('onshow sourcelistdirty:', app.sourceListDirty);
    if (app.sourceListDirty) {
      this.onLoad();
    }

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