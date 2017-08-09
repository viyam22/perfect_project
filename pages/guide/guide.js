//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    isHiddenMask: false,
  },
  //事件处理函数
  hiddenMask: function() {
    var that = this;
    that.setData({
			isHiddenMask: !that.data.isHiddenMask,
		})
  },
  explainTipToggle: function() {
    var that = this;
		that.setData({
			isExplain: !that.data.isExplain,
		})
  },
  toHome: function() {
    wx.navigateBack({
      url: '../home/home'
    })
  },
  onLoad: function () {
  }
})
