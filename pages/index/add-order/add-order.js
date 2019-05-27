const Http = require('../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:null,
    memberDetail:{}
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
      },
      fail() {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    });
  },

  getData(){
    let paramJson = JSON.stringify({
      voucher: this.data.userInfo.voucher,
      phoneNumber: this.data.phone,
    })
    wx.showLoading({
      title: '加载中……',
    })
    Http.get('/reserve/memberlist', {
      paramJson
    }).then(res => {
      if (res.result == 1000) {
          this.setData({
            memberDetail:res.data
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
  shachPhone(){
    this.getData();
  },
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  orderBtn(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../orders/orders?memberId=${id}&storeId=${this.data.memberDetail.storeId}&babyType=${this.data.memberDetail.babyType}`,
    })
  }
})