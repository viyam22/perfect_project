var app = getApp()
Page({
  data: {
    tagDayClass: 'tag-green',
    tagTotalClass: '',
    userInfo: {},
    rinkingData: {},
    todayRinking: {},
    totalRinking: {},
    todayPage: null,
    todayLockPage: null,
    totalPage: null,
    totalLockPage: null,
    tagIndex: 0,
  },

  onShow: function () {
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo,
      todayRinking: app.globalData.todayRinking,
      totalRinking: app.globalData.totalRinking,
      rinkingData: app.globalData.todayRinking,
      todayPage: app.globalData.todayRinking.next_page_url,
      totalPage: app.globalData.totalRinking.next_page_url
    })
  },

  selectTag: function(e) {
    var that = this;
    if (e.target.dataset.index == 0) {
      that.setData({
        tagDayClass: 'tag-green',
        tagTotalClass: '',
        rinkingData: that.data.todayRinking,
        tagIndex: 0,
      })
      
    } else if (e.target.dataset.index == 1) {
      that.setData({
        tagDayClass: '',
        tagTotalClass: 'tag-green',

        rinkingData: that.data.totalRinking,
        tagIndex: 1,
      })
    }
  },

  onShareAppMessage: function () {
    return {
      title: '完美邀您挑战百万俱乐部',
      path: '/pages/home/home?id=' + app.globalData.userData.id,
    }
  },

  onReachBottom: function() {
    var that = this;
    var data = app.globalData.accessTokenData;
    if (that.data.tagIndex === 0 && that.data.todayPage !== that.data.todayLockPage) {
      that.showToast('正在加载中', 'loading')
      if (!that.data.todayPage) {
        setTimeout(function() {
          that.showToast('已加载全部', 'success')
        }, 500)
        that.setData({
          todayLockPage: that.data.todayPage
        })
        return;
      }
      wx.request({
        url: 'https://wm.hengdikeji.com/api/v1/daily',
        header: {
          Authorization: data.token_type + ' ' + data.access_token,
        },
        data: {
          page: that.data.todayPage,
        },
        success: function({data}) {
          var todayRinking = that.data.todayRinking;
          for(var i = 0, len = data.data.length; i < len; i++){
            todayRinking.data.push(data.data[i]);
          }
          that.setData({
            todayRinking: todayRinking,
            rinkingData: todayRinking,
            todayPage: data.next_page_url,
            todayLockPage: that.data.todayPage,
          })
          return;
        }
      });
    } else if(that.data.tagIndex === 1 && that.data.totalPage !== that.data.totalLockPage) {
      that.showToast('正在加载中', 'loading')
      if (!that.data.totalPage) {
        setTimeout(function() {
          that.showToast('已加载全部', 'success')
        }, 500)
        that.setData({
          totalLockPage: that.data.totalPage
        })
        return;
      }
      wx.request({
        url: 'https://wm.hengdikeji.com/api/v1/totalRank',
        header: {
          Authorization: data.token_type + ' ' + data.access_token,
        },
        data: {
          page: that.data.totalPage,
        },
        success: function({data}) {
          var totalRinking = that.data.totalRinking;
          for(var i = 0, len = data.data.length; i < len; i++){
            totalRinking.data.push(data.data[i]);
          }
          that.setData({
            totalRinking: totalRinking,
            rinkingData: totalRinking,
            totalPage: data.next_page_url,
            totalLockPage: that.data.totalPage,
          })
          return;
        }
      });
    }
  },

  showToast: function(title, type) {
    wx.showToast({
      title: title,
      icon: type,
    })
  },
})
