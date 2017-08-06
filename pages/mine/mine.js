//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
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

  toMyDataPage: function() {
    wx.navigateTo({
      url: '../myData/myData'
    })
  }
})
