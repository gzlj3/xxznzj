const {CONSTS} = requirePlugin("XXZNZJ")
const myBehavior = require('../../xxznzjBehaviors.js')
const menuList = [
  {
    id: 'form',
    name: '学员管理',
    open: false,
    page: 'plugin://XXZNZJ/xyglmain'
  },
  {
    id: 'form',
    name: '教职工管理',
    open: false,
    page: 'plugin://XXZNZJ/staffmain'
  },
  {
    id: 'nav',
    name: '班级管理',
    open: false,
    page: 'plugin://XXZNZJ/classmain'
  },
  {
    id: 'z-index',
    name: '用户中心',
    open: false,
    page: '../user/userGrant'
  },
  {
    id: 'feedback',
    name: '系统配置',
    open: false,
    page: '../sysmanager/sysconfig/sysconfig'
  },
];
const zkMenuList = [
  {
    id: 'widget',
    name: '查看我的帐单',
    open: false,
    page: '../fygl/fyglmain'
  },
] 

Component({
  behaviors: [myBehavior],
  data:{
    menuList
  },
  methods: {
    onLoad: function (options) {
      // console.log('onload:', options);
      this.setData({ onLoadOptions:options});
      // wx.navigateTo({
      //   url: 'plugin://XXZNZJ/xyglmain',
      // })
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