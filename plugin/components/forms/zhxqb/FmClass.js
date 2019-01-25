const fmMetas = [
  { label: '班级名称', name: 'bjmc', require: true },
  { label: '老师姓名', name: 'lsxm' },
  { label: '身份证号', name: 'sfzh', type: 'idcard' },
  { label: '手机号码', name: 'sjhm', type: "number" }
]

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    currentObject: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    fmMetas
  },

  /**
   * 组件的方法列表
   */
  methods: {
  }
})
