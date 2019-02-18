// plugin/components/edit/input.js
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    value:Object,
    options:{
      type:Object,
      observer(newVal, oldVal, changedPath) {
        // console.log('observer input1 options:', newVal);
        this.setData({ ...newVal});
      }
    },
    // name:String,
    // label:String,
    // type:String,
    // require:{
    //   type: Boolean,
    //   value:false
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {
    weekTimeArray: [['周日', '周一'], ['00','01'], ['00', '01']],
  },
  lifetimes: {
    attached(e) {
      console.log('wrapperinput attacthed:',e);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bubbleEvent:function(e) {
      console.log('bubbleEvent:',e);
      this._setEventDetailId(e);
      this.triggerEvent(e.type, e.detail, {})
    },
    // onInput: function (e) {
    //   // console.log(e);
    //   this._setEventDetailId(e);
    //   this.triggerEvent('input', e.detail, {})
    // },
    // onBlur: function(e){
    //   this._setEventDetailId(e);
    //   this.triggerEvent('blur', e.detail, {})
    // },
    // onChange: function (e) {
    //   // console.log(e);
    //   this._setEventDetailId(e);
    //   this.triggerEvent('change', e.detail, {})
    //   this.triggerEvent('input', e.detail, {})
    //   this.triggerEvent('blur', e.detail, {})
    // },
    onSearchTap:function(e){
      wx.navigateTo({
        url: '../edit/searchdata?searchType='+this.data.searchType,
      })
    },
    _setEventDetailId(e){
      let id = e.target.id;
      if (!id) id = e.currentTarget.id;
      e.detail.id = id;
    }
  }
})
