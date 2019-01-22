// const {pluginApp} = requirePlugin("XXZNZJ")
const myBehavior = require('../../xxznzjBehaviors.js')

Component({
  behaviors: [myBehavior],

  methods: {
    onLoad: function (options) {
      console.log('onload:', options);
      this.setData({...options});
      // this.method1();
      // wx.login({
      //   success:function(e){
      //     console.log(e);
      //   }
      // })
    },
    onGetUserInfo: function(e){
      console.log('host get user....:',e);
      this.setData({ hostUserInfo: e.detail.userInfo})
    },
    onGetPhoneNumber:function(e){
      console.log('host getPhoneNumber:', e);
      this.setData({ sjhm: '13332875650' })
    }
  }
})