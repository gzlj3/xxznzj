// import * as CONSTS from '../../utils/constants.js';
// // import moment from '../../utils/moment-with-locales.min.js';
import moment from '../../utils/moment.min.js';
// import * as fyglService from '../../services/fyglServices.js'; 
// const utils = require('../../utils/utils.js');
const app = require('../../app1.js');
const config = require('../../config.js');
const CONSTS = require('../../utils/constants.js');
const utils = require('../../utils/utils.js');
const comm = require('../../utils/comm.js');
const commServices = require('../../services/commServices.js');

const initialState = {
  // status: CONSTS.REMOTE_SUCCESS, // 远程处理返回状态
  // msg: '', // 远程处理返回信息
  // emptyAvatarUrl: '../../images/avatar-empty.png',
  // fyList: [], // 当前操作的房源列表数据
  // allFyList:[], //总房源列表数据
  // currentObject: {}, // 当前form操作对象
  // sourceList: [], // 保存列表
  // selectedRowKeys: [], // 列表选中行
  // buttonAction: CONSTS.BUTTON_NONE, // 当前处理按钮（动作）
  modalVisible: false, // 显示弹框
  modalTitle: '', // 弹框属性标题
  // modalWidth: 1000, // 弹框属性宽度
  modalOkText: '确定', // 弹框属性确定按钮文本
  modalCancelText: '取消', // 弹框属性确定按钮文本
  // modalOkDisabled: false, // 弹框属性确定按钮可点击状态
  classList:[],  //班级列表
  sourceList:[],  //当前显示班级的学员列表
  tabItems:[], 
  activeIndex:0, 
  haveRight101:false,  //是否具有学员维护权限（101）
  emptyAvatarUrl: '../../images/avatar-empty.png',
}; 
// const fmMetas = [
//   { label: '学员姓名', name: 'xyxm', require: true },
//   { label: '家长姓名', name: 'jzxm', require: true },
//   { label: '家长手机号', name: 'sjhm', require: true },
//   { label: '所属班级', name: 'class', type: 'search', searchType: 'class' },
// ]
const tablename = 'student';
const fmName = 'student';
Page({

  /**
   * 页面的初始数据
   */
  data: initialState, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const user = app.getGlobalData().user;
    this.setData({ user: app.getGlobalData().user, haveRight101:comm.checkRights('101') });
    // console.log(this.data.haveRight101);
    // fyglService.checkAuthority(1);
    // let arr = 'aaaa';
    // arr = ['aaa'];
    // console.log(moment().add(12,'months'));
    
    // console.log('test:', moment("20190328 09:00:00", "YYYYMMDD HH:mm:ss").fromNow());
    // this.queryList(this.data.activeIndex);
    // console.log('====:',utils['parseInt']());
    const tablename = 'class'; 
    const response = commServices.queryData(CONSTS.BUTTON_STUSIGNIN);
    commServices.handleAfterRemote(response, null,
      (resultData) => {
        // console.log('onload xxylmain:', resultData);
        this.refreshTabItems(resultData);
        if(user.userType===CONSTS.USERTYPE_ZK){
          this.refreshSourceList(resultData,this.data.activeIndex);
        }else{
          this.querySourceList(this.data.activeIndex);
        }
        // this.refreshSourceList(resultData);
        app.sourceListDirty = false;
      }
    );   

  }, 
  refreshTabItems: function (resultData) {
    if(!resultData) resultData = {}; 
    let {classList=[],activeIndex=0,sourceList=[]} = resultData;
    // if(!classList) classList = [];
    let tabItems = [];
    if (this.data.user.userType === CONSTS.USERTYPE_ZK) {
      tabItems.push('我的签到学员');
      activeIndex = this.data.activeIndex;
    }else{
      classList.map(value=>{
        tabItems.push(value.bjmc);
      });
    }
    //如果activeIndex>0，则不修改
    if(this.data.activeIndex>0) {
      activeIndex = this.data.activeIndex;
    }
    this.setData({ classList, tabItems, activeIndex, sourceList});
  },

  querySourceList:function(activeIndex){
    const {classList} = this.data;
    if(!classList || classList.length<1) return;
    const classObj = classList[activeIndex];
    const querycond = classObj._id ? { class: { class: classObj._id } } : { class: [{}] };
    const orderby = ['signin','asc'];
    const response = commServices.queryData(CONSTS.BUTTON_QUERYFY, { tablename, fmName, querycond, orderby});
    // const response = commServices.queryData(CONSTS.BUTTON_QUERYFY, { tablename, fmName, querycond: { class:[{}]   }});
    commServices.handleAfterRemote(response, null,
      (resultData) => {
        // console.log(resultData);
        this.refreshSourceList(resultData, activeIndex);
        // getApp().setFyListDirty(false); 
        // this.refreshFyList(resultData);
      } 
    );   
  },
  refreshSourceList: function (sourceList, activeIndex) {
    // console.log(sourceList);
    if(!sourceList) sourceList = [];
    let sourceListItems = [];

    const beforeNow = moment().subtract(config.signinInterval, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    const now = moment().startOf('day');

    sourceList.map(value => {
      let signined = false;
      if(value.signin){
        signined = value.signin > beforeNow;
      }
      let chargeValid = true;
      let progressState = {
        backgroundColor: 'default',
        activeColor: 'default',
        percent: 0,
      };
      if(value.charge && value.yxq){
      //计算充值有效期进度条
        const yxq = moment(value.yxq, 'YYYY-MM-DD');  //有效期至
        const czrq = moment(value.charge, 'YYYY-MM-DD');  //充值日期
        // console.log('yxq:',yxq,now,yxq>=now);
        chargeValid = yxq>=now;
        if(chargeValid){ 
          const totalYxqdays = yxq.clone().diff(czrq,'days');  //总的有效天数
          const usedDays = now.clone().diff(czrq,'days');  //已过天数
          const percent = Math.round(usedDays / totalYxqdays * 100);
          progressState.percent = percent;
          if (percent >= 95) progressState.activeColor = 'yellow';
          console.log(totalYxqdays,usedDays,progressState);
        }else{ 
          progressState.activeColor = 'red';
          progressState.percent = 100;
        }

      }
      sourceListItems.push({
        avatarUrl: value.avatarUrl,
        title: `${value.xyxm}(家长:${value.jzxm})`,
        desc: `剩余课次:${value.cs?value.cs:0}`,
        desc1: `最近签到:${signined ? '(已签到)' : (value.signin ? value.signin : '')}`,
        desc2: `有效期至:${value.yxq ? (value.yxq +(chargeValid?'(有效)':'(已失效)')):''}`,
        signined,
        chargeValid,
        progressState
      })
    });
    let { tabItems, classList} = this.data;
    if(this.data.classList.length>0){
      tabItems[activeIndex] = classList[activeIndex].bjmc+'(人数:'+sourceList.length+')';
    }
    this.setData({ sourceList,sourceListItems,tabItems,activeIndex});
  },
  onAdd: function () {
    const buttonAction = CONSTS.BUTTON_SAVEOTHERDATA;
    const paras = { buttonAction,fmName, tablename, unifield: 'xyxm' }
    const parasJson = JSON.stringify(paras);
    wx.navigateTo({
      url: '../edit/editdata?item=' + parasJson,
    })
  },
  onBodyTap: function (e) {
    // console.log('onbodytap:',e);
    if(!this.data.haveRight101) return;
    this.modifyData(e);
  },
  modifyData: function (e) {
    const { index } = e.detail;
    const pos = utils.getInteger(index);
    const currentObject = this.data.sourceList[pos];
    const buttonAction = CONSTS.BUTTON_SAVEOTHERDATA;
    const paras = { buttonAction,fmName, tablename, unifield: 'xyxm', currentObject }
    const parasJson = JSON.stringify(paras);
    wx.navigateTo({
      url: '../edit/editdata?item=' + parasJson,
    })
  },

  onTabPageChanged: function(e){
    // console.log("tabPageChanged:",e);
    this.querySourceList(e.detail.activeIndex);
    // this.setData({ activeIndex: e.detail.activeIndex});
  },

  onCharge:function(e){
    // console.log('oncharge:',e);
    const pos = utils.parseInt(e.target.id);
    if(pos===-1){
      utils.showToast('点击异常：' + e.target.id);
      return;
    }
    const currentObject = this.data.sourceList[pos];
    const { name, nickName, sjhm } = app.getGlobalData().user;
    // currentObject
    const initialValue = { name, nickName, parentid: currentObject._id};
    const paras = { fmName: 'charge', tablename: 'charge', initialValue,buttonAction:CONSTS.BUTTON_STUCHARGE} 
    const parasJson = JSON.stringify(paras);
    wx.navigateTo({
      url: '../edit/editdata?item=' + parasJson,
    })

  },
  onSignin: function (e) {
    const pos = utils.parseInt(e.target.id);
    if (pos === -1) {
      utils.showToast('点击异常：' + e.target.id);
      return;
    }
    const currentObject = this.data.sourceList[pos];
    const self = this;
    utils.showModal('签到', `将会扣减学员(${currentObject.xyxm})的1次课次，确定签到吗？`, () => { self.startSignin(currentObject); });
  },

  startSignin: function (currentObject,cs) {
    if(!cs) cs = 1;
    const { name, nickName, sjhm } = app.getGlobalData().user;
    const formObject = { parentid: currentObject._id, name, nickName, sjhm,cs }
    const response = commServices.postData(CONSTS.BUTTON_STUSIGNIN, { formObject, tablename: 'signin' });
    // console.log(buttonAction+"===:"+CONSTS.getButtonActionInfo(buttonAction));
    commServices.handleAfterRemote(response, '签到',
      (resultData) => {
        this.onLoad();
        // this.querySourceList(this.data.activeIndex);
        // this.refreshSourceList(resultData);
      }
    )
  },
  onSigninMore: function (e) {
    const pos = utils.parseInt(e.target.id);
    if (pos === -1) {
      utils.showToast('点击异常：' + e.target.id);
      return;
    }
    let itemList, itemIndex;
    itemList = ['签2次', '签3次', '签4次', '签5次', '取消'];
    const currentObject = this.data.sourceList[pos];
    const self = this;
    wx.showActionSheet({
      itemList,
      success: function (res) {
        // console.log(res);
        if (res.cancel) return;
        const index = res.tapIndex;
        // console.log(index);
        if(index>=0 && index<=3){
          utils.showModal('签到', `将会扣减学员(${currentObject.xyxm})的${index+2}次课次，确定签到吗？`, () => { self.startSignin(currentObject,index+2); });
        }
      }
    });
  },



  onMoreAction(e){
    const { userType } = app.getGlobalData().user;
    // const { item,fyitem } = e.currentTarget.id;
    // console.log("moreAction:",item);

    let itemList;
    // if(userType===CONSTS.USERTYPE_ZK){
    //   this.actionSheet1(e);
    // }else{
      this.actionSheet1(e);
    // }
  },

  actionSheet1: function(e){
    const pos = utils.parseInt(e.target.id);
    if (pos === -1) {
      utils.showToast('点击异常：' + e.target.id);
      return;
    }
    let itemList,itemIndex;
// console.log('usertype:',this.data.userType);
    if (this.data.user.userType === CONSTS.USERTYPE_FD || this.data.haveRight101) { 
      itemList = ['充值记录', '签到记录', '请假','删除学员', '取消'];
      itemIndex = [0, 1, 2,3,4,-1];
    } else {
      itemList = ['充值记录', '签到记录', '请假','取消'];
      itemIndex = [0,1,2,-1];
    } 
    const item = this.data.sourceList[pos];
    const self = this;
    wx.showActionSheet({
      itemList,
      success: function (res) {
        // console.log(res);
        if (res.cancel) return;
        const index = res.tapIndex;
        // console.log(index);
        switch (index) { 
          case itemIndex[0]:
            self.queryHistroy(e,'charge');
            break;
          case itemIndex[1]:
            self.queryHistroy(e, 'signin');
            break;
          case itemIndex[2]:   //请假
            const qjrq = moment().format('YYYY-MM-DD');
            self.setData({
              qjrq,
              qjItem: item,
              modalVisible: true,
              modalTitle: '请输入请假日期',
            });
            break;
          case itemIndex[3]:
            utils.showModal('删除学员', '删除后将不能恢复，你真的确定删除当前学员吗？', () => { self.deleteData(item._id); });
            break;
        }
      }
    });
  },
  deleteData(id) {
    // console.log("deletefy:" + houseid);
    const response = commServices.postData(CONSTS.BUTTON_DELETEFY, { tablename:'student',id });
    commServices.handleAfterRemote(response, '删除学员',
      (resultData) => {
        this.querySourceList(this.data.activeIndex);
      });
  },

  queryHistroy: function (e,searchType) {
    const pos = utils.parseInt(e.target.id);
    if (pos === -1) {
      utils.showToast('点击异常：' + e.target.id);
      return;
    }
    const currentObject = this.data.sourceList[pos];
    // console.log(currentObject);
    // const searchType = e.target.dataset.searchtype;
    const appendCond = JSON.stringify({ parentid: currentObject._id });
    const url = `../search/searchlist?searchType=${searchType}&appendCond=${appendCond}`;
    // console.log(url);
    wx.navigateTo({ 
      url
    });
  },

  onQjInputBlur: function (e) {
    const name = e.target.id;
    this.setData({ qjrq: e.detail.value });
  },

  modalConfirm: function () {
    this.setData({ modalVisible: false });
    const self = this;
    const { qjItem: item, qjrq } = this.data;
    utils.showModal('请假', `请假后将不能取消，你确定在${qjrq}请假吗？`, () => { self.qj(item._id, qjrq); });
  },

  qj(stuid, qjrq) {
    console.log("qj:", stuid, qjrq);
    const response = fyglService.postData(CONSTS.BUTTON_STULEAVE, { stuid, qjrq });
    fyglService.handleAfterRemote(response, '请假',
      (resultData) => {
        console.log('qj:',resultData);
        // this.refreshFyList(resultData)
      });
  },

  modalCancel: function(){
    this.setData({modalVisible:false});
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
    this.onLoad();
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