module.exports = Behavior({
  data: {
    pageLoadOptions: {a:'aaaa'}
  },
  attached() { },
  methods: {
    method1() { 
      console.log('method1 call');
    }
  }
})