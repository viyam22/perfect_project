//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    exchangeClass: 'exchange',
    isExchageTip: '兑换成积分',

  },
  //事件处理函数
  exchangePoints: function(e) {
    var that = this;
    that.setData({
      exchangeClass: 'exchanged',
      isExchageTip: '已兑换',
    })
  },
  onLoad: function () {
  }
})
