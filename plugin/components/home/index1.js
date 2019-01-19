// plugin/components/home/index1.js
Component({
    /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGetUserInfo(e) {
      console.log(e);
      // console.log(e.detail.code) // wx.login 的 code
      // console.log(e.detail.userInfo) // wx.getUserInfo 的 userInfo
    }
  }  
})
