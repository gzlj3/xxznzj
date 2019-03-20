const app = require('../../app1.js');
const config = require('../../config.js');
const CONSTS = require('../../utils/constants.js');
const utils = require('../../utils/utils.js');
const commServices = require('../../services/commServices.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const filePath = `${app.getHostWx().env.USER_DATA_PATH}/qrcode.jpg`;
    const fsm = app.getHostWx().getFileSystemManager();
    const self = this;
    fsm.access({
      path:filePath,
      success(res){
        //本地二维码文件存在，则直接显示
        self.setData({ qrCode: filePath });
      },
      fail(res) {
        //本地二维码文件不存在，从服务器生成
        self.createQrcode(filePath);
      }
    })
  },

  createQrcode: function (filePath){
    const response = commServices.postData(CONSTS.BUTTON_QRCODE, { appID: config.appId });
    const self = this;
    commServices.handleAfterRemote(response, '生成二维码',
      (resultData) => {
        app.getHostWx().getFileSystemManager().writeFile({
          filePath,
          encoding:'binary',
          data:resultData,
          success(res){
            self.setData({ qrCode: filePath });
          },
          fail(res) {
            utils.showModalInfo('保存二维码失败',res.errMsg);
          }
        })
      }
    );   
  },

  saveToPhotosAlbum: function(){
    const filePath = this.data.qrCode;
    console.log('filePath:',filePath);
    wx.saveImageToPhotosAlbum({
      filePath,
      success(res) {
        utils.showToast('保存到相册成功完成！');
      },
      fail(res) {
        utils.showModalInfo('保存到相册失败', res.errMsg);
      }
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