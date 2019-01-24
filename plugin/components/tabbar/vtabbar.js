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
    tabItems:Array,
    activeIndex:{
      type: Number,
      value:0
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    activePageHidden:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTabPageTap(e){
      // console.log('onTabPageTap:', e);
      const id = utils.getInteger(e.currentTarget.id);
      if(id!==this.data.activeIndex){
        const myEventDetail = {activeIndex:id,oldIndex:this.data.activeIndex} 
        const myEventOption = {}
        this.setData({ activeIndex: id, activePageHidden:false})
        this.triggerEvent('tabpagechanged', myEventDetail, myEventOption)
      }else{
        this.setData({ activePageHidden: !this.data.activePageHidden })
      }
    }
  }
})
