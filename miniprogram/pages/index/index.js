var XXRJ = requirePlugin("XXZNZJ")
Page({
  onLoad: function() {
    console.log(XXRJ.services.test());
    // const obj = undefined;
    // // const obj1 = obj || {a:'aaaa'}
    // console.log(obj || {a:'aaa'});

    // wx.redirectTo({
    //   url: 'plugin://XXZNZJ/index1',
    // })
  },
  onGetUserInfo: function(e){
    console.log('get user:',e);
  }
})