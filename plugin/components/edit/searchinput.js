// plugin/components/edit/searchinput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  data: {
    inputShowed: false,
    inputVal: ""
  },

  methods: {
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
  }
})
