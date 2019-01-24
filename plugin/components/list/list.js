Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    listItems: Array,
    fields:Object,
  },

  data: {
    emptyAvatarUrl: '../../images/avatar-empty.png',
  },
  attached: function(){
    // 可以在这里发起网络请求获取插件的数据
    // this.setData({
    //   list: [{
    //     name: '电视',
    //     price: 1000
    //   }, {
    //     name: '电脑',
    //     price: 4000
    //   }, {
    //     name: '手机',
    //     price: 3000
    //   }]
    // })
  },
})