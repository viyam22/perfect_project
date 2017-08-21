//app.js
App({
  onLaunch: function(res) {
    var that = this;

    that.globalData.shareId = res.query.id || '0';

    that.appInitData();
  
  },

  appInitData: function(cb, id) {
    var that = this;
    that.getUserInfo(function(data){
      that.getOpenid(function (openid) {
        that.isGetAccess(openid, function (data) {
          that.getWxRunData();
          that.exchangeData(function (data) {
            that.getUserData(function (data) {
              that.todayRinking(function (data) {
                that.totalRinking(function (data) {
                 
                  typeof cb == "function" && cb(that.globalData)
                })
              });
            });
          });
          that.myFriends(function (data) {
            typeof cb == "function" && cb(that.globalData)
          });
        });
      });
    });
  },

  exchangeData: function(cb) {
    var that = this;
    var data = that.globalData.accessTokenData;
    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/cList',
      header: {
        Authorization: data.token_type + ' ' + data.access_token,        
      },
      success: function({data}) {
        that.globalData.exchangeData = data.reverse();
        typeof cb == "function" && cb(that.globalData.exchangeData)
      }
    })
  },

  getOpenid: function(cb){
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
            typeof cb == "function" && cb(openid)
          }
        });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },

  isGetAccess: function(openid, cb) {
    var that = this;
    var myDate = new Date().getTime();
    try {
      var saveTime = wx.getStorageSync('saveTime');

      if (saveTime && saveTime > myDate + 120) {
          that.globalData.accessTokenData = wx.getStorageSync('access_token');
          typeof cb == "function" && cb(wx.getStorageSync('access_token'))
      } else {
        wx.request({
          url: 'https://wm.hengdikeji.com/api/authorize',
          data: {
            parent_id: that.globalData.shareId,
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
            that.globalData.accessTokenData = data;
            try {
                wx.setStorageSync('access_token', data);
                wx.setStorageSync('saveTime', -(-data.expires_in) + myDate);                      
            } catch (e) {    
            }
            typeof cb == "function" && cb(data)
        }
        });
      }
    } catch (e) {
     
    }
  },

  getUserInfo: function(cb) {
    var that = this
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.userInfo)
      
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo;
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  getWxRunData: function() {
    var that = this;
    var data = that.globalData.accessTokenData;
    wx.getWeRunData({
      success(res) {
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
          }
        })
      }
    })
  },

  getUserData: function(cb){
    var that = this;
    var data = that.globalData.accessTokenData;
    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/user',
      header: {
        Authorization: data.token_type + ' ' + data.access_token,
      },
      success: function({data}) {
        that.globalData.userData = data;
       
        typeof cb == "function" && cb(that.globalData.userData)
      }
    });
  },

  todayRinking: function(cb) {
    var that = this;
    var data = that.globalData.accessTokenData;
    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/daily',
      header: {
        Authorization: data.token_type + ' ' + data.access_token,
      },
      success: function({data}) {
        that.globalData.todayRinking = data;
        typeof cb == "function" && cb(that.globalData.todayRinking)
      }
    });
  },

  totalRinking: function(cb) {
    var that = this;
    var data = that.globalData.accessTokenData;
    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/totalRank',
      header: {
        Authorization: data.token_type + ' ' + data.access_token,
      },
      success: function({data}) {
        that.globalData.totalRinking = data;
        typeof cb == "function" && cb(that.globalData.todayRinking)
      }
    });
  },
  myFriends:function(cb){
    var that = this;
    var data = that.globalData.accessTokenData;
    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/myFriends',
      header: {
        Authorization: data.token_type + ' ' + data.access_token,
      },
      success: function ({ data }) {
        that.globalData.myFriends = data;
        typeof cb == "function" && cb(that.globalData.myFriends)
      }
    });
  },
  globalData: {
    userInfo: null,
    accessTokenData: null,
    exchangeData: null,
    userData: null,
    todayRinking: null,
    totalRinking: null,
    myFriends:null,
    query:null,
  }
})
