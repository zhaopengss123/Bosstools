const Http = require('../../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    pageStart:0,
    cashRecordList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
       that.setData({ userInfo: res.data })
        that.getData();
      },
      fail() {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    });
  },
  getData(){
    wx.showLoading({
      title: '加载中……',
    })
    let paramJson = JSON.stringify({
      voucher: this.data.userInfo.voucher,
      pageStart: this.data.pageStart
    })
    Http.get('/cash/cashrecord', {
      paramJson
    }).then(res => {
      wx.hideLoading();
      if (res.result == 1000) {
        
        let arr = [];
        arr = this.data.cashRecordList.concat(res.data.cashRecordList);
        this.setData({
          cashRecordList: arr,
          pageStart: res.data.pageEnd
        })
      } else {
        wx.showModal({
          title: '系统异常',
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
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    this.getData();
  },
})