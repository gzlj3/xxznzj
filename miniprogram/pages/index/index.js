var XXRJ = requirePlugin("XXZNZJ")
const myBehavior = require('../../xxznzjBehaviors.js')

Component({
  behaviors: [myBehavior],

  methods: {
    onLoad: function (options) {
      // console.log('onload:',this.data.pageLoadOptions);
      console.log('onload:', options);
      this.method1();
      // console.log(XXRJ.services.test());
      // const obj = undefined;
      // // const obj1 = obj || {a:'aaaa'}
      // console.log(obj || {a:'aaa'});

      // wx.redirectTo({
      //   url: 'plugin://XXZNZJ/index1',
      // })
    },
    onGetUserInfo: function(e){
      console.log('get user....:',e);
    }
  }
})