//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    accessTokenData: {},
    rotate0: -45,
    rotate1: -45,
    rotate2: -45,
    pointLeft: 0,
    pointBottom: 0,
    isExplain: false,
    hasExchange: false, 
    isHiddenMask: false,
    isHiddenGuide: false,
    stepPercent: 0,
    signData: {
      signClass: 'sign',
      signTip: '签到',
      signFun: 'goToSign',
    },
    pointData: {
      sharePoint: 0,  //邀请获得积分
      todayStep: 0,   //今日的步数
      goOnRun: 0,    //还要继续走多少步才能兑换积分
      isExchangeFun: '',   //兑换积分按钮函数
      exchangeClass: 'canNotExchange',   //兑换积分按钮样式
      canExchangePoint: 0,  //可以兑换多少积分
    }
  },
  // isExplain: header.explainTipToggle,
  getExchangeClass: function() {
    var that = this;
  },
  explainTipToggle: function() {
    var that = this;
		that.setData({
			isExplain: !that.data.isExplain
		})
  },
  share: function(){
    console.log('00000000000')
  },
  getProgress: function() {
    var that = this;
    var getData = that.data.stepPercent * 100 > 100 ? 100 : that.data.stepPercent * 100;
    var rotate0 = getData*2.69-45;
    var rotate1 = getData*2.69-45 < 135 ? getData*2.69-45 : 135;
    var rotate2 = getData*2.69-45 < 224 ? getData*2.69-45 : 224;
    that.setData({
      rotate0: rotate0,
      rotate1: rotate1,
      rotate2: rotate2,
    })
  },

  onLoad: function () {
    var that = this
    // that.getWxRunData();
    app.getUserInfo(function(userInfo){
      console.log('userInfo:', userInfo)
      that.setData({
        userInfo:userInfo,
      })
      that.getProgress();
    })
    try {
      var value = wx.getStorageSync('access_token')
      if (value) {
        that.setData({
          accessTokenData: value,
        })
        that.getUserData();
      }
    } catch (e) {
    }
  },

  hiddenMask: function() {
    var that = this;
    that.setData({
			isHiddenMask: !that.data.isHiddenMask,
		})
  },

  getUserData: function(){
    var that = this;
    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/user',
      header: {
        Authorization: that.data.accessTokenData.token_type + ' ' + that.data.accessTokenData.access_token,
      },
      success: function({data}) {
        console.log('getUserData:', data);
        if (data.ischeck === 0) {
          var signData = {
            signClass: 'sign',
            signTip: '签到',
            signFun: 'goToSign',
          }
        } else {
          var signData = {
            signClass: 'signed',
            signTip: '已签到',
            signFun: '',
          }
        }
        var pointData = {
          sharePoint: data.shara_points, 
          todayStep: data.run,
          goOnRun: data.basis_run - data.run > 0 ? data.basis_run - data.run : 0,
          isExchangeFun: data.basis_run - data.run > 0 ? '' : 'maskToggle',
          exchangeClass: data.basis_run - data.run > 0 ? 'canNotExchange' : 'canExchange',
          canExchangePoint: Math.floor(data.run * data.pro),
        }
        that.setData({
            signData: signData,
            pointData: pointData,
            stepPercent: data.run / data.basis_run,
          })
        if (data.created_at.date === data.updated_at.date) {
          wx.navigateTo({
            url: '../guide/guide'
          })
        }
      }
    });
  },

  maskToggle: function() {
    var that = this;
    that.setData({
      isMask: !that.data.isMask,
    })
  },

  getWxRunData: function() {
    var that = this;
    wx.getWeRunData({
      success(res) {
        console.log('getWxRunData:', res);
        const encryptedData = res.encryptedData
      }
    })
  },

  goToSign: function() {
    var that = this;
    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/check',
      method: 'POST',
      header: {
        Authorization: that.data.accessTokenData.token_type + ' ' + that.data.accessTokenData.access_token,
      },
      success: function(res) {
        console.log('goToSign:', res);
      }
    });
  }
})
