//index.js
//获取应用实例
var component = require('../../templates/component.js');
var app = getApp()
Page({
  data: {
    userInfo: {},
    isMask: false,
    myFriends:{},
    page: null,
  },
  //事件处理函数

  onShow: function () {
    var that = this;
    var datas = app.globalData.myFriends;
    var myFriends = datas.data;
   
    var userInfo = {
      nickName: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      myRun: datas.myRun,
      myPoint: app.globalData.userData.integral,
      myRink: datas.myRank,
    }
    that.setData({
      myFriends: myFriends,
      userInfo: userInfo,
      page: datas.next_page_url
    })
  },
  onReachBottom: function () {
    var that = this;
    var data = app.globalData.accessTokenData;
    if (that.data.page !== false) {
      that.showToast('正在加载中', 'loading')
      if (!that.data.page) {
        setTimeout(function () {
          that.showToast('已加载全部', 'success')
        }, 500)
        that.setData({
          lockPage: that.data.page
        })
        return;
      };
      wx.request({
        url: 'https://wm.hengdikeji.com/api/v1/myFriends',
        header: {
          Authorization: data.token_type + ' ' + data.access_token,
        },
        data: {
          page: that.data.page,
        },
        success: function ({ data }) {
          var friends = that.data.myFriends;
      
          for (var i = 0, len = data.data.length; i < len; i++) {
            friends.push(data.data[i]);
          }
          that.setData({
            myFriends: friends,
            page: data.next_page_url,
          })
          return;
        }
      });
    }
  },
  onShareAppMessage: function () {
    return {
      title: '完美邀您挑战百万俱乐部',
      path: '/pages/home/home?id=' + app.globalData.userData.id,
    }
  },
  showToast: function (title, type) {
    wx.showToast({
      title: title,
      icon: type,
    })
  },
})
