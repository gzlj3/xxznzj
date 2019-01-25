// plugin/pages/class/classmain.js
const bjMetas = [
  { label: '班级名称', name: 'bjmc', require: true },
  { label: '老师姓名', name: 'lsxm' },
  { label: '身份证号', name: 'sfzh', type: 'idcard' },
  { label: '手机号码', name: 'sjhm', type: "number" }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fields:{avatarUrl: 'avatarUrl', title: 'classname', desc: 'teacher'}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onAdd: function () {
    const fmMetasJson = JSON.stringify(bjMetas);
    wx.navigateTo({
      url: '../edit/editdata?fmMetas='+fmMetasJson,
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