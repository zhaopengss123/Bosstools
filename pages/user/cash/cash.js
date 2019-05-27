const Http = require('../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageStart:0,
    detail:{},
    activityList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({ userInfo: res.data });
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
    Http.get('/my/bossWallet', {
      paramJson:JSON.stringify({
        voucher: this.data.userInfo.voucher,
        pageStart: this.data.pageStart
      })
    }).then(res => {
      if (res.result == 1000) {
        let arr = [];
        arr = this.data.activityList.concat(res.data.activityList);
          this.setData({
            detail: res.data,
            activityList: arr,
            pageStart: res.data.pageEnd,
            
          })
      } else {
        wx.showModal({
          title: '系统异常',
          content: res.message,
        })
      }
      wx.stopPullDownRefresh();
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
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})