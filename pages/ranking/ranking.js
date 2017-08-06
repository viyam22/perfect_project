var app = getApp()
Page({
  data: {
    tagDayClass: 'tag-green',
    tagTotalClass: '',
    userInfo: {},
  },

  onReady: function () {
    console.log('onLoad')
    var that = this;
    app.getUserInfo(function(userInfo){
      console.log('userInfo:', userInfo)
      that.setData({
        userInfo:userInfo
      })
    })
  },

  selectTag: function(e) {
    var that = this;
    if (e.target.dataset.index == 0) {
      that.setData({
        tagDayClass: 'tag-green',
        tagTotalClass: '',
      })
    } else if (e.target.dataset.index == 1) {
      that.setData({
        tagDayClass: '',
        tagTotalClass: 'tag-green',
      })
    }
  },
  onLoad: function () {
  }
})
