const CONSTS = require('../../utils/constants.js');
Page({
  data: {
    pageDesc:'',
    button2Obj:{}
  },

  onLoad: function (options) {
    // console.log(options);
    const { pageDesc='', button2 } = options;
    const button2Obj = button2 ? JSON.parse(button2) : null;
    this.setData({
      pageDesc,
      button2Obj
    })
  },
  onButton1: function(e){
    wx.navigateBack();
  },
  onButton3: function (e) {
    wx.navigateBack({
      delta:2
    });
  },
  onButton2: function (e) {
    const { returnUrl, returnAction, returnItem } = this.data.button2Obj;
    let url = returnUrl;
    if(returnAction){
      const buttonAction = Number.parseInt(returnAction);
      url += '?buttonAction='+buttonAction+'&';
    }
    if (returnItem){
      if(url.indexOf('?')<0) url+='?';
      url += 'item='+JSON.stringify(returnItem);
    }
    console.log(url);
    wx.redirectTo({
      url
    });    
  }
});