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
    buttonTip: '',
    buttonFun: '',
    selectFun: '',
    sexIndex: -1,
    sexArray: ['男', '女'],
    isNotWrite: false,
  },
 /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(res) {
    console.log('!!!!!!!!!!!!!!!!!!!!', res)
  },
  onShow: function (options) {
    var that = this;
    app.appInitData(function(globalData){
      that.initData();
    })
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
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sexIndex: e.detail.value
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

  showToast: function(title) {
    wx.showToast({
      title: title,
    })
  },

  postUserData: function() {
    var that = this;
    // if (!that.data.inputName && !that.data.initData.name) {
    //   that.showToast('请填写姓名！')
    //   return;
    // }
    // if (!that.data.inputWork && !that.data.initData.jobType) {
    //   that.showToast('请填写工作类型！')
    //   return;
    // }
    // if (!that.data.inputPhone && !that.data.initData.mobile) {
    //   that.showToast('请填写电话！')
    //   return;
    // }
    // if (!that.data.inputAddress && !that.data.initData.address) {
    //   that.showToast('请填写详细地址！')
    //   return;
    // }
    // if (!that.data.inputAge && !that.data.initData.age) {
    //   that.showToast('请填写年龄！')
    //   return;
    // }
    // if (!that.data.areaInfo.p && !that.data.initData.p) {
    //   that.showToast('请选择所在省份！')
    //   return;
    // }
    // if (!that.data.areaInfo.c && !that.data.initData.c) {
    //   that.showToast('请选择所在城市！')
    //   return;
    // }
    // if (!that.data.areaInfo.a && !that.data.initData.a) {
    //   that.showToast('请选择所在地区！')
    //   return;
    // }
    wx.request({
      url: 'https://wm.hengdikeji.com/api/v1/addres',
      method: 'POST',
      data: {
        gender: that.data.sexIndex + 1,
        name: that.data.inputName || that.data.initData.name,
        jobType: that.data.inputWork || that.data.initData.jobType,
        mobile: that.data.inputPhone || that.data.initData.mobile,
        address: that.data.inputAddress || that.data.initData.address,
        age: that.data.inputAge || that.data.initData.age,
        p: that.data.areaInfo.p || that.data.initData.p,
        c: that.data.areaInfo.c || that.data.initData.p,
        a: that.data.areaInfo.a ||　that.data.initData.p,
      },
      header: {
        Authorization: app.globalData.accessTokenData.token_type + ' ' + app.globalData.accessTokenData.access_token,
      },
      success: function(res) {
        that.showToast('保存成功！')
        console.log('postUserData', res);
        that.setData({
          buttonTip: '修改信息',
          buttonFun: 'modifyInfo',
          selectFun: '',
          isNotWrite: true,
        })
        if (res.data.code === 0) {
          that.showToast(res.data.msg);
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

  modifyInfo: function() {
    var that = this;
    that.setData({
      buttonTip: '保存',
      buttonFun: 'postUserData',
      isNotWrite: false,
      selectFun: 'selectDistrict',
    })
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
        if (!data.name) {
          that.setData({
            sexIndex: data.gender ? data.gender - 1 : app.globalData.userInfo.gender - 1,
            buttonTip: '保存',
            buttonFun: 'postUserData',
            selectFun: 'selectDistrict',
            isNotWrite: false,
          })
          return;
        }
        that.setData({
          initData: data,
          areaName: data.p + ' ' + data.c + ' ' + data.a,
          areaInfoColor: data.p || data.c || data.a ? '#333' : '#c7c6cc',
          address: data.address,
          addressTip: data.address ? '' : '地区信息',
          sexIndex: data.gender ? data.gender - 1 : app.globalData.userInfo.gender - 1,
          isNotWrite: true,
          buttonFun: 'modifyInfo',
          selectFun: '',
          buttonTip: '修改信息',
        })
      }
    })
  }
 
})