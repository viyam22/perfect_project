// directory.js
var address = require('../../utils/city.js')
var animation
var app = getApp();
Page({

  /**
   * 页面的初始数据
   * 当前    provinces:所有省份
   * citys选择省对应的所有市,
   * areas选择市对应的所有区
   * provinces：当前被选中的省
   * city当前被选中的市
   * areas当前被选中的区
   */
  data: {
    menuType: 0,
    begin: null,
    status: 1,
    end: null,
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province: '',
    city: '',
    area: '',
    areaName: '地区信息',
    areaInfo: {},
    areaInfoColor: '#c7c6cc',
    inputName: '',
    inputPhone: '',
    inputAddress: '',
    inputAge: '',
    inputWork: '',
    inputSex: '',
    accessTokenData: {},
    initData: {},
    addressTip: 'address',
  },
 /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.initData();
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    that.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    that.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
    console.log(that.data)

    // 获取性别
    var sex;
    if (app.globalData.userInfo.gender === 2) {
      sex = '女';
    } else {
      sex = '男';
    }
    that.setData({
      inputSex: sex
    })
  },

  // 显示
  showMenuTap: function (e) {
    console.log('selectState')
    //获取点击菜单的类型 1点击状态 2点击时间 
    var menuType = e.currentTarget.dataset.type
    // 如果当前已经显示，再次点击时隐藏
    if (this.data.isVisible == true) {
      this.startAnimation(false, -200)
      return
    }
    this.setData({
      menuType: menuType
    })
    this.startAnimation(true, 0)
  },
  hideMenuTap: function (e) {
    this.startAnimation(false, -200)
  },
  // 执行动画
  startAnimation: function (isShow, offset) {
    var that = this
    var offsetTem
    if (offset == 0) {
      offsetTem = offset
    } else {
      offsetTem = offset + 'rpx'
    }
    this.animation.translateY(offset).step()
    this.setData({
      animationData: this.animation.export(),
      isVisible: isShow
    })
    console.log(that.data)
  },
  // 选择状态按钮
  selectState: function (e) {
    console.log('selectState1')
    this.startAnimation(false, -200)
    var status = e.currentTarget.dataset.status
    this.setData({
      status: status
    })
    console.log(this.data)

  },
  // 日志选择
  bindDateChange: function (e) {
    console.log(e)
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        begin: e.detail.value
      })
    } else if (e.currentTarget.dataset.type == 2) {
      this.setData({
        end: e.detail.value
      })
    }
  },
  sureDateTap: function () {
    this.data.pageNo = 1
    this.startAnimation(false, -200)
  },
  
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    console.log('111111111')
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    console.log(isShow)
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = {
      p: that.data.provinces[value[0]].name,
      c: that.data.citys[value[1]].name,
      a: that.data.areas[value[2]].name
    }
    that.setData({
      areaInfo: areaInfo,
      areaName: that.data.provinces[value[0]].name + ' ' + that.data.citys[value[1]].name + ' ' + that.data.areas[value[2]].name,
      areaInfoColor: '#333'
    })
  },
  hideCitySelected: function (e) {
    console.log(e)
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    console.log(e)
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
    console.log(this.data)
  },

  //复制input中的地址
  copyAddress: function (e) {
    var that = this;
    that.setData({
      address: e.detail.value
    })
  },

  postUserData: function() {
    var that = this;
    if (!that.data.inputName) {
      alert('请填写姓名！')
      return;
    }
    if (!that.data.inputWork) {
      alert('请填写工作类型！')
      return;
    }
    if (!that.data.inputPhone) {
      alert('请填写电话！')
      return;
    }
    if (!that.data.inputAddress) {
      alert('请填写详细地址！')
      return;
    }
    if (!that.data.inputAge) {
      alert('请填写年龄！')
      return;
    }
    if (!that.data.areaInfo.p) {
      alert('请选择所在省份！')
      return;
    }
    if (!that.data.areaInfo.c) {
      alert('请选择所在城市！')
      return;
    }
    if (!that.data.areaInfo.a) {
      alert('请选择所在地区！')
      return;
    }

    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/addres',
      method: 'POST',
      data: {
        name: that.data.inputName,
        jobType: that.data.inputWork,
        mobile: that.data.inputPhone,
        address: that.data.inputAddress,
        age: that.data.inputAge,
        p: that.data.areaInfo.p,
        c: that.data.areaInfo.c,
        a: that.data.areaInfo.a,
      },
      header: {
        Authorization: app.globalData.accessTokenData.token_type + ' ' + app.globalData.accessTokenData.access_token,
      },
      success: function(res) {
        console.log('postUserData', res);
        if (res.data.code === 0) {
          alert(res.data.msg);
        }
      }
    })
  },

  getInputVal: function(e) {
    var that = this;
    var name = '', age = '', work = '', adress = '', phone = '';
    console.log('eeeeeee', e);
    if (e.target.dataset.type === 'name') {
      that.setData({
        inputName: e.detail.value,
      })
    };
    if (e.target.dataset.type === 'age') {
      that.setData({
        inputAge: e.detail.value,
      })
    };
    if (e.target.dataset.type === 'work') {
      that.setData({
        inputWork: e.detail.value,
      })
    };
    if (e.target.dataset.type === 'phone') {
      that.setData({
        inputPhone: e.detail.value,
      })
    };
    if (e.target.dataset.type === 'adress') {
      that.setData({
        inputAddress: e.detail.value,
      })
    };
  },

  initData: function() {
    var that = this;
    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/myAddres',
      header: {
        Authorization: app.globalData.accessTokenData.token_type + ' ' + app.globalData.accessTokenData.access_token,
      },
      success: function({data}) {
        console.log('getInputData', data);
        that.setData({
          initData: data,
          areaName: data.p + ' ' + data.c + ' ' + data.a,
          areaInfoColor: data.p || data.c || data.a ? '#333' : '#c7c6cc',
          address: data.address,
          addressTip: data.address ? '' : '地区信息',
        })
      }
    })
  }
 
})