var plugin = requirePlugin("myPlugin")
Page({
  onLoad: function() {
    // plugin.getData()
    wx.navigateTo({
      url: 'plugin://myPlugin/index1',
    })
  }
})