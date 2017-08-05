//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
  },
  onLoad: function () {
  },
  toMyDataPage: function() {
    wx.navigateTo({
      url: '../myData/myData'
    })
  }
})
