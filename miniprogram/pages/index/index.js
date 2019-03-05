const {CONSTS} = requirePlugin("XXZNZJ")
const myBehavior = require('../../xxznzjBehaviors.js')
const menuList = [
  {
    name: '学员管理',
    open: false,
    page: 'plugin://XXZNZJ/xyglmain'
  },
  {
    name: '教职工管理',
    open: false,
    rights: ['102'],
    page: 'plugin://XXZNZJ/staffmain'
  },
  {
    name: '班级管理',
    open: false,
    rights: ['103'],
    page: 'plugin://XXZNZJ/classmain'
  },
  {
    name: '授权管理',
    open: false,
    rights: ['104'],
    page: 'plugin://XXZNZJ/userGrant'
  },
];

Component({
  behaviors: [myBehavior],
  data:{
    menuList,
  },
  methods: {
    onLoad: function (options) {
      this.setData({ onLoadOptions:options}); 
    },
    onGetUserInfo: function(e){
      console.log('host get user....:',e);
      this.setData({ hostUserInfo: e.detail})
    },
    onGetPhoneNumber:function(e){
      console.log('host getPhoneNumber:', e);
      this.setData({ phoneNumber: e.detail })
    }
  }
})