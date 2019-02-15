const app = require('../../app1.js');
const config = require('../../config.js');
const CONSTS = require('../../utils/constants.js');
const utils = require('../../utils/utils.js');
const commServices = require('../../services/commServices.js');

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    sourceList:[],
    sourceListItems:[],
  },

  lifetimes: {
    attached() {
      this.querySourceList();
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    querySourceList: function () {
      const response = commServices.queryData(CONSTS.BUTTON_STUSIGNIN);
      commServices.handleAfterRemote(response, null,
        (resultData) => {
          // console.log(resultData);
          this.refreshSourceList(resultData);
        }
      );
    }, 
    refreshSourceList: function (sourceList) {
      if (!sourceList) sourceList = [];
      let sourceListItems = [];
      sourceList.map(value => {
        sourceListItems.push({ 
          title: `${value.xyxm}(家长:${value.jzxm})`,
          desc: `剩余课次:${value.cs ? value.cs : 0}`,
          desc1:`最近签到:${value.signin?value.signin:''}`
        })
      });
      this.setData({ sourceList, sourceListItems});
    },
    onSignin: function(e){
      const pos = utils.parseInt(e.target.id);
      if (pos === -1) {
        utils.showToast('点击异常：' + e.target.id);
        return;
      }
      const currentObject = this.data.sourceList[pos];
      const self = this;
      utils.showModal('签到', `签到将会扣减学员(${currentObject.xyxm})的1次课次，确定签到吗？`, () => { self.startSignin(currentObject); });
    },
    startSignin: function(currentObject){
      const {name,nickName,sjhm} = app.getGlobalData().user;
      const formObject = {parentid:currentObject._id,name,nickName,sjhm}
      const response = commServices.postData(CONSTS.BUTTON_STUSIGNIN, { formObject, tablename:'signin'}); 
      // console.log(buttonAction+"===:"+CONSTS.getButtonActionInfo(buttonAction));
      commServices.handleAfterRemote(response, '签到',
        (resultData) => {
          this.refreshSourceList(resultData);
        }
      )
    },
    onQueryHistroy: function (e) {
      const pos = utils.parseInt(e.target.id);
      if (pos === -1) {
        utils.showToast('点击异常：' + e.target.id);
        return; 
      }
      const currentObject = this.data.sourceList[pos];
      // console.log(currentObject);
      const searchType = e.target.dataset.searchtype;
      const appendCond = JSON.stringify({parentid:currentObject._id});
      const url = `plugin://XXZNZJ/searchlist?searchType=${searchType}&appendCond=${appendCond}`;
      // console.log(url);
      app.getHostWx().navigateTo({
        url
      });
    },
    onSeeCharge: function (e) {
      app.getHostWx().navigateTo({
        url: 'plugin://XXZNZJ/searchlist?searchType=charge',
      });
    },

  }
})
