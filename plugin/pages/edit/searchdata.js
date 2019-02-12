const app = require('../../app1.js');
const CONSTS = require('../../utils/constants.js');
const utils = require('../../utils/utils.js');
const commServices = require('../../services/commServices.js');
let searchType;
Page({
  data: {
    inputShowed: true,
    inputVal: "",
    sourceList:null
  },
/**
 * 入口参数：searchType:String  云端搜索类型
 */
  onLoad: function (options) {
    // console.log('editdata onload:',options);
    searchType = options.searchType;
    if(utils.isEmpty(searchType)){
      utils.showModalInfo('参数错误','需要传入搜索类型参数(searchType)');
      wx.navigateBack();
      return;
    }
    let sourceList = app.getGlobalData()[searchType];
    app.getGlobalData()[searchType + CONSTS.globalRetuSuffix] = null;
    if(!sourceList){
      const response = commServices.queryData(CONSTS.BUTTON_SEARCH, { searchType });
      commServices.handleAfterRemote(response, null,
        (resultData) => { 
          // console.log('onload searchdata:',resultData);
          sourceList = resultData;
          app.getGlobalData()[searchType] = sourceList;
          this.setData({ sourceList });
        }
      );
    }else{
      this.setData({sourceList});
    }
  },  

  onBodyTap: function (e) {
    // console.log('onbodytap:',e);
    const { index } = e.detail;
    const pos = utils.getInteger(index);
    const selectObject = this.data.sourceList[pos];
    app.getGlobalData()[searchType + CONSTS.globalRetuSuffix] = selectObject;
    wx.navigateBack();
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  onSearch: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  }
});