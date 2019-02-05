Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },
  /**
   * 传入参数列表中值对象格式：
   * {
   *  desc:  列表项描述
   * }
   */
  properties: {
    listItems: Array,
    // fields:Object,
  },

  data: {
    // emptyAvatarUrl: '../../images/avatar-empty.png',
  },
  attached: function () { },
  methods: {
    // onAvatarTap: function (e) {
    //   this._setEventDetailId(e);
    //   this.triggerEvent('avatartap', e.detail, {})
    // },

    onBodyTap: function (e) {
      this._setEventDetailId(e);
      // console.log('list bodytap:',e);
      this.triggerEvent('bodytap', e.detail, {})
    },
    _setEventDetailId(e) {
      let id = e.target.id;
      if (!id) id = e.currentTarget.id;
      e.detail.index = id;
    }
  }
})