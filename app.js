//app.js
App({
  onLaunch: function() {
    var that = this;
    that.getUserInfo();
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },

  getAccessToken: function(openid) {
    var that = this;
    var myDate = new Date().getTime();
    console.log('测试', that.globalData.userInfo)
    wx.request({
      url: 'https://wm.hengdikeji.com/api/authorize',
      data: {
        parent_id: '0',
        password: '111111',
        name: openid,
        nickName: that.globalData.userInfo.nickName,
        avatar: that.globalData.userInfo.avatarUrl,
        gender: that.globalData.userInfo.gender,
        grant_type: 'password',
        client_id: '23',
        client_secret: '0usgaQLHyF4diBWIxk56JOGaFaNu9R7vW1jUE4Tm'
      },
      method: 'POST',
      success: function({data}) {
        console.log('access_token:', data);
        that.globalData.accessTokenData = data;
        try {
            wx.setStorageSync('access_token', data);
            wx.setStorageSync('saveTime', -(-data.expires_in) + myDate);                      
        } catch (e) {    
        }
      }
    });
  },

  getOpenid: function(){
    var that = this;
    wx.login({
      success: function ({code}) {
        console.log('wx.login:', code)
        if (code) {
          //发起网络请求
          wx.request({
          url: 'https://wm.hengdikeji.com/api/login',
          data: {
            code: code,
          },
          success: function({data: {openid}}) {
            console.log('wx.login:', openid);
            // that.getAccessToken(openid);
            that.isGetAccess(openid);
          }
        });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },

  isGetAccess: function(openid) {
    var that = this;
    var myDate = new Date().getTime();
    try {
      var saveTime = wx.getStorageSync('saveTime');
      if (saveTime) {
          console.log('value', saveTime)
          if (saveTime > myDate + 120) {
            var access_token = wx.getStorageSync('access_token');
          } else {
            that.getAccessToken(openid);
          }
      } else {
        that.getAccessToken(openid);
      }
    } catch (e) {
    }
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo;
          that.getOpenid();
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null,
  }
})
