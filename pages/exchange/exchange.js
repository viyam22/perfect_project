//index.js
//获取应用实例
var component = require('../../templates/component.js');
var app = getApp()
Page({
  data: {
    userInfo: {},
    isMask: false,
    exchangeData: {},
    exchangeId: null,
    exchangeRun: null,
    exchangePoint: null,
    exchangeIndex: null,
  },
  //事件处理函数

  toExchange: function() {
    var that = this;
    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/toExchange',
      method: 'POST',
      header: {
        Authorization: app.globalData.accessTokenData.token_type + ' ' + app.globalData.accessTokenData.access_token,
      },
      data: {
        id: that.data.exchangeId,
      },
      success: function({data}) {
        console.log('toExchage:', data);
        if (data.code === 1) {
          var exchangeData = that.data.exchangeData;
          exchangeData[that.data.exchangeIndex].exchange = 1;
          that.setData({
            exchangeData: exchangeData,
            isMask: !that.data.isMask,
          })
        } else {
          alert(data.msg);
        }
      }
    });
  },

  maskPlay: function({target: {dataset}}) {
    var that = this;
    console.log('eeee', dataset);
    that.setData({
      isMask: !that.data.isMask,
      exchangeId: dataset.id || '',
      exchangeRun: dataset.run || '',
      exchangePoint: dataset.run ? Math.floor(dataset.run * app.globalData.userData.pro) : '',
      exchangeIndex: dataset.index || '',
    })
  },

  exchangePoints: function(e) {
    var that = this;
    that.setData({
      exchangeClass: 'exchanged',
      isExchageTip: '已兑换',
    })
  },
  
  onShow: function () {
    console.log('onLoad')
    var that = this;
    var exchangeData = app.globalData.exchangeData;
    for(var i = 0, len = exchangeData.length; i < len; i++) {
      exchangeData[i].exchange = exchangeData[i].run >= app.globalData.userData.basis_run && exchangeData[i].exchange === 0 ? 0 : 1;
    }
    var userInfo = {
      nickName: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      todayRun: app.globalData.userData.run,
      myPoint: app.globalData.userData.integral,
      myRink: app.globalData.todayRinking.myRank,
    }
    that.setData({
      exchangeData: exchangeData,
      userInfo: userInfo,
    })
  },
})
