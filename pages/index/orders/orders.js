const Http = require('../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateList:[],
    selectDate:0,
    selectHour:1000,
    hoursList: [],
    babyType: 1,
    teacherList:[],
    teachNum : 1000 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({ 
          userInfo: res.data,
          memberId: options.memberId, 
          storeId: options.storeId,
          babyType: options.babyType == '幼儿' ?  1 : 0
            });
        that.getData();
      },
      fail() {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getData(){
    wx.showLoading({
      title: '加载中……',
    })
    Http.get('/reserve/listStoreDayConfig', {
      voucher: this.data.userInfo.voucher
    }).then(res => {
      if (res.result == 1000) {
          res.data.map(item=>{
            item.dates = item.date.substring(8 , 10);
            item.week = item.week.substring(2, 3);
          })
          this.setData({
            dateList:res.data,
            teachNum: 1000,
            selectHour: 1000
          })
          this.getHours();
      } else {
        wx.showModal({
          title: '提示',
          content: res.message,
        })
      }
      wx.hideLoading();
    }, err => {
      wx.showModal({
        title: '网络错误',
        content: '请检查网络',
        showCancel: false
      })
      wx.hideLoading();
    });
  },
  touchDate(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      selectDate: index
    })
    this.getHours();
  },
  
  getHours(){
    wx.showLoading({
      title: '加载中……',
    })
    Http.get('/reserve/listStoreHourConfig', {
      storeId: this.data.storeId,
      date: this.data.dateList[this.data.selectDate].date,
      memberId : this.data.memberId
    }).then(res => {
      if (res.result == 1000) {
        this.setData({
          hoursList: res.data.list,
          teachNum: 1000
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.message,
        })
      }
      wx.hideLoading();
    }, err => {
      wx.showModal({
        title: '网络错误',
        content: '请检查网络',
        showCancel: false
      })
      wx.hideLoading();
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 13023098892
  selecthourBtn(e){
    let index = e.currentTarget.dataset.index;
    let flag = e.currentTarget.dataset.flag;
    if (flag != 'false'){
      this.setData({
        selectHour: index
      })
      this.getTeachList();
    }
  },
  getTeachList(){
    wx.showLoading({
      title: '加载中……',
    })
    Http.get('/reserve/listReserveTeachers', {
      storeId: this.data.storeId,
      date: this.data.dateList[this.data.selectDate].date,
      memberId: this.data.memberId,
      hour: this.data.hoursList[this.data.selectHour].hour,
      babyType: this.data.babyType
    }).then(res => {
      if (res.result == 1000) {
        this.setData({
          teacherList: res.data
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.message,
        })
      }
      wx.hideLoading();
    }, err => {
      wx.showModal({
        title: '网络错误',
        content: '请检查网络',
        showCancel: false
      })
      wx.hideLoading();
    });   
  },
  selectTeacherBtn(e){
    console.log(e);
    let index = e.currentTarget.dataset.index;
    this.setData({
      teachNum: index
    })   
  },
  //确定预约
  submit(){
    wx.showLoading({
      title: '加载中……',
      mask: true
    })
    Http.get('/reserve/doMemberReserve', {
      storeId: this.data.storeId,
      date: this.data.dateList[this.data.selectDate].date,
      memberId: this.data.memberId,
      hour: this.data.hoursList[this.data.selectHour].hour,
      minute: this.data.hoursList[this.data.selectHour].minute,
      babyType: this.data.babyType,
      sourceType: 5,
      teacherId: this.data.teacherList[this.data.teachNum].id
    }).then(res => {
      if (res.result == 1000) {
        setTimeout(function(){
          wx.showToast({
            title: '预约成功！',
            mask: true,
            duration: 2000
          })

          setTimeout(function () {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }, 2000);

        },100);

      } else {
        wx.showModal({
          title: '提示',
          content: res.message,
        })
      }
      wx.hideLoading();
    }, err => {
      wx.showModal({
        title: '网络错误',
        content: '请检查网络',
        showCancel: false
      })
      wx.hideLoading();
    });   
  }
})