//index.js
//获取应用实例
var component = require('../../templates/component.js');
var app = getApp()
Page({
  data: {
    userInfo: {},
    exchangeClass: 'exchange',
    isExchageTip: '兑换成积分',
    isMask: false,
  },
  //事件处理函数

  maskToggle: function() {
    var that = this;
    that.setData({
      isMask: !that.data.isMask,
    })
  },

  exchangePoints: function(e) {
    var that = this;
    that.setData({
      exchangeClass: 'exchanged',
      isExchageTip: '已兑换',
    })
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
})
