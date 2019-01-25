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
    currentObject:Object,
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput: function (e) {
      this._setEventDetailId(e);
      this.triggerEvent('input', e.detail, {})
    },
    onBlur: function(e){
      this._setEventDetailId(e);
      this.triggerEvent('blur', e.detail, {})
    },
    onChange: function (e) {
      this._setEventDetailId(e);
      this.triggerEvent('input', e.detail, {})
      this.triggerEvent('blur', e.detail, {})
    },
    _setEventDetailId(e){
      let id = e.target.id;
      if (!id) id = e.currentTarget.id;
      e.detail.id = id;
    }
  }
})
