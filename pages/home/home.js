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
      canExchangePoint: 0,  //可以兑换多少积分
    },
    exchangeClass: 'canNotExchange',   //兑换积分按钮样式
    myRink: 0,  //我的排名
    greetings:'早上好～'
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

  onLoad:function(options) {
    app.globalData.shareId = options.id || '0'
    var now = new Date();
    var hour = now.getHours();
    var wh='';
    if (hour < 6) { wh ="凌晨好~"; }
    else if (hour < 9) { wh = "早上好~";}
    else if (hour < 12) { wh = "上午好~"; }
    else if (hour < 14) { wh = "中午好~"; }
    else if (hour < 17) { wh = "下午好~"; }
    else if (hour < 19) { wh = "傍晚好~"; }
    else if (hour < 22) { wh = "晚上好~"; }
    else { wh = "深夜好~"; } 
  
    this.setData({
      greetings: wh,
    })
  },

  onShow: function() {
    var that = this;
    app.appInitData(function(globalData){
      that.initData();
      that.setData({
        userInfo: globalData.userInfo,
      })
    })
  },

  toExchage: function() {
    var that = this;
    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/toExchange',
      method: 'POST',
      header: {
        Authorization: app.globalData.accessTokenData.token_type + ' ' + app.globalData.accessTokenData.access_token,
      },
      data: {
        id: app.globalData.exchangeData[0].id,
      },
      success: function({data}) {
        if (data.code === 1) {
          that.maskToggle();
          that.setData({
            exchangeClass: 'canNotExchange',
          })
        } else {
          alert(data.msg);
        }
      }
    });
  },

  hiddenMask: function() {
    var that = this;
    that.setData({
			isHiddenMask: !that.data.isHiddenMask,
		})
  },

  initData: function() {
    var that = this;
    var data = app.globalData.userData;
    
    if (data.myAddres != 1) {
      wx.showModal({
        title: '温馨提示',
        content: "请先完善个人信息",
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../myData/myData'
            })
          }
        }
      })
    }
    if ( data.ischeck === 0) {
      var signData = {
        signClass: 'sign',
        signTip: '签到',
        signFun: 'goToSign',
      }
    } else {
      var signData = {
        signClass: 'signed',
        signTip: '已签到' + data.checkData + '天',
        signFun: '',
      }
    }
    var pointData = {
      sharePoint: data.shara_points, 
      todayStep: data.run,
      goOnRun: data.basis_run - data.run > 0 ? data.basis_run - data.run : 0,
      isExchangeFun: data.basis_run - data.run < 0 && app.globalData.exchangeData[0].exchange === 0 ? 'maskToggle' : '',
      canExchangePoint: Math.floor(data.run * data.pro),
    }
    that.setData({
        signData: signData,
        pointData: pointData,
        stepPercent: data.run / data.basis_run,
        exchangeClass: data.basis_run - data.run < 0 && app.globalData.exchangeData[0].exchange === 0 ? 'canExchange' : 'canNotExchange',
        myRink: app.globalData.todayRinking.myRank,
      })
    that.getProgress();
   
    if (data.created_at.date === data.updated_at.date) {
      wx.navigateTo({
        url: '../guide/guide'
      })
    }
  },

  

  maskToggle: function() {
    var that = this;
    that.setData({
      isMask: !that.data.isMask,
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
      success: function({data}) {
  
        var signData = {
          signClass: 'signed',
          signTip: '已签到' + data.checkData + '天',
          signFun: '',
        };
        that.setData({
          signData: signData,
        })
       
      }
    });
  },

  onShareAppMessage: function () {

    console.log('转发', '/pages/home/home?id=' + app.globalData.userData.id);

    return {
      title: '完美邀您挑战百万俱乐部',
      path: '/pages/home/home?id=' + app.globalData.userData.id,
    }
  }
})
