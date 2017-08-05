//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    rotate0: -45,
    rotate1: -45,
    rotate2: -45,
    pointLeft: 0,
    pointBottom: 0,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getProgress: function() {
    var getData = 90;
    var rotate0 = getData*2.69-45;
    var rotate1 = getData*2.69-45 < 135 ? getData*2.69-45 : 135;
    var rotate2 = getData*2.69-45 < 224 ? getData*2.69-45 : 224;
    this.setData({
      rotate0: rotate0,
      rotate1: rotate1,
      rotate2: rotate2,
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      that.getProgress();
    })
  }
})
