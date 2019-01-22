module.exports = Behavior({
  data: {
    pageLoadOptions: {a:'aaaa'},
    hostUserInfo:null,
  },
  attached() { },
  methods: {
    method1() { 
      console.log('method1 call');
    }
  }
})