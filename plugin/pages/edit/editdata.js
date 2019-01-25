// plugin/pages/edit/editdata.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentObject: {},
    fmMetas:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('editdata onload:',options);
    const fmMetas = options.fmMetas ? JSON.parse(options.fmMetas) : null;
    this.setData({fmMetas});
  },

  formSubmit:function(e){
    const form = this.selectComponent("#_wrapperformid");
    // console.log('selectcomponent:',form.data.currentObject);

    const response = fyglService.postData(buttonAction, formObject, this.data.collid);
    // console.log(buttonAction+"===:"+CONSTS.getButtonActionInfo(buttonAction));
    fyglService.handleAfterRemote(response, CONSTS.getButtonActionInfo(buttonAction),
      (resultData) => {
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