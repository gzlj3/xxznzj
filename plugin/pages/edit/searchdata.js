const app = require('../../app1.js');
const CONSTS = require('../../utils/constants.js');
const utils = require('../../utils/utils.js');
const commServices = require('../../services/commServices.js');
Page({
  data: {
    inputShowed: true,
    inputVal: "",
    sourceList:null
  },
/**
 * 入口参数：coludSearchType:String  云端搜索类型
 */
  onLoad: function (options) {
    // console.log('editdata onload:',options);
    const { searchType} = options;
    if(utils.isEmpty(searchType)){
      utils.showModalInfo('参数错误','需要传入搜索类型参数(searchType)');
      wx.navigateBack();
      return;
    }
    // this.setData({ formname, objectname, currentObject: app.getGlobalData[objectname] });
    let sourceList = app.getGlobalData()[searchType];
    app.getGlobalData()[searchType + CONSTS.globalRetuSuffix] = null;

    // const { coludSearchType} = options;
    const response = commServices.queryData(CONSTS.BUTTON_SEARCH, { searchType });
    commServices.handleAfterRemote(response, null,
      (resultData) => { 
        console.log('onload searchdata:',resultData);
        this.setData({ searchType,sourceList:resultData});
        // this.refreshSourceList(resultData);
        // app.sourceListDirty = false;
      }
    );

    // this.setData({coludSearchType});
  },  

  onBodyTap: function (e) {
    // console.log('onbodytap:',e);
    const { index } = e.detail;
    const pos = utils.getInteger(index);
    const currentObject = this.data.sourceList[pos];
    const paras = { fmMetas, tablename, unifield: 'name', buttonAction: CONSTS.BUTTON_EDITFY, currentObject }
    const parasJson = JSON.stringify(paras);
    wx.navigateTo({
      url: '../edit/editdata?item=' + parasJson,
    })
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
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