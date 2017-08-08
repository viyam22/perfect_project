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
        that.getWxRunData(data);
        that.exchangeData(data);
        that.getUserData(data);
        that.todayRinking(data);
        that.totalRinking(data);
        that.globalData.accessTokenData = data;
        try {
            wx.setStorageSync('access_token', data);
            wx.setStorageSync('saveTime', -(-data.expires_in) + myDate);                      
        } catch (e) {    
        }
      }
    });
  },

  exchangeData: function(data) {
    var that = this;
    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/cList',
      header: {
        Authorization: data.token_type + ' ' + data.access_token,        
      },
      success: function({data}) {
        that.globalData.exchangeData = data.reverse();
        console.log('exchangeData----', that.globalData.exchangeData);
      }
    })
  },

  getOpenid: function(){
    var that = this;
    wx.login({
      success: function ({code}) {
        if (code) {
          //发起网络请求
          wx.request({
          url: 'https://wm.hengdikeji.com/api/login',
          data: {
            code: code,
          },
          success: function({data: {openid}}) {
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
            that.globalData.accessTokenData = wx.getStorageSync('access_token');
            that.getWxRunData(wx.getStorageSync('access_token'));
            that.exchangeData(wx.getStorageSync('access_token'));
            that.getUserData(wx.getStorageSync('access_token'));
            that.todayRinking(wx.getStorageSync('access_token'));
            that.totalRinking(wx.getStorageSync('access_token'));
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
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.userInfo)
      console.log('#### 有啦！！！！')
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          console.log('#### -------  没有的 ！！！！')
          that.globalData.userInfo = res.userInfo;
          that.getOpenid();
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  getWxRunData: function(data) {
    var that = this;
    wx.getWeRunData({
      success(res) {
        console.log('getWxRunData:', res);
        const encryptedData = res.encryptedData
        wx.request({
          url: 'https://wm.hengdikeji.com/api/v1/movement',
          method: 'POST',
          data: {
            encryptedData: res.encryptedData,
            iv: res.iv,
          },
          header: {
            Authorization: data.token_type + ' ' + data.access_token,
          },
          success: function(res) {
            console.log('movement:', res);
          }
        })
      }
    })
  },

  getUserData: function(data){
    console.log('##############')
    var that = this;
    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/user',
      header: {
        Authorization: data.token_type + ' ' + data.access_token,
      },
      success: function({data}) {
        that.globalData.userData = data;
        console.log('getUserData', data);
      }
    });
  },

  todayRinking: function(data) {
    var that = this;
    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/daily',
      header: {
        Authorization: data.token_type + ' ' + data.access_token,
      },
      success: function({data}) {
        that.globalData.todayRinking = data;
        console.log('todayRinking', data);
      }
    });
  },

  totalRinking: function(data) {
    var that = this;
    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/totalRank',
      header: {
        Authorization: data.token_type + ' ' + data.access_token,
      },
      success: function({data}) {
        that.globalData.totalRinking = data;
        console.log('=====totalRinking', data);
      }
    });
  },

  globalData: {
    userInfo: null,
    accessTokenData: {},
    exchangeData: [],
    userData: {},
    todayRinking: {},
    totalRinking: {},
  }
})
