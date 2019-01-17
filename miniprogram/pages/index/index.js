var XXRJ = requirePlugin("XXZNZJ")
Page({
  onLoad: function() {
    console.log(XXRJ.services.test());
    wx.redirectTo({
      url: 'plugin://XXZNZJ/index1',
    })
  }
})