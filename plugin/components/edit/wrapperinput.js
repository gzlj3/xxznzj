const CONSTS = require('../../utils/constants.js');
const utils = require('../../utils/utils.js');
const comm = require('../../utils/comm.js');
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
    value:String,
    parentid:String,  //输入项为嵌套form内输入项时，保存父fmmetas的id
    innerArrayIndex: String, //输入项为嵌套form内输入项时，保存嵌套值数组的当前下标
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
    // pickerDataArray: [[], ['00','01'], ['00', '01']],
  },
  lifetimes: {
    attached(e) {
      // console.log('wrapperinput attacthed:',e);
      const {type,mode,start,end,value,searchType} = this.data;
      // const { value } = this.properties;
      if(type==='picker' && mode==='weektime'){
        //构建pickerDataArray,选择星期和时间
        const pickerDataArray = this.getPickerDataArray(start,end);
        const pickerDataValue = comm.parseWeektime(value);
        // console.log('wrapperinput attached:',value,pickerDataValue);
        this.setData({ pickerDataArray, pickerDataValue});
      }else if (type === 'picker' && mode === 'search') {
        //构建选择数据列表,从远程提取列表数据
        const response = commServices.queryData(CONSTS.BUTTON_SEARCH, { searchType });
        commServices.handleAfterRemote(response, null,
          (resultData) => { 
            // console.log('search:', resultData);
            let pickerDataArray = [];
            let pickerDataValue = null;
            if(resultData && resultData.length>0){
              pickerDataArray.push(resultData);
              for(let i=0;i<resultData.length;i++){
                if(resultData[i].code === value){
                  pickerDataValue = i;
                  break;
                }
              }
            }
            // console.log(pickerDataArray, pickerDataValue, pickerDataValue>=0?pickerDataArray[0][pickerDataValue].desc:'');
            this.setData({ pickerDataArray, pickerDataValue:[pickerDataValue] });
          }
        );   
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
      const { type, mode, start, end,pickerDataArray } = this.data;
      if (type === 'picker' && mode === 'weektime') {
        //处理weektime，将选择的数组下标转换为值
        const value = e.detail.value;
        e.detail.value = pickerDataArray[0][value[0]] + ' ' + pickerDataArray[1][value[1]] + ':' + pickerDataArray[2][value[2]];
      } if (type === 'picker' && mode === 'search') {
        //将选择的数组下标转换为值
        const pickerDataValue = e.detail.value;
        e.detail.value = pickerDataArray[0][pickerDataValue[0]].code;
        this.setData({ pickerDataValue});
        // console.log(e.detail.value);
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
      e.detail.parentid = this.data.parentid;
      e.detail.innerArrayIndex = this.data.innerArrayIndex;
    },
    getPickerDataArray(start, end) {
      let pickerDataArray = [];
      pickerDataArray.push(['周日', '周一', '周二', '周三', '周四', '周五', '周六']);
      let startTime = [0, 0];
      let endTime = [23, 59];
      // if (!utils.isEmpty(start)) startTime = comm.parseTime(start);
      // if (!utils.isEmpty(end)) endTime = comm.parseTime(end);
      let hourArr = [];
      for (let i = startTime[0]; i <= endTime[0]; i++) {
        hourArr.push(((100 + i) + "").substring(1));
      }
      pickerDataArray.push(hourArr);
      let timeArr = [];
      for (let i = 0; i <= 59; i++) {
        timeArr.push(((100 + i) + "").substring(1));
      }
      pickerDataArray.push(timeArr);
      return pickerDataArray;
    }
  }
})
