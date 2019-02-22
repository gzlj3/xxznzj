const app = require('../../app1.js');
const CONSTS = require('../../utils/constants.js');
const utils = require('../../utils/utils.js');
const comm = require('../../utils/comm.js');
const commServices = require('../../services/commServices.js');
// const fmMetas = [
//   { label: '班级名称', name: 'bjmc', require: true },
//   { label: '老师姓名', name: 'lsxm', type:'search',searchType:'staff'},
//   { label: '身份证号', name: 'sfzh', type: 'idcard' },
//   { label: '手机号码', name: 'sjhm', type: "number" }
// ]

const tablename = 'class';
const fmName = 'class';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // fields: { avatarUrl: 'avatarUrl', title: 'name', desc: 'sf' },
    sourceList:[],
    sourceListItems:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('test:',comm.parseWeektime("周一 11:32"));
    const response = commServices.queryData(CONSTS.BUTTON_QUERYFY, { tablename, fmName});
    commServices.handleAfterRemote(response, null,
      (resultData) => {
        // console.log('onload classmain:',resultData);
        this.refreshSourceList(resultData);
        app.sourceListDirty = false;
      }
    );   

  },
  refreshSourceList: function(sourceList){
    if (!sourceList) sourceList = [];
    let sourceListItems = [];
    sourceList.map(value=>{ 
      let sksj='',sksj1='',sksj2='';
      if(value.sksj){
        let i = 0;
        value.sksj.map(obj=>{
          if(!utils.isEmpty(obj.sksj)){
            if(i===0) sksj = '上课时间:'+obj.sksj;
            else if (i === 1) sksj1 = '上课时间:' + obj.sksj;
            else if (i === 2) sksj2 = '上课时间:' + obj.sksj;
            i++;
          } 
        })
      }
      // if(!utils.isEmpty(sksj)) sksj = '上课时间：'+sksj.substring(0,sksj.length - 1);
      sourceListItems.push({
        title: `${value.bjmc}`,
        desc:sksj,
        desc1: sksj1,
        desc2: sksj2
      })
    })
    this.setData({sourceList,sourceListItems});
  },
  onBodyTap:function(e){
    // console.log('onbodytap:',e);
    this.modifyData(e);
  },
  modifyData:function(e){
    const {index} = e.detail;
    const pos = utils.getInteger(index);
    const currentObject = this.data.sourceList[pos];
    const paras = { fmName, tablename, unifield: 'bjmc', currentObject }
    const parasJson = JSON.stringify(paras);
    wx.navigateTo({ 
      url: '../edit/editdata?item=' + parasJson,
    })
  },
  onAdd: function () {
    const paras = { fmName, tablename, unifield:'bjmc'}
    const parasJson = JSON.stringify(paras);
    wx.navigateTo({
      url: '../edit/editdata?item=' + parasJson,
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
    // 检查返回值，刷新数据
    // console.log('onshow sourcelistdirty:', app.sourceListDirty);
    if (app.sourceListDirty) {
      this.onLoad();
    }

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