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
      observer(newVal, oldVal, changedPath) {
        // console.log('observer fmMetas:', newVal,oldVal);
      }
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
    attached(e) {
      // console.log('wrapperform attacthed:', this.data.fmMetas);
    },
    ready(e){
      // console.log('wrapperform ready:', this.data.fmMetas);
      //赋初始值
      let {fmMetas,currentObject} = this.data;
      fmMetas.map(value=>{
        if(value.initialValue){
          //如果有初始值配置，则赋值
          if(value.type==='multi'){
            if (!currentObject[value.name]) currentObject[value.name] = [];
            if (currentObject[value.name].length<1){
              currentObject[value.name].push(value.initialValue);
            }
          }else{
            currentObject[value.name] = value.initialValue;
          }
        }
      });
      this.setData({currentObject});
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
      // let errValidFields = '';
      fmMetas.map(meta=>{
        let info = '';
        if(meta.type==='multi'){
          // console.log('meta.fields',meta.fields);
          meta.fields.map(innerMeta=>{
            // console.log('currentObject[meta.name]', currentObject[meta.name]);
            currentObject[meta.name].map(innerValue=>{
              info = this.validField(innerMeta, innerValue[innerMeta.name]);
              if (!utils.isEmpty(info)) errFields += info;
            })
          })
        }else{
          info = this.validField(meta, currentObject[meta.name]);
          if (!utils.isEmpty(info)) errFields += info;
        }
      })
      if (!utils.isEmpty(errFields)){
        errFields = errFields.substring(0, errFields.length - 1);
        utils.showToast('校验错误：'+errFields);
        return false;
      }
      // if (!utils.isEmpty(errValidFields)) {
      //   errValidFields = errValidFields.substring(0, errValidFields.length - 1);
      //   utils.showToast('有如下字段输入有误：' + errValidFields);
      //   return false;
      // }
      return true;
    },

    validField:function(meta,value){
      if (meta.require && utils.isEmpty(value)) {
        return meta.label + '未输入,';
      } 
      if (!utils.isEmpty(meta.valid)) {
        if (!utils.valid(value, meta.valid)) {
          return meta.label + '输入有误,';
        }
      }
      return '';
    },
    // getWrapperInput:function(){
    //   const input = this.selectComponent("#_wrapperinput");
    //   return input;
    // },
    onAddInnerArray:function(e){
      let id = e.target.id;
      let { currentObject } = this.data;
      if (!currentObject[id]) currentObject[id] = [];
      currentObject[id].push({});
      this.setData({ currentObject });
    },
    onDeleteInnerArray: function (e) {
      let id = e.target.id;
      let { currentObject } = this.data;
      currentObject[id].pop();
      this.setData({ currentObject });
    },
    onInputChange: function (e) {
      // console.log('wrapperform oninputchange:',e);
      const { id, parentid,innerArrayIndex,code,value} = e.detail;
      if(utils.isEmpty(id)) return;
      let { currentObject } = this.data;
      if(!utils.isEmpty(parentid)){
        //有parentid,说明是嵌套输入项，则赋值到输入的子元素中
        currentObject[parentid][innerArrayIndex][id] = value;
      }else{
        currentObject[id] = value;
      }
      if(!utils.isEmpty(code)){
        currentObject['_code_'+id] = code;
      }
      this.setData({ currentObject });
    },
  },
})
