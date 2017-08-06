//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    signPoint: null,
    sharePoint: null,
    isSign: null,
  },
  
  onLoad: function () {
    console.log('onLoad')
    var that = this;
    var userInfo = {
      nickName: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      todayRun: app.globalData.userData.run,
      myPoint: app.globalData.userData.integral,
      myRink: app.globalData.todayRinking.myRank,
    }
    that.setData({
      userInfo: userInfo,
      signPoint: app.globalData.userData.b_points,
      sharePoint: app.globalData.userData.shara_points,
      isSign: app.globalData.userData.ischeck,
    })
  },

  toMyDataPage: function() {
    wx.navigateTo({
      url: '../myData/myData'
    })
  },

  goToSign: function() {
    var that = this;
    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/check',
      method: 'POST',
      header: {
        Authorization: app.globalData.accessTokenData.token_type + ' ' + app.globalData.accessTokenData.access_token,
      },
      success: function(res) {
        that.setData({
          isSign: 1,
        })
      }
    });
  }
})
