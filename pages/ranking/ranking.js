//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    tagDayClass: 'tag-green',
    tagTotalClass: '',
  },
  //事件处理函数
  selectTag: function(e) {
    var that = this;
    if (e.target.dataset.index == 0) {
      that.setData({
        tagDayClass: 'tag-green',
        tagTotalClass: '',
      })
    } else if (e.target.dataset.index == 1) {
      that.setData({
        tagDayClass: '',
        tagTotalClass: 'tag-green',
      })
    }
  },
  onLoad: function () {
  }
})
