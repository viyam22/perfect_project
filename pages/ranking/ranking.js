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
    totalPage: null,
    tagIndex: 0,
  },

  onShow: function () {
    var that = this;
    console.log('~~~~~~', app.globalData)
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

  onPullDownRefresh: function() {
    var that = this;
    var data = app.globalData.accessTokenData;
    if (that.data.tagIndex === 0) {
      if (!that.data.todayPage) {
        wx.stopPullDownRefresh();
        that.showToast('已无更多！')
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
          wx.stopPullDownRefresh();
          var todayRinking = that.data.todayRinking;
          for(var i = 0, len = data.data.length; i < len; i++){
            todayRinking.data.push(data.data[i]);
          }
          that.setData({
            todayRinking: todayRinking,
            rinkingData: todayRinking,
            todayPage: data.next_page_url,
          })
          wx.stopPullDownRefresh;
          return;
        }
      });
    } else if(that.data.tagIndex === 1) {
      if (!that.data.totalPage) {
        wx.stopPullDownRefresh();
        that.showToast('已无更多！')
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
          wx.stopPullDownRefresh();
          var totalRinking = that.data.totalRinking;
          for(var i = 0, len = data.data.length; i < len; i++){
            totalRinking.data.push(data.data[i]);
          }
          console.log('+++*******&&&&&&&&', totalRinking);
          that.setData({
            totalRinking: totalRinking,
            rinkingData: totalRinking,
            totalPage: data.next_page_url
          })
          return;
        }
      });
    }
  },

  showToast: function(title) {
    wx.showToast({
      title: title,
    })
  },
})
