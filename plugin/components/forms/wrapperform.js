const app = require('../../app1.js');
const config = require('../../config.js');
const CONSTS = require('../../utils/constants.js');
const utils = require('../../utils/utils.js');
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
    fmMetas:{
      type:Array,
      // observer(newVal, oldVal, changedPath) {
      //   console.log('observer fmMetas:', newVal,oldVal);
      // }
    },
    currentObject:{
      type: Object,
      observer(newVal, oldVal, changedPath) {
        // console.log('observer curentobject:', newVal,oldVal);
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  lifetimes: {
    attached() {
      console.log('wrapperforms attacthed:',this.data.currentObject);
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    validFields: function () {
      let { currentObject,fmMetas } = this.data;
      // console.log('validfields:',currentObject,fmMetas);
      let errFields = '';
      fmMetas.map(meta=>{
        if(meta.require && utils.isEmpty(currentObject[meta.name])){
          errFields += meta.label+',';
        }
      })
      if(!utils.isEmpty(errFields)){
        errFields = errFields.substring(0,errFields.length - 1);
        utils.showToast('请先输入如下字段：'+errFields);
        return false;
      }
      return true;
    },
    getWrapperInput:function(){
      const input = this.selectComponent("#_wrapperinput");
      return input;
    },
    onInputChange: function (e) {
      // console.log('wrapperform oninputchange:',e);
      const {id} = e.detail;
      if(utils.isEmpty(id)) return;
      let { currentObject } = this.data;
      currentObject[id] = e.detail.value;
      if(!utils.isEmpty(e.detail.code)){
        currentObject['_code_'+id] = e.detail.code;
      }
      this.setData({ currentObject });
    },
  },
})
