const CONSTS = require('../../utils/constants.js');
const utils = require('../../utils/utils.js');
const comm = require('../../utils/comm.js');
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    value:String,
    options:{
      type:Object,
      observer(newVal, oldVal, changedPath) {
        // console.log('observer input1 options:', newVal);
        this.setData({ ...newVal});
      } 
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // weekTimeArray: [[], ['00','01'], ['00', '01']],
  },
  lifetimes: {
    attached(e) {
      // console.log('wrapperinput attacthed:',e);
      const {type,mode,start,end,value} = this.data;
      // const { value } = this.properties;
      if(type==='picker' && mode==='weektime'){
        //构建weekTimeArray,选择星期和时间
        const weekTimeArray = this.getWeekTimeArray(start,end);
        const codeWeektime = comm.parseWeektime(value);
        // console.log('wrapperinput attached:',value,codeWeektime);
        this.setData({ weekTimeArray, codeWeektime});
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bubbleEvent:function(e) {
      // console.log('bubbleEvent:',e);
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
    onChange: function (e) {
      const { type, mode, start, end,weekTimeArray } = this.data;
      if (type === 'picker' && mode === 'weektime') {
        //处理weektime，将代码转换为值
        const value = e.detail.value;
        e.detail.value = weekTimeArray[0][value[0]] + ' ' + weekTimeArray[1][value[1]] + ':' + weekTimeArray[2][value[2]];
      }
      this.bubbleEvent(e);
    },
    onSearchTap:function(e){
      wx.navigateTo({
        url: '../edit/searchdata?searchType='+this.data.searchType,
      })
    },
    _setEventDetailId(e){
      let id = e.target.id;
      if (!id) id = e.currentTarget.id;
      e.detail.id = id;
    },
    getWeekTimeArray(start, end) {
      let weekTimeArray = [];
      weekTimeArray.push(['周日', '周一', '周二', '周三', '周四', '周五', '周六']);
      let startTime = [0, 0];
      let endTime = [23, 59];
      // if (!utils.isEmpty(start)) startTime = comm.parseTime(start);
      // if (!utils.isEmpty(end)) endTime = comm.parseTime(end);
      let hourArr = [];
      for (let i = startTime[0]; i <= endTime[0]; i++) {
        hourArr.push(((100 + i) + "").substring(1));
      }
      weekTimeArray.push(hourArr);
      let timeArr = [];
      for (let i = 0; i <= 59; i++) {
        timeArr.push(((100 + i) + "").substring(1));
      }
      weekTimeArray.push(timeArr);
      return weekTimeArray;
    }
  }
})
